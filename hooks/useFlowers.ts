import { useState, useEffect, useCallback } from 'react';
import { DocumentSnapshot } from 'firebase/firestore';
import { FlowerService, ImageService } from '@/lib/firebase-services';
import { Flower } from '@/lib/types';

interface UseFlowersState {
  flowers: Flower[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  lastVisible: DocumentSnapshot | null;
}

export const useFlowers = (userId: string | null, searchQuery?: string) => {
  const [state, setState] = useState<UseFlowersState>({
    flowers: [],
    loading: false,
    error: null,
    hasMore: true,
    lastVisible: null,
  });

  // Load initial flowers
  const loadFlowers = useCallback(async (reset = false) => {
    if (!userId) return;

    try {
      setState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null,
        ...(reset && { flowers: [], lastVisible: null, hasMore: true })
      }));

      if (searchQuery && searchQuery.trim()) {
        // Search mode
        const searchResults = await FlowerService.searchFlowers(userId, searchQuery.trim());
        setState(prev => ({
          ...prev,
          flowers: reset ? searchResults : searchResults, // Always replace in search
          loading: false,
          hasMore: false, // Search doesn't support pagination yet
          lastVisible: null,
        }));
      } else {
        // Normal pagination mode
        const { flowers: newFlowers, lastVisible } = await FlowerService.getFlowers(
          userId,
          20,
          reset ? undefined : state.lastVisible || undefined
        );

        setState(prev => ({
          ...prev,
          flowers: reset ? newFlowers : [...prev.flowers, ...newFlowers],
          loading: false,
          hasMore: newFlowers.length === 20,
          lastVisible,
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load flowers',
      }));
    }
  }, [userId, searchQuery, state.lastVisible]);

  // Load more flowers (pagination)
  const loadMore = useCallback(async () => {
    if (!state.hasMore || state.loading || !userId) return;
    await loadFlowers(false);
  }, [loadFlowers, state.hasMore, state.loading, userId]);

  // Refresh flowers
  const refresh = useCallback(async () => {
    await loadFlowers(true);
  }, [loadFlowers]);

  // Add a new flower
  const addFlower = useCallback(async (
    flowerData: Omit<Flower, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
    imageFile?: File,
    backgroundFile?: File
  ): Promise<string> => {
    if (!userId) throw new Error('User not authenticated');

    try {
      let imageUrl = flowerData.imageUrl;
      let backgroundData = flowerData.background;

      // Upload image if provided
      if (imageFile) {
        imageUrl = await ImageService.uploadImage(imageFile, userId);
      }

      // Upload custom background if provided
      if (backgroundFile && backgroundData?.type === 'custom') {
        const backgroundUrl = await ImageService.uploadBackgroundImage(backgroundFile, userId);
        backgroundData = {
          ...backgroundData,
          value: backgroundUrl
        };
      }

      const flowerId = await FlowerService.addFlower({
        ...flowerData,
        imageUrl,
        background: backgroundData,
        userId,
      });

      // Refresh the list to include the new flower
      await refresh();

      return flowerId;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add flower');
    }
  }, [userId, refresh]);

  // Update a flower
  const updateFlower = useCallback(async (
    flowerId: string,
    updates: Partial<Flower>,
    newImageFile?: File
  ): Promise<void> => {
    if (!userId) throw new Error('User not authenticated');

    try {
      let imageUrl = updates.imageUrl;

      // Upload new image if provided
      if (newImageFile) {
        imageUrl = await ImageService.uploadImage(newImageFile, userId);
      }

      await FlowerService.updateFlower(flowerId, {
        ...updates,
        ...(imageUrl && { imageUrl }),
      });

      // Update the local state
      setState(prev => ({
        ...prev,
        flowers: prev.flowers.map(flower =>
          flower.id === flowerId
            ? { ...flower, ...updates, ...(imageUrl && { imageUrl }) }
            : flower
        ),
      }));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update flower');
    }
  }, [userId]);

  // Delete a flower
  const deleteFlower = useCallback(async (flowerId: string): Promise<void> => {
    if (!userId) throw new Error('User not authenticated');

    try {
      // Find the flower to get the image URL
      const flower = state.flowers.find(f => f.id === flowerId);
      
      await FlowerService.deleteFlower(flowerId);

      // Delete the image from storage if it exists and is not a placeholder
      if (flower?.imageUrl && !flower.imageUrl.includes('placeholder') && !flower.imageUrl.startsWith('/')) {
        try {
          await ImageService.deleteImage(flower.imageUrl);
        } catch (imageError) {
          console.warn('Failed to delete image:', imageError);
        }
      }

      // Update the local state
      setState(prev => ({
        ...prev,
        flowers: prev.flowers.filter(flower => flower.id !== flowerId),
      }));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete flower');
    }
  }, [userId, state.flowers]);

  // Load flowers when userId or searchQuery changes
  useEffect(() => {
    if (userId) {
      loadFlowers(true);
    } else {
      setState({
        flowers: [],
        loading: false,
        error: null,
        hasMore: true,
        lastVisible: null,
      });
    }
  }, [userId, searchQuery]);

  return {
    flowers: state.flowers,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    loadMore,
    refresh,
    addFlower,
    updateFlower,
    deleteFlower,
  };
}; 