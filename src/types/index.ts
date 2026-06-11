export interface Baby {
  id: string;
  name: string;
  birthday: string;
  gender: 'boy' | 'girl' | 'unknown';
  avatar: string;
}

export type FeedingType = 'milk' | 'food' | 'diaper';

export interface FeedingRecord {
  id: string;
  babyId: string;
  date: string;
  type: FeedingType;
  time: string;
  amount?: number;
  unit?: string;
  foodName?: string;
  diaperType?: 'wet' | 'dirty' | 'both';
  note?: string;
  createdAt: string;
}

export interface SleepRecord {
  id: string;
  babyId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  note?: string;
}

export interface TodoItem {
  id: string;
  babyId: string;
  date: string;
  content: string;
  completed: boolean;
  createdAt: string;
}

export interface SupplyItem {
  id: string;
  babyId: string;
  name: string;
  category: 'milk' | 'diaper' | 'clothes' | 'other';
  stock: number;
  warningLevel: number;
  unit: string;
}

export interface GrowthRecord {
  id: string;
  babyId: string;
  date: string;
  height: number;
  weight: number;
  headCircumference?: number;
}

export interface VaccineReminder {
  id: string;
  babyId: string;
  name: string;
  date: string;
  completed: boolean;
  type: 'vaccine' | 'checkup';
  note?: string;
}

export interface KnowledgeCard {
  id: string;
  monthMin: number;
  monthMax: number;
  title: string;
  content: string;
  category: 'feeding' | 'sleep' | 'care' | 'development';
}

export interface Favorite {
  id: string;
  babyId: string;
  cardId: string;
}

export interface UISettings {
  darkMode: boolean;
  currentBabyId: string | null;
  shareToken: string | null;
}
