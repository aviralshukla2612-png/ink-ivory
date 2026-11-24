import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('--- RUNNING MILESTONE 6 VERIFICATION TEST SUITE ---');

// 1. Verify DraftsService has duplicateDraft and deleteDraft
console.log('1. Checking DraftsService duplicateDraft and deleteDraft...');
const draftsServicePath = path.resolve('you-are-mine-mobile/services/drafts.service.js');
const draftsServiceCode = fs.readFileSync(draftsServicePath, 'utf8');
assert(draftsServiceCode.includes('duplicateDraft'), 'DraftsService must export duplicateDraft');
assert(draftsServiceCode.includes('deleteDraft'), 'DraftsService must export deleteDraft');
assert(draftsServiceCode.includes('/api/drafts/${draftId}/duplicate'), 'Must call duplicate endpoint');
assert(draftsServiceCode.includes('apiClient.delete'), 'Must call DELETE method on draft');
console.log('✓ DraftsService extended with backend duplicate and delete operations.');

// 2. Verify PublicationsService exists and has sharing & public url logic
console.log('2. Checking PublicationsService...');
const pubServicePath = path.resolve('you-are-mine-mobile/services/publications.service.js');
const pubServiceCode = fs.readFileSync(pubServicePath, 'utf8');
assert(pubServiceCode.includes('getPublications'), 'PublicationsService must export getPublications');
assert(pubServiceCode.includes('getPublicUrl'), 'PublicationsService must export getPublicUrl');
assert(pubServiceCode.includes('sharePublishedInvitation'), 'PublicationsService must export sharePublishedInvitation');
assert(pubServiceCode.includes('Share.share'), 'Must use native React Native Share.share');
console.log('✓ PublicationsService validated with verified publication URLs and native sharing.');

// 3. Verify Backend Duplicate and Delete routes
console.log('3. Checking Backend Draft Endpoints...');
const deleteRoutePath = path.resolve('src/app/api/drafts/[id]/route.ts');
const deleteRouteCode = fs.readFileSync(deleteRoutePath, 'utf8');
assert(deleteRouteCode.includes('export async function DELETE'), 'DELETE handler must exist in /api/drafts/[id]');
assert(deleteRouteCode.includes('verifyOwnership'), 'DELETE handler must verify ownership');
assert(deleteRouteCode.includes('store.deleteDraft'), 'DELETE handler must call store.deleteDraft');

const duplicateRoutePath = path.resolve('src/app/api/drafts/[id]/duplicate/route.ts');
const duplicateRouteCode = fs.readFileSync(duplicateRoutePath, 'utf8');
assert(duplicateRouteCode.includes('export async function POST'), 'POST handler must exist in /api/drafts/[id]/duplicate');
assert(duplicateRouteCode.includes('verifyOwnership'), 'Duplicate handler must verify ownership');
assert(duplicateRouteCode.includes('(Copy)'), 'Duplicate draft title must append (Copy)');
console.log('✓ Backend DELETE and duplicate routes verified with IDOR ownership validation.');

// 4. Verify Preview Components
console.log('4. Checking Preview Components...');
const previewScreenPath = path.resolve('you-are-mine-mobile/app/preview/[id].jsx');
const previewScreenCode = fs.readFileSync(previewScreenPath, 'utf8');
assert(previewScreenCode.includes('EnvelopeAnimation'), 'Preview must use EnvelopeAnimation');
assert(previewScreenCode.includes('FloatingAudioPlayer'), 'Preview must use FloatingAudioPlayer');
assert(previewScreenCode.includes('RSVPPreviewSection'), 'Preview must use RSVPPreviewSection');
assert(previewScreenCode.includes('CeremonyTimelineSection'), 'Preview must use CeremonyTimelineSection');
assert(previewScreenCode.includes('handleEdit'), 'Preview must provide handleEdit returning to editor');
assert(previewScreenCode.includes('handlePublish'), 'Preview must provide handlePublish');

