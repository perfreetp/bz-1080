import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SleepRecord } from '../types';
import { generateId, getToday, calculateDuration } from '../utils/date';

interface SleepState {
  records: SleepRecord[];
  addRecord: (record: Omit<SleepRecord, 'id' | 'duration'>) => void;
  updateRecord: (id: string, record: Partial<SleepRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecordsByDate: (babyId: string, date: string) => SleepRecord[];
  getTodayRecords: (babyId: string) => SleepRecord[];
  getTodayTotalDuration: (babyId: string) => number;
}

export const useSleepStore = create<SleepState>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (record) => {
        const duration = calculateDuration(record.startTime, record.endTime);
        set((state) => ({
          records: [
            ...state.records,
            {
              ...record,
              id: generateId(),
              duration,
            },
          ],
        }));
      },
      updateRecord: (id, record) =>
        set((state) => ({
          records: state.records.map((r) => {
            if (r.id === id) {
              const updated = { ...r, ...record };
              if (record.startTime || record.endTime) {
                updated.duration = calculateDuration(
                  updated.startTime,
                  updated.endTime
                );
              }
              return updated;
            }
            return r;
          }),
        })),
      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        })),
      getRecordsByDate: (babyId, date) =>
        get()
          .records.filter((r) => r.babyId === babyId && r.date === date)
          .sort((a, b) => a.startTime.localeCompare(b.startTime)),
      getTodayRecords: (babyId) => get().getRecordsByDate(babyId, getToday()),
      getTodayTotalDuration: (babyId) => {
        const records = get().getTodayRecords(babyId);
        return records.reduce((sum, r) => sum + r.duration, 0);
      },
    }),
    {
      name: 'babycare-sleep',
    }
  )
);
