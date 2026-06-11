import { useState, useRef } from 'react';
import { Plus, Trash2, Download, TrendingUp, Baby, Calendar } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Tabs } from '../components/Tabs';
import { useGrowthStore } from '../store/useGrowthStore';
import { useUISettingsStore } from '../store/useUISettingsStore';
import { useBabyStore } from '../store/useBabyStore';
import { useFeedingStore } from '../store/useFeedingStore';
import { useSleepStore } from '../store/useSleepStore';
import { useTodoStore } from '../store/useTodoStore';
import { formatAge, getToday, getDaysAgo, formatDuration } from '../utils/date';
import { generateDiaryText, downloadText } from '../utils/export';
import { cn } from '../lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartTabs = [
  { id: 'weight', label: '体重', icon: '⚖️' },
  { id: 'height', label: '身高', icon: '📏' },
  { id: 'head', label: '头围', icon: '🧠' },
];

export const Summary = () => {
  const { currentBabyId } = useUISettingsStore();
  const { getBaby } = useBabyStore();
  const { records, addRecord, deleteRecord, getRecordsByBaby, getLatestRecord } = useGrowthStore();
  const { getTodayRecords } = useFeedingStore();
  const { getTodayTotalDuration } = useSleepStore();
  const { getTodayTodos } = useTodoStore();

  const [activeChart, setActiveChart] = useState('weight');
  const [showAddModal, setShowAddModal] = useState(false);
  const [date, setDate] = useState(getToday());
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');

  const currentBaby = currentBabyId ? getBaby(currentBabyId) : undefined;
  const growthRecords = currentBabyId ? getRecordsByBaby(currentBabyId) : [];
  const latestRecord = currentBabyId ? getLatestRecord(currentBabyId) : undefined;
  const todayFeeding = currentBabyId ? getTodayRecords(currentBabyId) : [];
  const todaySleep = currentBabyId ? getTodayTotalDuration(currentBabyId) : 0;
  const todayTodos = currentBabyId ? getTodayTodos(currentBabyId) : [];

  const handleAddRecord = () => {
    if (!currentBabyId) return;
    addRecord({
      babyId: currentBabyId,
      date,
      height: height ? Number(height) : latestRecord?.height || 0,
      weight: weight ? Number(weight) : latestRecord?.weight || 0,
      headCircumference: headCircumference ? Number(headCircumference) : undefined,
    });
    setHeight('');
    setWeight('');
    setHeadCircumference('');
    setShowAddModal(false);
  };

  const handleExportDiary = () => {
    if (!currentBaby || !currentBabyId) return;
    const text = generateDiaryText(
      currentBaby,
      todayFeeding,
      currentBabyId ? useSleepStore.getState().getTodayRecords(currentBabyId) : [],
      growthRecords,
      todayTodos
    );
    downloadText(text, `${currentBaby.name}_育儿日记_${getToday()}.txt`);
  };

  const chartData = {
    labels: growthRecords.slice(-10).map((r) => r.date.slice(5)),
    datasets: [
      {
        label: activeChart === 'weight' ? '体重 (kg)' : activeChart === 'height' ? '身高 (cm)' : '头围 (cm)',
        data: growthRecords.slice(-10).map((r) =>
          activeChart === 'weight' ? r.weight : activeChart === 'height' ? r.height : r.headCircumference || 0
        ),
        borderColor: '#FF7A93',
        backgroundColor: 'rgba(255, 122, 147, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#FF5B79',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 10 },
          color: '#9ca3af',
        },
      },
      y: {
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
        ticks: {
          font: { size: 10 },
          color: '#9ca3af',
        },
      },
    },
  };

  if (!currentBaby) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white">
          数据汇总
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
          数据汇总
        </h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExportDiary}>
            <Download className="w-4 h-4" />
            导出日记
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-extrabold text-primary-500">
            {latestRecord?.weight || '--'}
            <span className="text-sm font-normal">kg</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">体重</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-extrabold text-mint-500">
            {latestRecord?.height || '--'}
            <span className="text-sm font-normal">cm</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">身高</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-extrabold text-sky-400">
            {formatAge(currentBaby.birthday)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">月龄</p>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            成长趋势
          </h3>
          <Button size="sm" variant="ghost" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            记录
          </Button>
        </div>

        <Tabs
          tabs={chartTabs.map(t => ({ id: t.id, label: t.label, icon: <span>{t.icon}</span> }))}
          activeTab={activeChart}
          onChange={setActiveChart}
          className="mb-4"
        />

        {growthRecords.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">
            暂无成长数据，点击上方记录添加
          </p>
        ) : (
          <div className="h-48">
            <Line data={chartData} options={chartOptions as any} />
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-400" />
            今日概览
          </h3>
          <span className="text-xs text-gray-400 dark:text-gray-500">{getToday()}</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-300">🍼 喂奶次数</span>
            <span className="font-bold text-primary-500">
              {todayFeeding.filter(r => r.type === 'milk').length} 次
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-300">🧷 换尿布</span>
            <span className="font-bold text-mint-500">
              {todayFeeding.filter(r => r.type === 'diaper').length} 次
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-300">😴 总睡眠</span>
            <span className="font-bold text-sky-400">{formatDuration(todaySleep)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">✅ 待办完成</span>
            <span className="font-bold text-orange-400">
              {todayTodos.filter(t => t.completed).length}/{todayTodos.length}
            </span>
          </div>
        </div>
      </Card>

      {growthRecords.length > 0 && (
        <Card>
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">成长记录</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
            {growthRecords.slice().reverse().map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <span className="text-sm text-gray-600 dark:text-gray-300">{record.date}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    体重 <span className="font-bold text-primary-500">{record.weight}kg</span>
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    身高 <span className="font-bold text-mint-500">{record.height}cm</span>
                  </span>
                </div>
                <button
                  onClick={() => deleteRecord(record.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="记录成长数据">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              日期
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              体重 (kg)
            </label>
            <input
              type="number"
              step="0.01"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={latestRecord?.weight?.toString() || '7.5'}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              身高 (cm)
            </label>
            <input
              type="number"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={latestRecord?.height?.toString() || '65'}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              头围 (cm) - 选填
            </label>
            <input
              type="number"
              step="0.1"
              value={headCircumference}
              onChange={(e) => setHeadCircumference(e.target.value)}
              placeholder="42"
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
