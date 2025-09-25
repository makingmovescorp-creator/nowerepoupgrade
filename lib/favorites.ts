import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FeaturedKey } from '@/data/pairs';

interface FavoritesState {
  favoritePairs: FeaturedKey[];
  addFavorite: (pairKey: FeaturedKey) => void;
  removeFavorite: (pairKey: FeaturedKey) => void;
  toggleFavorite: (pairKey: FeaturedKey) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favoritePairs: ['plsx-wpls'],
      addFavorite: (pairKey) =>
        set((state) => ({
          favoritePairs: state.favoritePairs.includes(pairKey)
            ? state.favoritePairs
            : [...state.favoritePairs, pairKey],
        })),
      removeFavorite: (pairKey) =>
        set((state) => ({
          favoritePairs: state.favoritePairs.filter((p) => p !== pairKey),
        })),
      toggleFavorite: (pairKey) =>
        set((state) => {
          const newFavorites = state.favoritePairs.includes(pairKey)
            ? state.favoritePairs.filter((p) => p !== pairKey)
            : [...state.favoritePairs, pairKey];
          console.log('toggleFavorite:', pairKey, 'new favorites:', newFavorites);
          return { favoritePairs: newFavorites };
        }),
    }),
    {
      name: 'favorite-pairs',
    }
  )
);
