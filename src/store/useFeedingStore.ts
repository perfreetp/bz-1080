import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FeedingRecord, FeedingType } from '../types';
import { generateId, getToday } from '../utils/date';

interface FeedingState {
  records: FeedingRecord[];
  addRecord: (record: Omit<FeedingRecord, 'id' | 'createdAt'>) => void;
  updateRecord: (id: string, record: Partial<FeedingRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecordsByDate: (babyId: string, date: string) => FeedingRecord[];
  getRecordsByType: (babyId: string, type: FeedingType) => FeedingRecord[];
  getTodayRecords: (babyId: string) => FeedingRecord[];
}

export const useFeedingStore = create<FeedingState>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (record) =>
        set((state) => ({
          records: [
            ...state.records,
            {
              ...record,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
          ],
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
      getRecordsByDate: (babyId, date) =>
        get()
          .records.filter((r) => r.babyId === babyId && r.date === date)
          .sort((a, b) => b.time.localeCompare(a.time)),
      getRecordsByType: (babyId, type) =>
        get()
          .records.filter((r) => r.babyId === babyId && r.type === type)
          .sort((a, b) => {
            if (a.date !== b.date) return b.date.localeCompare(a.date);
            return b.time.localeCompare(a.time);
          }),
      getTodayRecords: (babyId) => get().getRecordsByDate(babyId, getToday()),
    }),
    {
      name: 'babycare-feeding',
    }
  )
);
