import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Favorite } from '../types';
import { generateId } from '../utils/date';

interface FavoriteState {
  favorites: Favorite[];
  addFavorite: (babyId: string, cardId: string) => void;
  removeFavorite: (babyId: string, cardId: string) => void;
  isFavorite: (babyId: string, cardId: string) => boolean;
  getFavoritesByBaby: (babyId: string) => Favorite[];
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (babyId, cardId) => {
        if (get().isFavorite(babyId, cardId)) return;
        set((state) => ({
          favorites: [
            ...state.favorites,
            { id: generateId(), babyId, cardId },
          ],
        }));
      },
      removeFavorite: (babyId, cardId) =>
        set((state) => ({
          favorites: state.favorites.filter(
            (f) => !(f.babyId === babyId && f.cardId === cardId)
          ),
        })),
      isFavorite: (babyId, cardId) =>
        get().favorites.some(
          (f) => f.babyId === babyId && f.cardId === cardId
        ),
      getFavoritesByBaby: (babyId) =>
        get().favorites.filter((f) => f.babyId === babyId),
    }),
    {
      name: 'babycare-favorites',
    }
  )
);
