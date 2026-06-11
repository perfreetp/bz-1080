import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Baby, FeedingRecord, SleepRecord, TodoItem, SupplyItem, GrowthRecord } from '../types';
import { generateId, getToday } from '../utils/date';

export interface ShareSnapshot {
  baby: Baby;
  exportedAt: string;
  feeding: FeedingRecord[];
  sleep: SleepRecord[];
  todos: TodoItem[];
  supplies: SupplyItem[];
  growth: GrowthRecord[];
}

export interface ShareRecord {
  token: string;
  babyId: string;
  babyName: string;
  createdAt: string;
  revoked: boolean;
}

interface ShareState {
  shares: ShareRecord[];
  createShare: (
    babyId: string,
    snapshot: ShareSnapshot
  ) => { token: string; encodedData: string };
  revokeShare: (token: string) => void;
  isTokenRevoked: (token: string) => boolean;
  getShareByToken: (token: string) => ShareRecord | undefined;
}

export const encodeSnapshot = (snapshot: ShareSnapshot): string => {
  try {
    const json = JSON.stringify(snapshot);
    return btoa(unescape(encodeURIComponent(json)));
  } catch (e) {
    console.error('编码快照失败', e);
    return '';
  }
};

export const decodeSnapshot = (encoded: string): ShareSnapshot | null => {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch (e) {
    console.error('解码快照失败', e);
    return null;
  }
};

export const useShareStore = create<ShareState>()(
  persist(
    (set, get) => ({
      shares: [],
      createShare: (babyId, snapshot) => {
        const token = generateShareToken();
        const encodedData = encodeSnapshot(snapshot);
        const baby = snapshot.baby;
        set((state) => ({
          shares: [
            ...state.shares,
            {
              token,
              babyId,
              babyName: baby.name,
              createdAt: getToday(),
              revoked: false,
            },
          ],
        }));
        return { token, encodedData };
      },
      revokeShare: (token) =>
        set((state) => ({
          shares: state.shares.map((s) =>
            s.token === token ? { ...s, revoked: true } : s
          ),
        })),
      isTokenRevoked: (token) => {
        const record = get().shares.find((s) => s.token === token);
        return !record || record.revoked;
      },
      getShareByToken: (token) =>
        get().shares.find((s) => s.token === token),
    }),
    {
      name: 'babycare-shares',
    }
  )
);

export const generateShareToken = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