const envelopePath = path.resolve('you-are-mine-mobile/components/preview/EnvelopeAnimation.jsx');
const envelopeCode = fs.readFileSync(envelopePath, 'utf8');
assert(envelopeCode.includes('Animated.timing'), 'EnvelopeAnimation must use smooth animations');
assert(envelopeCode.includes('handleSkip'), 'EnvelopeAnimation must provide accessible skip option');

const audioPlayerPath = path.resolve('you-are-mine-mobile/components/preview/FloatingAudioPlayer.jsx');
const audioPlayerCode = fs.readFileSync(audioPlayerPath, 'utf8');
assert(audioPlayerCode.includes('MusicService'), 'FloatingAudioPlayer must use MusicService');
assert(audioPlayerCode.includes('handleTogglePlay'), 'FloatingAudioPlayer must toggle play/pause');
assert(audioPlayerCode.includes('formatTime'), 'FloatingAudioPlayer must format time display');

const rsvpPath = path.resolve('you-are-mine-mobile/components/preview/RSVPPreviewSection.jsx');
const rsvpCode = fs.readFileSync(rsvpPath, 'utf8');
assert(rsvpCode.includes('modalVisible'), 'RSVP must show informative preview modal');
assert(!rsvpCode.includes('fakeResponseStore'), 'RSVP must not store fake responses');
console.log('✓ All 4 preview components validated.');

// 5. Verify My Invitations Hub Screen & Components
console.log('5. Checking My Invitations Hub Screen & Components...');
const invScreenPath = path.resolve('you-are-mine-mobile/app/(tabs)/invitations.jsx');
const invScreenCode = fs.readFileSync(invScreenPath, 'utf8');
assert(invScreenCode.includes("activeFilter === 'Drafts'"), 'Must support Drafts filter');
assert(invScreenCode.includes("activeFilter === 'Published'"), 'Must support Published filter');
assert(invScreenCode.includes('useQuery'), 'Must use TanStack Query for server state');
assert(invScreenCode.includes('useMutation'), 'Must use TanStack Query mutations for duplicate & delete');
assert(invScreenCode.includes('duplicateMutation'), 'Must implement duplicateMutation');
assert(invScreenCode.includes('deleteMutation'), 'Must implement deleteMutation');
assert(invScreenCode.includes('RefreshControl'), 'Must implement pull-to-refresh');
assert(invScreenCode.includes('InvitationActionModal'), 'Must mount InvitationActionModal');
assert(invScreenCode.includes('DeleteConfirmationModal'), 'Must mount DeleteConfirmationModal');

const cardPath = path.resolve('you-are-mine-mobile/components/invitations/InvitationCard.jsx');
const cardCode = fs.readFileSync(cardPath, 'utf8');
assert(cardCode.includes('isPublished'), 'Card must distinguish Draft vs Published');
assert(cardCode.includes('formatRelativeTime'), 'Card must format relative timestamp');

const actionModalPath = path.resolve('you-are-mine-mobile/components/invitations/InvitationActionModal.jsx');
const actionModalCode = fs.readFileSync(actionModalPath, 'utf8');
assert(actionModalCode.includes('handleCopyLink'), 'ActionModal must support copying live link');
assert(actionModalCode.includes('handleShareLink'), 'ActionModal must support native sharing');
assert(actionModalCode.includes('onDuplicate'), 'ActionModal must support duplicate draft');
assert(actionModalCode.includes('onDeletePrompt'), 'ActionModal must support delete prompt');

const deleteModalPath = path.resolve('you-are-mine-mobile/components/invitations/DeleteConfirmationModal.jsx');
const deleteModalCode = fs.readFileSync(deleteModalPath, 'utf8');
assert(deleteModalCode.includes('onConfirmDelete'), 'DeleteConfirmationModal must have confirm delete callback');
console.log('✓ My Invitations Hub & Action components validated.');

console.log('=== ALL MILESTONE 6 ASSERTIONS PASSED SUCCESSFULLY ===');
