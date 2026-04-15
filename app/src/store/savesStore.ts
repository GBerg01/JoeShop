import { create } from 'zustand';
import { savesApi } from '../api/saves.api';

interface SavesState {
  savedIds: Set<string>;
  toggle: (productId: string) => Promise<void>;
  loadSavedIds: () => Promise<void>;
}

export const useSavesStore = create<SavesState>((set, get) => ({
  savedIds: new Set(),

  toggle: async (productId: string) => {
    const { savedIds } = get();
    const isSaved = savedIds.has(productId);

    // Optimistic update
    const next = new Set(savedIds);
    if (isSaved) {
      next.delete(productId);
    } else {
      next.add(productId);
    }
    set({ savedIds: next });

    try {
      if (isSaved) {
        await savesApi.unsave(productId);
      } else {
        await savesApi.save(productId);
      }
    } catch {
      // Revert on failure
      set({ savedIds });
    }
  },

  loadSavedIds: async () => {
    try {
      const { items } = await savesApi.getSaves(0, 200);
      set({ savedIds: new Set(items.map(i => i.id)) });
    } catch {
      // Non-fatal
    }
  },
}));
