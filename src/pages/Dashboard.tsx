import { useState } from 'react';
import { Plus, Check, Trash2, ChevronLeft, ChevronRight, Baby, Milk, UtensilsCrossed, Baby as BabyIcon, Moon, Syringe, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useTodoStore } from '../store/useTodoStore';
import { useUISettingsStore } from '../store/useUISettingsStore';
import { useBabyStore } from '../store/useBabyStore';
import { useFeedingStore } from '../store/useFeedingStore';
import { useSleepStore } from '../store/useSleepStore';
import { useVaccineStore } from '../store/useVaccineStore';
import { formatDate, getToday, getChineseWeekday, formatDuration, formatAge, formatTime } from '../utils/date';
import { cn } from '../lib/utils';
import { FeedingType } from '../types';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { currentBabyId } = useUISettingsStore();
  const { getBaby } = useBabyStore();
  const { addTodo, toggleTodo, deleteTodo, getTodosByDate } = useTodoStore();
  const { addRecord: addFeedingRecord, getTodayRecords: getTodayFeedingRecords } = useFeedingStore();
  const { addRecord: addSleepRecord, getTodayTotalDuration, getTodayRecords: getTodaySleepRecords } = useSleepStore();
  const { getUpcomingReminders } = useVaccineStore();

  const [selectedDate, setSelectedDate] = useState(getToday());
  const [newTodoText, setNewTodoText] = useState('');
  const [showAddTodo, setShowAddTodo] = useState(false);

  const [showQuickModal, setShowQuickModal] = useState<FeedingType | 'sleep' | null>(null);
  const [quickTime, setQuickTime] = useState(formatTime(new Date()));
  const [quickAmount, setQuickAmount] = useState('');
  const [quickUnit, setQuickUnit] = useState('ml');
  const [quickFoodName, setQuickFoodName] = useState('');
  const [quickDiaperType, setQuickDiaperType] = useState<'wet' | 'dirty' | 'both'>('wet');
  const [quickStartTime, setQuickStartTime] = useState('');
  const [quickEndTime, setQuickEndTime] = useState('');
  const [quickNote, setQuickNote] = useState('');

  const currentBaby = currentBabyId ? getBaby(currentBabyId) : undefined;
  const dateTodos = currentBabyId ? getTodosByDate(currentBabyId, selectedDate) : [];
  const todayFeeding = currentBabyId ? getTodayFeedingRecords(currentBabyId) : [];
  const todaySleepRecordsList = currentBabyId ? getTodaySleepRecords(currentBabyId) : [];
  const todaySleepDuration = currentBabyId ? getTodayTotalDuration(currentBabyId) : 0;
  const upcomingReminders = currentBabyId ? getUpcomingReminders(currentBabyId) : [];

  const completedCount = dateTodos.filter((t) => t.completed).length;
  const milkCount = todayFeeding.filter((r) => r.type === 'milk').length;
  const foodCount = todayFeeding.filter((r) => r.type === 'food').length;
  const diaperCount = todayFeeding.filter((r) => r.type === 'diaper').length;

  const handleAddTodo = () => {
    if (!newTodoText.trim() || !currentBabyId) return;
    addTodo({
      babyId: currentBabyId,
      date: selectedDate,
      content: newTodoText.trim(),
    });
    setNewTodoText('');
    setShowAddTodo(false);
  };

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(formatDate(date));
  };

  const openQuickModal = (type: FeedingType | 'sleep') => {
    if (!currentBabyId) return;
    setQuickTime(formatTime(new Date()));
    setQuickAmount('');
    setQuickFoodName('');
    setQuickStartTime('');
    setQuickEndTime('');
    setQuickNote('');
    setShowQuickModal(type);
  };

  const handleQuickSave = () => {
    if (!currentBabyId || !showQuickModal) return;

    if (showQuickModal === 'sleep') {
      if (!quickStartTime || !quickEndTime) return;
      addSleepRecord({
        babyId: currentBabyId,
        date: getToday(),
        startTime: quickStartTime,
        endTime: quickEndTime,
        note: quickNote || undefined,
      });
    } else {
      addFeedingRecord({
        babyId: currentBabyId,
        date: getToday(),
        type: showQuickModal,
        time: quickTime,
        amount: quickAmount ? Number(quickAmount) : undefined,
        unit: showQuickModal === 'milk' ? quickUnit : showQuickModal === 'food' ? 'g' : undefined,
        foodName: showQuickModal === 'food' ? quickFoodName : undefined,
        diaperType: showQuickModal === 'diaper' ? quickDiaperType : undefined,
        note: quickNote || undefined,
      });
    }

    setShowQuickModal(null);
  };

  const getQuickModalTitle = () => {
    switch (showQuickModal) {
      case 'milk': return '快速记录喂奶';
      case 'food': return '快速记录辅食';
      case 'diaper': return '快速记录换尿布';
      case 'sleep': return '快速记录睡眠';
      default: return '';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white">
            今日计划
          </h2>
          {currentBaby && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {currentBaby.name} · {formatAge(currentBaby.birthday)}
            </p>
          )}
        </div>
      </div>

      {!currentBaby && (
        <Card className="text-center py-8">
          <Baby className="w-12 h-12 mx-auto text-primary-300 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">请先选择或创建宝宝档案</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            点击顶部宝宝头像进行选择
          </p>
        </Card>
      )}

      {currentBaby && (
        <>
          {upcomingReminders.length > 0 && (
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/30">
              <div className="flex items-start gap-3">
                <CalendarClock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-yellow-700 dark:text-yellow-400 text-sm mb-2">
                    临近提醒 ({upcomingReminders.length}项)
                  </p>
                  <div className="space-y-1.5">
                    {upcomingReminders.slice(0, 3).map((r) => (
                      <div key={r.id} className="flex items-center gap-2 text-xs">
                        <span className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center text-[10px]',
                          r.type === 'vaccine' ? 'bg-red-100 dark:bg-red-900/50 text-red-500' : 'bg-sky-100 dark:bg-sky-900/50 text-sky-500'
                        )}>
                          {r.type === 'vaccine' ? '💉' : '🏥'}
                        </span>
                        <span className="text-yellow-800 dark:text-yellow-300 font-medium">
                          {r.name}
                        </span>
                        <span className="text-yellow-600 dark:text-yellow-400/80">
                          · {r.date}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('/settings')}
                    className="text-xs text-yellow-600 dark:text-yellow-400/80 underline mt-2 hover:text-yellow-700"
                  >
                    管理全部提醒 →
                  </button>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => changeDate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {selectedDate === getToday() ? '今天' : selectedDate}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getChineseWeekday(selectedDate)}
                </p>
              </div>
              <button
                onClick={() => changeDate(1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 dark:text-white">待办事项</h3>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {completedCount}/{dateTodos.length}
              </span>
            </div>

            <div className="space-y-2 mb-4 max-h-56 overflow-y-auto scrollbar-hide">
              {dateTodos.length === 0 ? (
                <p className="text-center text-gray-400 dark:text-gray-500 py-6 text-sm">
                  今日暂无待办，添加一个吧～
                </p>
              ) : (
                dateTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl transition-all',
                      todo.completed
                        ? 'bg-gray-50 dark:bg-gray-700/50'
                        : 'bg-white dark:bg-gray-700 shadow-sm'
                    )}
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                        todo.completed
                          ? 'bg-mint-400 border-mint-400'
                          : 'border-gray-300 dark:border-gray-500 hover:border-primary-300'
                      )}
                    >
                      {todo.completed && (
                        <Check className="w-3 h-3 text-white animate-bounce-soft" />
                      )}
                    </button>
                    <span
                      className={cn(
                        'flex-1 text-sm transition-all',
                        todo.completed
                          ? 'text-gray-400 line-through'
                          : 'text-gray-700 dark:text-gray-200'
                      )}
                    >
                      {todo.content}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <Button fullWidth variant="ghost" onClick={() => setShowAddTodo(true)}>
              <Plus className="w-4 h-4" />
              添加待办
            </Button>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="text-center">
              <p className="text-2xl font-extrabold text-primary-500">{milkCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">🍼 喂奶</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-extrabold text-mint-500">{foodCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">🥣 辅食</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-extrabold text-sky-400">{diaperCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">🧷 尿布</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-extrabold text-indigo-400">
                {Math.floor(todaySleepDuration / 60)}
                <span className="text-sm">h{todaySleepDuration % 60}</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">😴 {todaySleepRecordsList.length}段</p>
            </Card>
          </div>

          <Card>
            <h3 className="font-bold text-gray-800 dark:text-white mb-3">快速记录</h3>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => openQuickModal('milk')}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-cream-100 text-orange-500 hover:bg-cream-200 transition-all hover:scale-105 active:scale-95"
              >
                <Milk className="w-6 h-6" />
                <span className="text-xs font-medium">喂奶</span>
              </button>
              <button
                onClick={() => openQuickModal('food')}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-mint-100 text-mint-600 hover:bg-mint-200 transition-all hover:scale-105 active:scale-95"
              >
                <UtensilsCrossed className="w-6 h-6" />
                <span className="text-xs font-medium">辅食</span>
              </button>
              <button
                onClick={() => openQuickModal('diaper')}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-sky-100 text-sky-500 hover:bg-sky-200 transition-all hover:scale-105 active:scale-95"
              >
                <BabyIcon className="w-6 h-6" />
                <span className="text-xs font-medium">换尿布</span>
              </button>
              <button
                onClick={() => openQuickModal('sleep')}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-primary-100 text-primary-500 hover:bg-primary-200 transition-all hover:scale-105 active:scale-95"
              >
                <Moon className="w-6 h-6" />
                <span className="text-xs font-medium">睡眠</span>
              </button>
            </div>
          </Card>

          {todaySleepRecordsList.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 dark:text-white">今日睡眠</h3>
                <span className="text-xs text-primary-500 font-semibold bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-full">
                  共 {formatDuration(todaySleepDuration)}
                </span>
              </div>
              <div className="space-y-2">
                {todaySleepRecordsList.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌙</span>
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        {record.startTime} - {record.endTime}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-primary-500">
                      {formatDuration(record.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      <Modal isOpen={showAddTodo} onClose={() => setShowAddTodo(false)} title="添加待办">
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="输入待办事项..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none transition-all"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setShowAddTodo(false)}>
              取消
            </Button>
            <Button fullWidth onClick={handleAddTodo}>
              添加
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!showQuickModal} onClose={() => setShowQuickModal(null)} title={getQuickModalTitle()}>
        <div className="space-y-4">
          {showQuickModal !== 'sleep' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                时间
              </label>
              <input
                type="time"
                value={quickTime}
                onChange={(e) => setQuickTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
              />
            </div>
          )}

          {showQuickModal === 'milk' && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  奶量
                </label>
                <input
                  type="number"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(e.target.value)}
                  placeholder="120"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
                />
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  单位
                </label>
                <select
                  value={quickUnit}
                  onChange={(e) => setQuickUnit(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
                >
                  <option value="ml">ml</option>
                  <option value="oz">oz</option>
                </select>
              </div>
            </div>
          )}

          {showQuickModal === 'food' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  辅食名称
                </label>
                <input
                  type="text"
                  value={quickFoodName}
                  onChange={(e) => setQuickFoodName(e.target.value)}
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
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(e.target.value)}
                  placeholder="50"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
                />
              </div>
            </>
          )}

          {showQuickModal === 'diaper' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                尿布类型
              </label>
              <div className="flex gap-2">
                {(['wet', 'dirty', 'both'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setQuickDiaperType(type)}
                    className={cn(
                      'flex-1 py-3 rounded-xl text-sm font-medium transition-all',
                      quickDiaperType === type
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

          {showQuickModal === 'sleep' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  入睡时间
                </label>
                <input
                  type="time"
                  value={quickStartTime}
                  onChange={(e) => setQuickStartTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  起床时间
                </label>
                <input
                  type="time"
                  value={quickEndTime}
                  onChange={(e) => setQuickEndTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              备注
            </label>
            <input
              type="text"
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="有什么想记录的..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setShowQuickModal(null)}>
              取消
            </Button>
            <Button fullWidth onClick={handleQuickSave}>
              保存
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
