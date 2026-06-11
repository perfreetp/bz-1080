import { useState } from 'react';
import { Plus, Trash2, Moon, Sun, Baby, Clock } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useSleepStore } from '../store/useSleepStore';
import { useUISettingsStore } from '../store/useUISettingsStore';
import { useBabyStore } from '../store/useBabyStore';
import { formatDuration, getToday, getDaysAgo } from '../utils/date';
import { cn } from '../lib/utils';

export const Sleep = () => {
  const { currentBabyId } = useUISettingsStore();
  const { getBaby } = useBabyStore();
  const { records, addRecord, deleteRecord, getRecordsByDate, getTodayTotalDuration } = useSleepStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState(getToday());

  const currentBaby = currentBabyId ? getBaby(currentBabyId) : undefined;
  const dateRecords = currentBabyId ? getRecordsByDate(currentBabyId, selectedDate) : [];
  const todayTotal = currentBabyId ? getTodayTotalDuration(currentBabyId) : 0;

  const handleAddRecord = () => {
    if (!currentBabyId || !startTime || !endTime) return;
    addRecord({
      babyId: currentBabyId,
      date: selectedDate,
      startTime,
      endTime,
      note: note || undefined,
    });
    setStartTime('');
    setEndTime('');
    setNote('');
    setShowAddModal(false);
  };

  const isNightSleep = (startTime: string) => {
    const hour = parseInt(startTime.split(':')[0]);
    return hour >= 20 || hour < 6;
  };

  const weekDates = [];
  for (let i = 6; i >= 0; i--) {
    weekDates.push(getDaysAgo(i));
  }

  if (!currentBaby) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white">
          睡眠记录
        </h2>
        <Card className="text-center py-8">
          <Baby className="w-12 h-12 mx-auto text-primary-300 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">请先选择宝宝档案</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white">
          睡眠记录
        </h2>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          添加
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-sky-100 to-primary-100 dark:from-sky-900/30 dark:to-primary-900/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">今日总睡眠</p>
            <p className="text-3xl font-extrabold text-primary-600 dark:text-primary-300 mt-1">
              {formatDuration(todayTotal)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              共 {dateRecords.length} 段
            </p>
          </div>
          <div className="text-5xl">😴</div>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-gray-800 dark:text-white mb-3">本周睡眠</h3>
        <div className="flex gap-2">
          {weekDates.map((date) => {
            const dayRecords = currentBabyId ? getRecordsByDate(currentBabyId, date) : [];
            const total = dayRecords.reduce((sum, r) => sum + r.duration, 0);
            const hours = total / 60;
            const maxHours = 16;
            const heightPercent = Math.min((hours / maxHours) * 100, 100);
            const isToday = date === getToday();

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  'flex-1 flex flex-col items-center gap-2 py-2 rounded-xl transition-all',
                  selectedDate === date
                    ? 'bg-primary-50 dark:bg-primary-900/30'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                )}
              >
                <div className="flex-1 w-full flex items-end justify-center h-20">
                  <div
                    className={cn(
                      'w-4 rounded-t-full transition-all',
                      isToday
                        ? 'bg-gradient-to-t from-primary-400 to-primary-300'
                        : 'bg-gradient-to-t from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-500'
                    )}
                    style={{ height: `${Math.max(heightPercent, 5)}%` }}
                  />
                </div>
                <span className={cn(
                  'text-xs',
                  isToday ? 'text-primary-500 font-bold' : 'text-gray-400'
                )}>
                  {new Date(date).getDate()}日
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 dark:text-white">
            {selectedDate === getToday() ? '今日睡眠' : selectedDate}
          </h3>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {dateRecords.length} 段睡眠
          </span>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide">
          {dateRecords.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">
              暂无睡眠记录
            </p>
          ) : (
            dateRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  isNightSleep(record.startTime)
                    ? 'bg-indigo-100 dark:bg-indigo-900/50'
                    : 'bg-yellow-100 dark:bg-yellow-900/50'
                )}>
                  {isNightSleep(record.startTime) ? (
                    <Moon className="w-5 h-5 text-indigo-500" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {record.startTime} - {record.endTime}
                  </p>
                  {record.note && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {record.note}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary-500">
                    {formatDuration(record.duration)}
                  </p>
                </div>
                <button
                  onClick={() => deleteRecord(record.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </Card>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="添加睡眠记录">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                入睡时间
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                起床时间
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              日期
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              备注
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="睡得好不好？"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setShowAddModal(false)}>
              取消
            </Button>
            <Button fullWidth onClick={handleAddRecord}>
              保存
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
