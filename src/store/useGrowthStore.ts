import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GrowthRecord } from '../types';
import { generateId } from '../utils/date';

interface GrowthState {
  records: GrowthRecord[];
  addRecord: (record: Omit<GrowthRecord, 'id'>) => void;
  updateRecord: (id: string, record: Partial<GrowthRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecordsByBaby: (babyId: string) => GrowthRecord[];
  getLatestRecord: (babyId: string) => GrowthRecord | undefined;
}

export const useGrowthStore = create<GrowthState>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (record) =>
        set((state) => ({
          records: [...state.records, { ...record, id: generateId() }],
        })),
      updateRecord: (id, record) =>
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...record } : r
          ),
        })),
      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        })),
      getRecordsByBaby: (babyId) =>
        get()
          .records.filter((r) => r.babyId === babyId)
          .sort((a, b) => a.date.localeCompare(b.date)),
      getLatestRecord: (babyId) => {
        const records = get().getRecordsByBaby(babyId);
        return records.length > 0 ? records[records.length - 1] : undefined;
      },
    }),
    {
      name: 'babycare-growth',
    }
  )
);
