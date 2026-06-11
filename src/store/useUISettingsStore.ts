import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UISettings } from '../types';

interface UISettingsState extends UISettings {
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
  setCurrentBabyId: (id: string | null) => void;
  setShareToken: (token: string | null) => void;
}

export const useUISettingsStore = create<UISettingsState>()(
  persist(
    (set) => ({
      darkMode: false,
      currentBabyId: null,
      shareToken: null,
      toggleDarkMode: () =>
        set((state) => {
          const newDarkMode = !state.darkMode;
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { darkMode: newDarkMode };
        }),
      setDarkMode: (dark: boolean) =>
        set(() => {
          if (dark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { darkMode: dark };
        }),
      setCurrentBabyId: (id: string | null) => set({ currentBabyId: id }),
      setShareToken: (token: string | null) => set({ shareToken: token }),
    }),
    {
      name: 'babycare-ui-settings',
    }
  )
);
