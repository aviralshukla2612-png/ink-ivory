import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Sparkles, FolderOpen, AlertCircle } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { DraftsService } from '../../services/drafts.service';
import { PublicationsService } from '../../services/publications.service';
import { InvitationCard } from '../../components/invitations/InvitationCard';
import { InvitationActionModal } from '../../components/invitations/InvitationActionModal';
import { DeleteConfirmationModal } from '../../components/invitations/DeleteConfirmationModal';

const FILTERS = ['All', 'Drafts', 'Published'];

export default function InvitationsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // 1. Fetch Drafts
  const {
    data: drafts = [],
    isLoading: draftsLoading,
    isError: draftsError,
    refetch: refetchDrafts,
    isFetching: draftsFetching,
  } = useQuery({
    queryKey: ['customer-drafts'],
    queryFn: () => DraftsService.getDrafts(),
  });

  // 2. Fetch Publications
  const {
    data: publications = [],
    isLoading: pubsLoading,
    isError: pubsError,
    refetch: refetchPubs,
    isFetching: pubsFetching,
  } = useQuery({
    queryKey: ['customer-publications'],
    queryFn: () => PublicationsService.getPublications(),
  });

  const isLoading = draftsLoading || pubsLoading;
  const isRefreshing = draftsFetching || pubsFetching;

  // 3. Duplicate Mutation
  const duplicateMutation = useMutation({
    mutationFn: (draftId) => DraftsService.duplicateDraft(draftId),
    onSuccess: (newDraft) => {
      queryClient.invalidateQueries({ queryKey: ['customer-drafts'] });
      Alert.alert(
        'Draft Duplicated',
        `Successfully created a copy of your invitation: "${newDraft?.title || 'Draft (Copy)'}".`
      );
    },
    onError: (err) => {
      Alert.alert('Duplicate Failed', err.message || 'Unable to duplicate draft.');
    },
  });

  // 4. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (draftId) => DraftsService.deleteDraft(draftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-drafts'] });
      setDeleteModalVisible(false);
      setSelectedInvitation(null);
    },
    onError: (err) => {
      Alert.alert('Delete Failed', err.message || 'Unable to delete draft.');
    },
  });

  // Merge and sort unified invitation list
  const unifiedList = useMemo(() => {
    const formattedDrafts = drafts.map((d) => ({
      ...d,
      isPublished: false,
      status: 'DRAFT',
    }));

    const formattedPubs = publications.map((p) => ({
      ...p,
      isPublished: true,
      status: 'PUBLISHED',
      title: p.snapshotData?.fields?.headline || p.templateTitle || 'Celebration Invitation',
      fields: p.snapshotData?.fields || {},
      design: p.snapshotData?.design || {},
      thumbnail: p.snapshotData?.fields?.couple_photo,
    }));

    // Filter out draft if it was already published to avoid duplicates
    const publishedDraftIds = new Set(publications.map((p) => p.draftId));
    const activeDrafts = formattedDrafts.filter((d) => !publishedDraftIds.has(d.id));

    return [...formattedPubs, ...activeDrafts].sort(
      (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    );
  }, [drafts, publications]);

  // Derived filter counts
  const draftsCount = drafts.length;
  const publishedCount = publications.length;
  const allCount = draftsCount + publishedCount;

  // Filtered List
  const filteredList = useMemo(() => {
    if (activeFilter === 'Drafts') {
      return unifiedList.filter((item) => !item.isPublished);
    }
    if (activeFilter === 'Published') {
      return unifiedList.filter((item) => item.isPublished);
    }
    return unifiedList;
  }, [unifiedList, activeFilter]);

  const handleRefresh = async () => {
    await Promise.all([refetchDrafts(), refetchPubs()]);
  };

  const handleCardPress = (item) => {
    if (item.isPublished) {
      router.push(`/preview/${item.id}`);
    } else {
      router.push(`/editor/${item.id}`);
    }
  };

  const handleMorePress = (item) => {
    setSelectedInvitation(item);
    setActionModalVisible(true);
  };

  const handleEdit = (item) => {
    const targetDraftId = item.draftId || item.id;
    router.push(`/editor/${targetDraftId}`);
  };

  const handlePreview = (item) => {
    router.push(`/preview/${item.id}`);
  };

  const handleDuplicate = (item) => {
    duplicateMutation.mutate(item.id);
  };

  const handleDeletePrompt = (item) => {
    setSelectedInvitation(item);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedInvitation?.id) {
      deleteMutation.mutate(selectedInvitation.id);
    }
  };

  const handleCreateNew = () => {
    router.push('/explore');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="My Invitations" showNotification={false} />

      {/* Segmented Filter Pills */}
      <View style={styles.filtersContainer}>
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          const count =
            filter === 'All' ? allCount : filter === 'Drafts' ? draftsCount : publishedCount;

          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, isActive && styles.activeFilterChip]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
                {filter} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Invitations List / Skeletons / Empty */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading bespoke invitations...</Text>
        </View>
      ) : draftsError || pubsError ? (
        <View style={styles.centerContainer}>
          <AlertCircle size={40} color={Colors.primary} />
          <Text style={styles.errorTitle}>Unable to Load Invitations</Text>
          <Text style={styles.errorSubtitle}>Please check your connection and try again.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={handleRefresh}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredList.length === 0 ? (
        <View style={styles.centerContainer}>
          <View style={styles.emptyIconBox}>
            <FolderOpen size={44} color={Colors.gold} />
          </View>
          <Text style={styles.emptyTitle}>No Invitations Yet</Text>
          <Text style={styles.emptySubtitle}>
            {activeFilter === 'Drafts'
              ? 'You have no in-progress drafts.'
              : activeFilter === 'Published'
              ? 'You have not published any invitations yet.'
              : 'Choose a wedding or celebration template and start designing.'}
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={handleCreateNew}
            activeOpacity={0.85}
          >
            <Sparkles size={16} color={Colors.champagne} style={styles.exploreIcon} />
            <Text style={styles.exploreBtnText}>Explore Templates</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <InvitationCard
              invitation={item}
              onPress={() => handleCardPress(item)}
              onMorePress={() => handleMorePress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}

      {/* Floating Action Button (Create Invitation) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateNew}
        activeOpacity={0.85}
        accessibilityLabel="Create New Invitation"
      >
        <Plus size={26} color={Colors.champagne} strokeWidth={2.4} />
      </TouchableOpacity>

      {/* Action Bottom Sheet */}
      <InvitationActionModal
        visible={actionModalVisible}
        invitation={selectedInvitation}
        onClose={() => setActionModalVisible(false)}
        onEdit={handleEdit}
        onPreview={handlePreview}
        onDuplicate={handleDuplicate}
        onDeletePrompt={handleDeletePrompt}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationModal
        visible={deleteModalVisible}
        invitation={selectedInvitation}
        isDeleting={deleteMutation.isPending}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirmDelete={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.deepBurgundy,
  },
  filterText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeFilterText: {
    color: Colors.champagne,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 96,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'serif',
  },
  errorTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 4,
  },
  errorSubtitle: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  retryText: {
    color: Colors.champagne,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(216, 183, 123, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(216, 183, 123, 0.4)',
  },
  emptyTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    maxWidth: 280,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.deepBurgundy,
    elevation: 4,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  exploreIcon: {
    marginRight: 8,
  },
  exploreBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.champagne,
    letterSpacing: 0.3,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.gold,
  },
});
