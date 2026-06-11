import {
  FeedingRecord,
  SleepRecord,
  GrowthRecord,
  TodoItem,
  Baby,
} from '../types';
import { formatDate, formatDuration, getToday } from './date';

export const generateDiaryText = (
  baby: Baby,
  feedingRecords: FeedingRecord[],
  sleepRecords: SleepRecord[],
  growthRecords: GrowthRecord[],
  todos: TodoItem[],
  date: string = getToday()
): string => {
  const lines: string[] = [];

  lines.push(`📅 ${date} 育儿日记`);
  lines.push(`👶 宝宝：${baby.name}`);
  lines.push('');

  lines.push('📝 今日待办');
  if (todos.length === 0) {
    lines.push('  暂无待办事项');
  } else {
    todos.forEach((todo, index) => {
      const status = todo.completed ? '✅' : '⬜';
      lines.push(`  ${status} ${todo.content}`);
    });
  }
  lines.push('');

  const milkRecords = feedingRecords.filter((r) => r.type === 'milk');
  const foodRecords = feedingRecords.filter((r) => r.type === 'food');
  const diaperRecords = feedingRecords.filter((r) => r.type === 'diaper');

  lines.push('🍼 喂奶记录');
  if (milkRecords.length === 0) {
    lines.push('  暂无记录');
  } else {
    milkRecords.forEach((r) => {
      const amount = r.amount ? ` ${r.amount}${r.unit || 'ml'}` : '';
      const note = r.note ? ` (${r.note})` : '';
      lines.push(`  ${r.time}${amount}${note}`);
    });
  }
  lines.push('');

  lines.push('🥣 辅食记录');
  if (foodRecords.length === 0) {
    lines.push('  暂无记录');
  } else {
    foodRecords.forEach((r) => {
      const foodName = r.foodName || '辅食';
      const amount = r.amount ? ` ${r.amount}${r.unit || 'g'}` : '';
      const note = r.note ? ` (${r.note})` : '';
      lines.push(`  ${r.time} ${foodName}${amount}${note}`);
    });
  }
  lines.push('');

  lines.push('🧷 换尿布记录');
  if (diaperRecords.length === 0) {
    lines.push('  暂无记录');
  } else {
    diaperRecords.forEach((r) => {
      const typeText = r.diaperType === 'wet' ? '嘘嘘' : r.diaperType === 'dirty' ? '便便' : '嘘嘘+便便';
      const note = r.note ? ` (${r.note})` : '';
      lines.push(`  ${r.time} ${typeText}${note}`);
    });
  }
  lines.push('');

  lines.push('😴 睡眠记录');
  if (sleepRecords.length === 0) {
    lines.push('  暂无记录');
  } else {
    const totalSleep = sleepRecords.reduce((sum, r) => sum + r.duration, 0);
    lines.push(`  共 ${sleepRecords.length} 段，总时长 ${formatDuration(totalSleep)}`);
    sleepRecords.forEach((r) => {
      lines.push(`  ${r.startTime} - ${r.endTime} (${formatDuration(r.duration)})`);
    });
  }
  lines.push('');

  if (growthRecords.length > 0) {
    const latest = growthRecords[growthRecords.length - 1];
    lines.push('📏 成长数据');
    lines.push(`  身高：${latest.height} cm`);
    lines.push(`  体重：${latest.weight} kg`);
    if (latest.headCircumference) {
      lines.push(`  头围：${latest.headCircumference} cm`);
    }
    lines.push(`  记录日期：${latest.date}`);
  }

  lines.push('');
  lines.push('— 宝妈日记 App 生成 —');

  return lines.join('\n');
};

export const downloadText = (text: string, filename: string): void => {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateShareToken = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
};
