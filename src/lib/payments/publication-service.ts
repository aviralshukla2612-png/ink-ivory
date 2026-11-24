import crypto from 'crypto';
import { store, PublicationRecord, InvitationRecord, PaymentOrderRecord } from '../store';
import { verifyOwnership } from '../auth';
import { logSecurityEvent } from '../security/logger';

export interface ActivatePublicationInput {
  orderId: string;
  paymentId?: string;
  requestedSlug?: string;
  actor?: string;
  baseUrl?: string;
}

export interface ActivationResult {
  success: boolean;
  publication: PublicationRecord;
  invitation: InvitationRecord;
  slug: string;
  invitationUrl: string;
  isIdempotent: boolean;
}

export class PublicationActivationService {
  /**
   * Activates an invitation publication atomically after verified payment capture.
   * Shared by both client verification (/api/payments/verify) and webhook (/api/payments/webhook).
   */
  static async activate(input: ActivatePublicationInput): Promise<ActivationResult> {
    const { orderId, requestedSlug, actor = 'SYSTEM' } = input;

    // 1. Retrieve the Order
    const order = await store.getPaymentOrder(orderId);
    if (!order) {
      throw new Error(`Order "${orderId}" not found for publication.`);
    }

    // 2. Confirm Order Payment Status is Genuinely Captured / Paid
    const allPayments = (store as any).data?.payments || [];
    const isPaymentCaptured =
      order.status === 'PAID' ||
      allPayments.some((p: any) => p.orderId === orderId && p.status === 'CAPTURED');

    if (!isPaymentCaptured) {
      logSecurityEvent({
        event: 'PUBLICATION_ATTEMPT_WITHOUT_PAYMENT_REJECTED',
        level: 'CRITICAL',
        details: { orderId, orderStatus: order.status },
      });
      throw new Error(`Cannot activate publication: Order "${orderId}" does not have verified captured payment.`);
    }

    // 3. Retrieve and Validate Draft Ownership
    const draft = await store.getDraft(order.draftId);
    if (!draft) {
      throw new Error(`Draft "${order.draftId}" associated with order "${orderId}" not found.`);
    }

    if (!verifyOwnership(draft, order.guestToken)) {
      logSecurityEvent({
        event: 'PUBLICATION_IDOR_OWNERSHIP_MISMATCH',
        level: 'CRITICAL',
        details: { orderId, draftId: draft.id, orderGuestToken: order.guestToken },
      });
      throw new Error(`Security violation: Customer does not own draft "${draft.id}".`);
    }

    const host = input.baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://youaremine.online';
    const protocol = host.startsWith('http') ? '' : 'https://';
    const fullHost = host.startsWith('http') ? host : `${protocol}${host}`;

    // 4. Idempotency Guard: Check if a publication already exists for this draft or order
    const allPublications = (store as any).data?.publications || [];
    const allInvitations = (store as any).data?.invitations || [];

    const existingPublication = allPublications.find(
      (p: PublicationRecord) => p.draftId === draft.id || (order.notes?.publicationId && p.id === order.notes.publicationId)
    );

    if (existingPublication) {
      const existingInvitation = allInvitations.find(
        (inv: InvitationRecord) => inv.id === existingPublication.invitationId || inv.draftId === draft.id
      );

      const activeSlug = existingInvitation?.slug || existingPublication.snapshotData?.templateSlug || 'celebration';
      const invitationUrl = `${fullHost}/invite/${activeSlug}`;

      logSecurityEvent({
        event: 'PUBLICATION_IDEMPOTENT_RETURN',
        level: 'INFO',
        details: { orderId, draftId: draft.id, publicationId: existingPublication.id, slug: activeSlug },
      });

      return {
        success: true,
        publication: existingPublication,
        invitation: existingInvitation || {
          id: existingPublication.invitationId,
          slug: activeSlug,
          draftId: draft.id,
          templateId: draft.templateId,
          viewCount: 0,
          isPublic: true,
          createdAt: existingPublication.publishedAt,
          updatedAt: existingPublication.publishedAt,
        },
        slug: activeSlug,
        invitationUrl,
        isIdempotent: true,
      };
    }

    // 5. Stable, Collision-Safe Slug Allocation
    // If draft previously had an invitation record, preserve that exact slug
    const existingDraftInv = allInvitations.find((inv: InvitationRecord) => inv.draftId === draft.id);
    let finalSlug = existingDraftInv?.slug;

    if (!finalSlug) {
      let candidateSlug = (requestedSlug || draft.title || 'celebration')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (!candidateSlug || candidateSlug === 'untitled-invitation') {
        const names = draft.fields?.names ? String(draft.fields.names).toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
        candidateSlug = names ? `${names}-celebration` : 'celebration';
      }

      finalSlug = candidateSlug;
      let collisionCounter = 1;
      while (allInvitations.some((inv: InvitationRecord) => inv.slug === finalSlug && inv.draftId !== draft.id)) {
        finalSlug = `${candidateSlug}-${crypto.randomBytes(2).toString('hex')}`;
        collisionCounter++;
        if (collisionCounter > 20) break;
      }
    }

    // 6. Template Metadata Snapshot Lookup
    const allTemplates = (store as any).data?.templates || [];
    const template = allTemplates.find((t: any) => t.id === draft.templateId);

    // 7. Atomic Publication Execution
    const now = new Date().toISOString();
    const oneYearLater = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    // 7.1 Upsert InvitationRecord
    let invitation = allInvitations.find((inv: InvitationRecord) => inv.draftId === draft.id);
    if (!invitation) {
      invitation = {
        id: 'inv_' + crypto.randomUUID().slice(0, 8),
        slug: finalSlug,
        draftId: draft.id,
        templateId: draft.templateId,
        viewCount: 0,
        isPublic: true,
        createdAt: now,
        updatedAt: now,
      };
      allInvitations.push(invitation);
    } else {
      invitation.slug = finalSlug;
      invitation.isPublic = true;
      invitation.updatedAt = now;
    }

    // 7.2 Create Immutable PublicationRecord Snapshot with Complete Visual & Media Contracts
    const publication: PublicationRecord = {
      id: 'pub_' + crypto.randomUUID().slice(0, 8),
      draftId: draft.id,
      invitationId: invitation.id,
      orderId: order.orderId,
      templateId: draft.templateId,
      userId: draft.userId || order.userId,
      guestToken: draft.guestToken,
      version: draft.version || 1,
      snapshotData: {
        fields: JSON.parse(JSON.stringify(draft.fields || {})),
        design: JSON.parse(JSON.stringify(draft.design || {})),
        elements: JSON.parse(JSON.stringify(draft.design?.elements || draft.fields?.elements || [])),
        sections: JSON.parse(JSON.stringify(draft.design?.sections || draft.fields?.sections || [])),
        customAudioUrl: draft.customAudioUrl || draft.fields?.music_url || '',
        customAudioTitle: draft.customAudioTitle || draft.fields?.music_title || '',
        templateTitle: template?.title || order.notes?.templateTitle || 'You Are Mine Bespoke Invitation',
        templateSlug: template?.slug || finalSlug,
        previewImage: template?.previewImage || draft.fields?.cover_image || draft.fields?.image_url || '',
        rsvpConfig: JSON.parse(JSON.stringify(draft.fields?.rsvp || draft.design?.rsvp || {})),
        publishedSnapshotAt: now,
      },
      status: 'ACTIVE',
      publishedAt: now,
      expiresAt: oneYearLater,
    };

    allPublications.push(publication);

    // 7.3 Update Draft Status
    draft.status = 'PUBLISHED';
    draft.updatedAt = now;

    // 7.4 Update Order Status & Notes
    order.status = 'PAID';
    order.notes = {
      ...(order.notes || {}),
      publicationId: publication.id,
      slug: finalSlug,
      publishedAt: now,
      activatedBy: actor,
    };
    order.updatedAt = now;

    // Persist all state atomically to disk
    (store as any).save?.();

    // 7.5 Record Security Audit Log
    await store.logAudit({
      userId: draft.userId || order.userId,
      guestToken: draft.guestToken,
      action: 'PUBLICATION_ACTIVATED_SUCCESSFULLY',
      entityType: 'Publication',
      entityId: publication.id,
      metadata: {
        orderId,
        draftId: draft.id,
        slug: finalSlug,
        actor,
      },
    });

    const invitationUrl = `${fullHost}/invite/${finalSlug}`;

    return {
      success: true,
      publication,
      invitation,
      slug: finalSlug,
      invitationUrl,
      isIdempotent: false,
    };
  }
}

export default PublicationActivationService;
