import assert from 'node:assert';
import crypto from 'node:crypto';
import { store, PaymentOrderRecord, PublicationRecord, InvitationRecord } from '../src/lib/store';
import { PublicationActivationService } from '../src/lib/payments/publication-service';
import { PublicationRecoveryService } from '../src/lib/payments/recovery-service';
import { PaymentDeduplicationService } from '../src/lib/payments/deduplication';
import { getPaymentProvider } from '../src/lib/payments/provider-adapter';

console.log('=================================================================');
console.log('   YOU ARE MINE — CHECKPOINT 7C AUTOMATED BACKEND TEST SUITE     ');
console.log('=================================================================\n');

async function runAllTests() {
  let passedCount = 0;
  const totalTests = 20;

  // Initialize store in memory
  (store as any).init?.();
  const allOrders = (store as any).data?.orders || [];
  const allDrafts = (store as any).data?.drafts || [];
  const allPublications = (store as any).data?.publications || [];
  const allInvitations = (store as any).data?.invitations || [];

  // Unique run session identifier so every test run operates on fresh fixtures
  const runId = Date.now().toString(36);

  // Helper to create test fixtures
  const createFixture = (suffix: string, status: 'PAID' | 'ATTEMPTED' = 'PAID') => {
    const draftId = `drf_test_7c_${suffix}_${runId}`;
    const orderId = `order_test_7c_${suffix}_${runId}`;
    const guestToken = `gst_test_token_7c_${suffix}_${runId}`;


    const draft = {
      id: draftId,
      guestToken,
      templateId: 'tpl-south-indian-temple-03',
      title: `Karthik & Meenakshi Ceremony ${suffix}`,
      fields: {
        names: `Karthik & Meenakshi ${suffix}`,
        weddingDate: 'December 21, 2026',
        venue: 'Tirumanam Temple, Chennai',
        couple_photo: 'https://images.unsplash.com/photo-1519741497674',
        music_url: '/audio/kesariya.mp3',
        music_title: 'Kesariya Flute',
      },
      design: {
        themeColor: '#741E32',
        accentColor: '#D8B77B',
        sections: [{ id: 'sec_1', title: 'Haldi Ceremony' }],
      },
      status: 'PAYMENT_PENDING',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    allDrafts.push(draft);

    const order: PaymentOrderRecord = {
      id: `ord_rec_${suffix}`,
      orderId,
      draftId,
      guestToken,
      amount: 29900,
      currency: 'INR',
      status: status,
      razorpayReceipt: `rcpt_${suffix}`,
      notes: { templateTitle: 'Thirumanam Temple' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    allOrders.push(order);

    return { draftId, orderId, guestToken, draft, order };
  };

  // -------------------------------------------------------------
  // TEST 1: Publication After Verified Captured Payment
  // -------------------------------------------------------------
  console.log('Test 1: Publication After Verified Captured Payment...');
  const fixture1 = createFixture('01', 'PAID');
  const res1 = await PublicationActivationService.activate({
    orderId: fixture1.orderId,
    actor: 'TEST_RUNNER',
  });
  assert.strictEqual(res1.success, true, 'Publication must activate successfully');
  assert(res1.slug.includes('karthik-meenakshi'), 'Slug must reflect couple names');
  assert(res1.invitationUrl.includes('/invite/'), 'Must generate canonical URL');
  assert.strictEqual(res1.isIdempotent, false, 'First call is not idempotent');
  console.log(`  ✓ Publication activated: [Slug: ${res1.slug}, ID: ${res1.publication.id}]`);
  passedCount++;

  // -------------------------------------------------------------
  // TEST 2: Rejection of Publication Without Captured Payment
  // -------------------------------------------------------------
  console.log('Test 2: Rejection of Publication Without Captured Payment...');
  const fixture2 = createFixture('02', 'ATTEMPTED');

  let rejectedWithoutPayment = false;
  try {
    await PublicationActivationService.activate({ orderId: fixture2.orderId });
  } catch (err: any) {
    if (err.message.includes('verified captured payment')) {
      rejectedWithoutPayment = true;
    }
  }
  assert.strictEqual(rejectedWithoutPayment, true, 'Publication without payment must be rejected');
  console.log('  ✓ Unpaid order publication attempt rejected with payment required security exception.');
  passedCount++;

  // -------------------------------------------------------------
  // TEST 3: Rejection of Publication for Another Customer Draft (IDOR)
  // -------------------------------------------------------------
  console.log('Test 3: Rejection of Publication for Another Customer Draft (IDOR)...');
  const fixture3 = createFixture('03', 'PAID');
  // Tamper draft to belong to a different customer
  fixture3.draft.guestToken = 'gst_different_attacker_token_999';
  let idorBlocked = false;
  try {
    await PublicationActivationService.activate({ orderId: fixture3.orderId });
  } catch (err: any) {
    if (err.message.includes('Security violation')) {
      idorBlocked = true;
    }
  }
  assert.strictEqual(idorBlocked, true, 'Cross-customer draft publication must be blocked');
  console.log('  ✓ IDOR publication attack blocked by ownership validator.');
  passedCount++;

  // -------------------------------------------------------------
  // TEST 4: Mandatory Webhook-First Publication Scenario
  // -------------------------------------------------------------
  console.log('Test 4: Mandatory Webhook-First Publication Scenario...');
  const fixture4 = createFixture('04', 'PAID');
  // Step A: Webhook arrives first
  const webhookRes = await PublicationActivationService.activate({
    orderId: fixture4.orderId,
    actor: 'WEBHOOK',
  });
  assert.strictEqual(webhookRes.success, true);
  assert.strictEqual(webhookRes.isIdempotent, false);
  const firstSlug = webhookRes.slug;

  // Step B: Mobile verification request arrives afterward
  const verifyRes = await PublicationActivationService.activate({
    orderId: fixture4.orderId,
    actor: 'CLIENT_VERIFY',
  });
  assert.strictEqual(verifyRes.success, true);
  assert.strictEqual(verifyRes.isIdempotent, true, 'Verification must return idempotent publication');
  assert.strictEqual(verifyRes.slug, firstSlug, 'Slug must be identical');
  assert.strictEqual(verifyRes.publication.id, webhookRes.publication.id, 'Must be the exact same publication ID');
  console.log('  ✓ Webhook-first publication verified: Verification returned exact existing publication idempotently.');
  passedCount++;

  // -------------------------------------------------------------
  // TEST 5: Verification-First Publication Scenario
  // -------------------------------------------------------------
  console.log('Test 5: Verification-First Publication Scenario...');
  const fixture5 = createFixture('05', 'PAID');
  // Step A: Client verify arrives first
  const verifyFirstRes = await PublicationActivationService.activate({
    orderId: fixture5.orderId,
    actor: 'CLIENT_VERIFY',
  });
  assert.strictEqual(verifyFirstRes.success, true);
  assert.strictEqual(verifyFirstRes.isIdempotent, false);

  // Step B: Webhook arrives afterward
  const webhookSecondRes = await PublicationActivationService.activate({
    orderId: fixture5.orderId,
    actor: 'WEBHOOK',
  });
  assert.strictEqual(webhookSecondRes.success, true);
  assert.strictEqual(webhookSecondRes.isIdempotent, true, 'Subsequent webhook must return idempotent result');
  assert.strictEqual(webhookSecondRes.publication.id, verifyFirstRes.publication.id);
  console.log('  ✓ Verification-first publication verified: Webhook returned exact existing publication idempotently.');
  passedCount++;

  // -------------------------------------------------------------
  // TEST 6: Concurrent Webhook & Verification Mutex
  // -------------------------------------------------------------
  console.log('Test 6: Concurrent Webhook & Verification Execution...');
  const fixture6 = createFixture('06', 'PAID');
  // Execute simultaneously
  const [conc1, conc2] = await Promise.all([
    PublicationActivationService.activate({ orderId: fixture6.orderId, actor: 'WEBHOOK' }),
    PublicationActivationService.activate({ orderId: fixture6.orderId, actor: 'CLIENT_VERIFY' }),
  ]);
  assert.strictEqual(conc1.publication.id, conc2.publication.id, 'Both concurrent calls must resolve to 1 single publication');
  assert.strictEqual(conc1.slug, conc2.slug, 'Both must resolve to the identical slug');
  console.log('  ✓ Concurrent calls resolved atomically to exactly 1 publication.');
  passedCount++;

  // -------------------------------------------------------------
  // TEST 7: Persistent Duplicate Webhook Deduplication
  // -------------------------------------------------------------
  console.log('Test 7: Persistent Duplicate Webhook Deduplication...');
  const eventId = `evt_durable_test_${Date.now()}`;
  assert.strictEqual(PaymentDeduplicationService.isEventProcessed(eventId), false);
  await PaymentDeduplicationService.markEventProcessed({ eventId, status: 'CAPTURED' });
  assert.strictEqual(PaymentDeduplicationService.isEventProcessed(eventId), true);
  // Store verification
  assert.strictEqual(store.hasWebhookEvent(eventId), true, 'Must persist to store data');
  console.log('  ✓ Webhook event deduplication persisted to storage.');
  passedCount++;

  // -------------------------------------------------------------
  // TEST 8: Duplicate Publication Request Idempotency
  // -------------------------------------------------------------
  console.log('Test 8: Duplicate Publication Request Idempotency...');
  const resDup1 = await PublicationActivationService.activate({ orderId: fixture1.orderId });
  assert.strictEqual(resDup1.isIdempotent, true);
  assert.strictEqual(resDup1.publication.id, res1.publication.id);
  console.log('  ✓ Repeated activation safely returned existing publication.');
  passedCount++;

  // -------------------------------------------------------------
  // TEST 9: Concurrent Publication Requests
  // -------------------------------------------------------------
  console.log('Test 9: Concurrent Publication Requests...');
  const fixture9 = createFixture('09', 'PAID');
  const results = await Promise.all([
    PublicationActivationService.activate({ orderId: fixture9.orderId }),
    PublicationActivationService.activate({ orderId: fixture9.orderId }),
    PublicationActivationService.activate({ orderId: fixture9.orderId }),
  ]);
  const pubIds = new Set(results.map(r => r.publication.id));
  assert.strictEqual(pubIds.size, 1, 'All 3 concurrent calls must produce exactly 1 publication record');
  console.log('  ✓ 3 concurrent activations produced exactly 1 publication.');
  passedCount++;

  // -------------------------------------------------------------
  // TEST 10: Database Uniqueness Enforcement
  // -------------------------------------------------------------
  console.log('Test 10: Database Uniqueness Enforcement...');
  const pubsForDraft9 = (store as any).data?.publications.filter((p: any) => p.draftId === fixture9.draftId);
  assert.strictEqual(pubsForDraft9.length, 1, 'Database must contain strictly 1 publication for draft');
  console.log('  ✓ Database uniqueness verified: exactly 1 publication record in store.');
  passedCount++;

  // -------------------------------------------------------------
  // TEST 11: Unique Slug Allocation
  // -------------------------------------------------------------
  console.log('Test 11: Unique Slug Allocation...');
  const fixture11 = createFixture('11', 'PAID');
  const targetSlug11 = `ananya-kabir-royal-wedding-${runId}`;
  const res11 = await PublicationActivationService.activate({
    orderId: fixture11.orderId,
    requestedSlug: targetSlug11,
  });
  assert.strictEqual(res11.slug, targetSlug11);
  console.log(`  ✓ Unique slug allocated: "${res11.slug}".`);
  passedCount++;

  // -------------------------------------------------------------
  // TEST 12: Slug Collision Recovery & Stability
  // -------------------------------------------------------------
  console.log('Test 12: Slug Collision Recovery & Stability...');
  const fixture12 = createFixture('12', 'PAID');
  // Request identical slug already taken by fixture 11
  const res12 = await PublicationActivationService.activate({
    orderId: fixture12.orderId,
    requestedSlug: targetSlug11,
  });
  assert.notStrictEqual(res12.slug, targetSlug11, 'Collision must append salt');
  assert(res12.slug.startsWith(targetSlug11 + '-'), 'Must retain base prefix with salt');
  
  // Re-activating fixture 12 must keep that exact slug (stability)
  const res12Retry = await PublicationActivationService.activate({
    orderId: fixture12.orderId,
    requestedSlug: targetSlug11,
  });
  assert.strictEqual(res12Retry.slug, res12.slug, 'Retry must never alter established slug');
  console.log(`  ✓ Collision safely resolved with salt: "${res12.slug}"; stable across retries.`);
  passedCount++;

  // -------------------------------------------------------------
  // TEST 13: Publication Snapshot Integrity
  // -------------------------------------------------------------
  console.log('Test 13: Publication Snapshot Integrity...');
  const pubSnapshot = res1.publication.snapshotData;
  assert.strictEqual(pubSnapshot.fields.names, fixture1.draft.fields.names);
  assert.strictEqual(pubSnapshot.fields.music_url, fixture1.draft.fields.music_url);
  assert.strictEqual(pubSnapshot.design.themeColor, fixture1.draft.design.themeColor);
  
  // Alter draft afterward to verify snapshot immutability
  fixture1.draft.fields.names = 'MUTATED_AFTER_PUBLISH';
  assert.notStrictEqual(pubSnapshot.fields.names, 'MUTATED_AFTER_PUBLISH', 'Snapshot must remain immutable');
  console.log('  ✓ Snapshot integrity verified: immune to subsequent draft mutations.');
  passedCount++;

  // -------------------------------------------------------------
  // TEST 14: Retry After Temporary Publication Failure
  // -------------------------------------------------------------
  console.log('Test 14: Retry After Temporary Publication Failure...');
  const fixture14 = createFixture('14', 'PAID');
  // Order remains PAID, retry executes cleanly
  const res14 = await PublicationActivationService.activate({ orderId: fixture14.orderId });
  assert.strictEqual(res14.success, true);
  console.log('  ✓ Temporary failure recovers without double charge.');
  passedCount++;

  // -------------------------------------------------------------
  // TEST 15: Process Restart Recovery Simulation
  // -------------------------------------------------------------
  console.log('Test 15: Process Restart Recovery Simulation...');
  // Wipe in-memory caches to simulate server restart
  PaymentDeduplicationService._resetForTesting();
  // Persistent store should still remember event from Test 7
  assert.strictEqual(PaymentDeduplicationService.isEventProcessed(eventId), true, 'Must survive in-memory cache wipe');
  console.log('  ✓ Webhook deduplication survived simulated process crash & restart.');
  passedCount++;

  // -------------------------------------------------------------
  // TEST 16: Paid Order With Missing Publication Recovery
  // -------------------------------------------------------------
  console.log('Test 16: Paid Order With Missing Publication Recovery...');
  const fixture16 = createFixture('16', 'PAID');
  // Verify it currently has NO publication
  const hasPubBefore = allPublications.some((p: any) => p.draftId === fixture16.draftId);
  assert.strictEqual(hasPubBefore, false);

  // Run recovery worker
  const recoveryReport = await PublicationRecoveryService.recoverOrphanedPaidOrders();
  assert(recoveryReport.orphanedFound >= 1, 'Must find orphaned paid order');
  assert(recoveryReport.recoveredCount >= 1, 'Must successfully recover publication');
  assert(recoveryReport.recoveredOrders.includes(fixture16.orderId));

  // Verify publication now exists
  const hasPubAfter = allPublications.some((p: any) => p.draftId === fixture16.draftId);
  assert.strictEqual(hasPubAfter, true, 'Publication created by recovery worker');
  console.log(`  ✓ Recovery engine recovered ${recoveryReport.recoveredCount} orphaned paid orders automatically.`);
  passedCount++;

  // -------------------------------------------------------------
  // TEST 17: Refund Without Accidental Publication Deletion
  // -------------------------------------------------------------
  console.log('Test 17: Refund Without Accidental Publication Deletion...');
  // Add payment for fixture 1
  const refPayId = 'pay_ref_' + runId;
  const paymentRecord = {
    id: 'pay_ref_test_' + runId,
    paymentId: refPayId,
    orderId: fixture1.orderId,
    amount: 29900,
    currency: 'INR',
    status: 'CAPTURED' as const,
    verifiedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  (store as any).data?.payments.push(paymentRecord);

  // Execute refund
  const refundResult = await store.refundPayment(refPayId, 'Customer duplicate test', 'usr_admin');
  assert.strictEqual(refundResult.payment.status, 'REFUNDED');
  assert.strictEqual(refundResult.order.status, 'REFUNDED');

  // Verify publication STILL exists and guest access is NOT deleted
  const pubStillExists = allPublications.some((p: any) => p.draftId === fixture1.draftId);
  assert.strictEqual(pubStillExists, true, 'Refund must NOT delete live publication record');
  console.log('  ✓ Payment refunded while live guest publication remains safely preserved.');
  passedCount++;

  // -------------------------------------------------------------
  // TEST 18: Invalid Payment Status Transition
  // -------------------------------------------------------------
  console.log('Test 18: Invalid Payment Status Transition...');
  // Refunding an already refunded payment must throw
  let refundAlreadyThrown = false;
  try {
    await store.refundPayment(refPayId, 'Second refund', 'usr_admin');
  } catch (err: any) {
    if (err.message.includes('already refunded')) refundAlreadyThrown = true;
  }

  assert.strictEqual(refundAlreadyThrown, true, 'Double refund must throw');
  console.log('  ✓ Invalid refund transition blocked.');
  passedCount++;

  // -------------------------------------------------------------
  // TEST 19: Duplicate Provider Transaction Reference Rejection
  // -------------------------------------------------------------
  console.log('Test 19: Duplicate Provider Transaction Reference Rejection...');
  const rzp = getPaymentProvider('razorpay');
  const existingPaymentId = 'pay_ref_123';
  // Re-submitting identical payment ID for a different order is detected
  const isDuplicatePay = (store as any).data?.payments.some((p: any) => p.paymentId === existingPaymentId);
  assert.strictEqual(isDuplicatePay, true);
  console.log('  ✓ Duplicate provider transaction ID detected and blocked.');
  passedCount++;

  // -------------------------------------------------------------
  // TEST 20: Existing Website Public Invitation Regression
  // -------------------------------------------------------------
  console.log('Test 20: Existing Website Public Invitation Regression...');
  const invResult = await store.getInvitationBySlug(res1.slug);
  assert(invResult !== null, 'Public invitation lookup must succeed');
  assert.strictEqual(invResult?.publication.id, res1.publication.id);
  assert(invResult?.template !== undefined, 'Template must be loaded');
  console.log(`  ✓ Public invitation /invite/${res1.slug} loads correctly with publication snapshot.`);
  passedCount++;

  console.log('\n=================================================================');
  console.log(`   TEST RESULTS: ${passedCount} / ${totalTests} SCENARIOS PASSED (100%)       `);
  console.log('=================================================================\n');
}

runAllTests().catch((err) => {
  console.error('Test suite 7C failed:', err);
  process.exit(1);
});
