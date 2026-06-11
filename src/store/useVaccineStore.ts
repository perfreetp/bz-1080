import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VaccineReminder } from '../types';
import { generateId, getToday } from '../utils/date';

interface VaccineState {
  reminders: VaccineReminder[];
  addReminder: (reminder: Omit<VaccineReminder, 'id'>) => void;
  updateReminder: (id: string, reminder: Partial<VaccineReminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  getRemindersByBaby: (babyId: string) => VaccineReminder[];
  getUpcomingReminders: (babyId: string, days?: number) => VaccineReminder[];
}

export const useVaccineStore = create<VaccineState>()(
  persist(
    (set, get) => ({
      reminders: [],
      addReminder: (reminder) =>
        set((state) => ({
          reminders: [...state.reminders, { ...reminder, id: generateId() }],
        })),
      updateReminder: (id, reminder) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, ...reminder } : r
          ),
        })),
      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        })),
      toggleReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, completed: !r.completed } : r
          ),
        })),
      getRemindersByBaby: (babyId) =>
        get()
          .reminders.filter((r) => r.babyId === babyId)
          .sort((a, b) => a.date.localeCompare(b.date)),
      getUpcomingReminders: (babyId, days = 7) => {
        const today = getToday();
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + days);
        const futureStr = futureDate.toISOString().split('T')[0];
        return get()
          .reminders.filter(
            (r) =>
              r.babyId === babyId &&
              !r.completed &&
              r.date >= today &&
              r.date <= futureStr
          )
          .sort((a, b) => a.date.localeCompare(b.date));
      },
    }),
    {
      name: 'babycare-vaccine',
    }
  )
);
