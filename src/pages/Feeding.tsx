import { useState } from 'react';
import { Plus, Trash2, Baby } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Tabs } from '../components/Tabs';
import { useFeedingStore } from '../store/useFeedingStore';
import { useUISettingsStore } from '../store/useUISettingsStore';
import { useBabyStore } from '../store/useBabyStore';
import { FeedingType } from '../types';
import { getToday, formatTime } from '../utils/date';
import { cn } from '../lib/utils';

const tabItems = [
  { id: 'milk', label: '喂奶', icon: '🍼' },
  { id: 'food', label: '辅食', icon: '🥣' },
  { id: 'diaper', label: '尿布', icon: '🧷' },
];

export const Feeding = () => {
  const { currentBabyId } = useUISettingsStore();
  const { getBaby } = useBabyStore();
  const { addRecord, deleteRecord, getRecordsByType, getTodayRecords } = useFeedingStore();

  const [activeTab, setActiveTab] = useState<FeedingType>('milk');
  const [showAddModal, setShowAddModal] = useState(false);
  const [time, setTime] = useState(formatTime(new Date()));
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('ml');
  const [foodName, setFoodName] = useState('');
  const [diaperType, setDiaperType] = useState<'wet' | 'dirty' | 'both'>('wet');
  const [note, setNote] = useState('');

  const currentBaby = currentBabyId ? getBaby(currentBabyId) : undefined;
  const typeRecords = currentBabyId ? getRecordsByType(currentBabyId, activeTab) : [];
  const todayRecords = currentBabyId ? getTodayRecords(currentBabyId) : [];

  const todayMilk = todayRecords.filter(r => r.type === 'milk');
  const todayFood = todayRecords.filter(r => r.type === 'food');
  const todayDiaper = todayRecords.filter(r => r.type === 'diaper');

  const handleAddRecord = () => {
    if (!currentBabyId) return;
    addRecord({
      babyId: currentBabyId,
      date: getToday(),
      type: activeTab,
      time,
      amount: amount ? Number(amount) : undefined,
      unit: activeTab === 'milk' ? unit : activeTab === 'food' ? 'g' : undefined,
      foodName: activeTab === 'food' ? foodName : undefined,
      diaperType: activeTab === 'diaper' ? diaperType : undefined,
      note: note || undefined,
    });
    resetForm();
    setShowAddModal(false);
  };

  const resetForm = () => {
    setTime(formatTime(new Date()));
    setAmount('');
    setUnit('ml');
    setFoodName('');
    setDiaperType('wet');
    setNote('');
  };

  const getTypeIcon = (type: FeedingType) => {
    switch (type) {
      case 'milk': return '🍼';
      case 'food': return '🥣';
      case 'diaper': return '🧷';
    }
  };

  if (!currentBaby) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white">
          喂养记录
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
          喂养记录
        </h2>
        <Button onClick={() => { resetForm(); setShowAddModal(true); }}>
          <Plus className="w-4 h-4" />
          添加
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-extrabold text-primary-500">{todayMilk.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">🍼 今日喂奶</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-extrabold text-mint-500">{todayFood.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">🥣 今日辅食</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-extrabold text-sky-400">{todayDiaper.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">🧷 今日尿布</p>
        </Card>
      </div>

      <Card>
        <Tabs
          tabs={tabItems.map(t => ({ id: t.id, label: t.label, icon: <span>{t.icon}</span> }))}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as FeedingType)}
          className="mb-4"
        />

        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
          {typeRecords.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">
              暂无记录，点击右上角添加
            </p>
          ) : (
            typeRecords.map((record, index) => {
              const showDate = index === 0 || record.date !== typeRecords[index - 1]?.date;
              return (
                <div key={record.id}>
                  {showDate && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 py-2 font-medium">
                      {record.date}
                    </p>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-xl">{getTypeIcon(record.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-800 dark:text-white text-sm">
                          {record.time}
                        </span>
                        {record.amount && (
                          <span className="text-xs bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 px-2 py-0.5 rounded-full">
                            {record.amount}{record.unit}
                          </span>
                        )}
                        {record.foodName && (
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            {record.foodName}
                          </span>
                        )}
                      </div>
                      {record.note && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {record.note}
                        </p>
                      )}
                      {record.diaperType && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {record.diaperType === 'wet' ? '嘘嘘' : record.diaperType === 'dirty' ? '便便' : '嘘嘘+便便'}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={`添加${activeTab === 'milk' ? '喂奶' : activeTab === 'food' ? '辅食' : '换尿布'}记录`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              时间
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
            />
          </div>

          {activeTab === 'milk' && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  奶量
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="120"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
                />
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  单位
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
                >
                  <option value="ml">ml</option>
                  <option value="oz">oz</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'food' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  辅食名称
                </label>
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="例如：高铁米粉"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  食用量 (g)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
                />
              </div>
            </>
          )}

          {activeTab === 'diaper' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                尿布类型
              </label>
              <div className="flex gap-2">
                {(['wet', 'dirty', 'both'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setDiaperType(type)}
                    className={cn(
                      'flex-1 py-3 rounded-xl text-sm font-medium transition-all',
                      diaperType === type
                        ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    )}
                  >
                    {type === 'wet' ? '💧 嘘嘘' : type === 'dirty' ? '💩 便便' : '✨ 都有'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              备注
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="有什么想记录的..."
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
