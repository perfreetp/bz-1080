import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Baby } from '../types';
import { generateId } from '../utils/date';

interface BabyState {
  babies: Baby[];
  addBaby: (baby: Omit<Baby, 'id'>) => void;
  updateBaby: (id: string, baby: Partial<Omit<Baby, 'id'>>) => void;
  deleteBaby: (id: string) => void;
  getBaby: (id: string) => Baby | undefined;
}

export const useBabyStore = create<BabyState>()(
  persist(
    (set, get) => ({
      babies: [],
      addBaby: (baby) =>
        set((state) => ({
          babies: [...state.babies, { ...baby, id: generateId() }],
        })),
      updateBaby: (id, baby) =>
        set((state) => ({
          babies: state.babies.map((b) =>
            b.id === id ? { ...b, ...baby } : b
          ),
        })),
      deleteBaby: (id) =>
        set((state) => ({
          babies: state.babies.filter((b) => b.id !== id),
        })),
      getBaby: (id) => get().babies.find((b) => b.id === id),
    }),
    {
      name: 'babycare-babies',
    }
  )
);
