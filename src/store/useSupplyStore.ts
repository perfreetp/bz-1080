import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SupplyItem } from '../types';
import { generateId } from '../utils/date';

interface SupplyState {
  items: SupplyItem[];
  addItem: (item: Omit<SupplyItem, 'id'>) => void;
  updateItem: (id: string, item: Partial<SupplyItem>) => void;
  deleteItem: (id: string) => void;
  getItemsByCategory: (
    babyId: string,
    category: SupplyItem['category']
  ) => SupplyItem[];
  getLowStockItems: (babyId: string) => SupplyItem[];
  getItemsByBaby: (babyId: string) => SupplyItem[];
  generateShoppingList: (babyId: string) => SupplyItem[];
}

export const useSupplyStore = create<SupplyState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, { ...item, id: generateId() }],
        })),
      updateItem: (id, item) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, ...item } : i
          ),
        })),
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      getItemsByCategory: (babyId, category) =>
        get().items.filter((i) => i.babyId === babyId && i.category === category),
      getLowStockItems: (babyId) =>
        get().items.filter(
          (i) => i.babyId === babyId && i.stock <= i.warningLevel
        ),
      getItemsByBaby: (babyId) =>
        get().items.filter((i) => i.babyId === babyId),
      generateShoppingList: (babyId) => get().getLowStockItems(babyId),
    }),
    {
      name: 'babycare-supplies',
    }
  )
);
