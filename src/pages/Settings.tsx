import { useState } from 'react';
import { Moon, Sun, Baby, Trash2, Edit2, Plus, Syringe, Stethoscope, Check, CalendarX } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useUISettingsStore } from '../store/useUISettingsStore';
import { useBabyStore } from '../store/useBabyStore';
import { useVaccineStore } from '../store/useVaccineStore';
import { formatAge, getToday } from '../utils/date';
import { cn } from '../lib/utils';

export const Settings = () => {
  const { darkMode, toggleDarkMode, currentBabyId, setCurrentBabyId } = useUISettingsStore();
  const { babies, addBaby, updateBaby, deleteBaby } = useBabyStore();
  const { reminders, addReminder, deleteReminder, toggleReminder, getRemindersByBaby } = useVaccineStore();

  const [showAddBaby, setShowAddBaby] = useState(false);
  const [editingBabyId, setEditingBabyId] = useState<string | null>(null);
  const [babyName, setBabyName] = useState('');
  const [babyBirthday, setBabyBirthday] = useState('');
  const [babyGender, setBabyGender] = useState<'boy' | 'girl' | 'unknown'>('unknown');

  const [showAddReminder, setShowAddReminder] = useState(false);
  const [reminderName, setReminderName] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderType, setReminderType] = useState<'vaccine' | 'checkup'>('vaccine');
  const [reminderNote, setReminderNote] = useState('');

  const babyReminders = currentBabyId ? getRemindersByBaby(currentBabyId) : [];

  const handleAddBaby = () => {
    if (!babyName || !babyBirthday) return;
    addBaby({
      name: babyName,
      birthday: babyBirthday,
      gender: babyGender,
      avatar: babyGender === 'boy' ? '👦' : babyGender === 'girl' ? '👧' : '👶',
    });
    resetBabyForm();
    setShowAddBaby(false);
  };

  const handleUpdateBaby = () => {
    if (!editingBabyId || !babyName || !babyBirthday) return;
    updateBaby(editingBabyId, {
      name: babyName,
      birthday: babyBirthday,
      gender: babyGender,
      avatar: babyGender === 'boy' ? '👦' : babyGender === 'girl' ? '👧' : '👶',
    });
    resetBabyForm();
    setEditingBabyId(null);
  };

  const resetBabyForm = () => {
    setBabyName('');
    setBabyBirthday('');
    setBabyGender('unknown');
  };

  const startEdit = (baby: any) => {
    setBabyName(baby.name);
    setBabyBirthday(baby.birthday);
    setBabyGender(baby.gender);
    setEditingBabyId(baby.id);
  };

  const handleDeleteBaby = (id: string) => {
    if (confirm('确定要删除这个宝宝档案吗？相关数据也会被清除。')) {
      deleteBaby(id);
      if (currentBabyId === id) {
        setCurrentBabyId(null);
      }
    }
  };

  const handleAddReminder = () => {
    if (!currentBabyId || !reminderName || !reminderDate) return;
    addReminder({
      babyId: currentBabyId,
      name: reminderName,
      date: reminderDate,
      type: reminderType,
      completed: false,
      note: reminderNote || undefined,
    });
    setReminderName('');
    setReminderDate('');
    setReminderNote('');
    setShowAddReminder(false);
  };

  const isOverdue = (date: string) => date < getToday();
  const isUpcoming = (date: string, days = 7) => {
    const today = getToday();
    const future = new Date(today);
    future.setDate(future.getDate() + days);
    return date >= today && date <= future.toISOString().split('T')[0];
  };

  const getAvatar = (gender: string) => {
    switch (gender) {
      case 'boy': return '👦';
      case 'girl': return '👧';
      default: return '👶';
    }
  };

  const currentBabyName = currentBabyId ? (babies.find(b => b.id === currentBabyId)?.name || '') : '';

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white">
        设置
      </h2>

      <Card>
        <h3 className="font-bold text-gray-800 dark:text-white mb-4">外观</h3>
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="w-5 h-5 text-indigo-400" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-500" />
            )}
            <span className="text-gray-800 dark:text-white font-medium">夜间模式</span>
          </div>
          <div className={cn(
            'w-12 h-7 rounded-full relative transition-colors',
            darkMode ? 'bg-primary-400' : 'bg-gray-300'
          )}>
            <div className={cn(
              'absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform',
              darkMode ? 'translate-x-5' : 'translate-x-0.5'
            )} />
          </div>
        </button>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 dark:text-white">宝宝档案</h3>
          <Button size="sm" variant="ghost" onClick={() => setShowAddBaby(true)}>
            <Plus className="w-4 h-4" />
            添加
          </Button>
        </div>

        <div className="space-y-2">
          {babies.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-6 text-sm">
              还没有宝宝档案
            </p>
          ) : (
            babies.map((baby) => (
              <div
                key={baby.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
                  currentBabyId === baby.id
                    ? 'border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30'
                )}
              >
                <span className="text-2xl">{baby.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-white">{baby.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatAge(baby.birthday)} · {baby.birthday}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(baby)}
                    className="p-2 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBaby(baby.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white">疫苗和体检提醒</h3>
            {currentBabyName && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">当前宝宝：{currentBabyName}</p>
            )}
          </div>
          <Button size="sm" variant="ghost" onClick={() => {
            if (!currentBabyId) {
              alert('请先选择宝宝档案');
              return;
            }
            setShowAddReminder(true);
          }}>
            <Plus className="w-4 h-4" />
            添加
          </Button>
        </div>

        {!currentBabyId ? (
          <p className="text-center text-gray-400 dark:text-gray-500 py-6 text-sm">
            请先选择宝宝档案
          </p>
        ) : babyReminders.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500 py-6 text-sm">
            暂无提醒，点击右上角添加
          </p>
        ) : (
          <div className="space-y-2">
            {babyReminders.map((reminder) => (
              <div
                key={reminder.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
                  reminder.completed
                    ? 'border-mint-200 dark:border-mint-700/50 bg-mint-50 dark:bg-mint-900/20'
                    : isOverdue(reminder.date)
                    ? 'border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20'
                    : isUpcoming(reminder.date)
                    ? 'border-yellow-200 dark:border-yellow-700/50 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30'
                )}
              >
                <div className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                  reminder.type === 'vaccine'
                    ? 'bg-red-100 dark:bg-red-900/50'
                    : 'bg-sky-100 dark:bg-sky-900/50'
                )}>
                  {reminder.type === 'vaccine'
                    ? <Syringe className="w-4 h-4 text-red-500" />
                    : <Stethoscope className="w-4 h-4 text-sky-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={cn(
                      'font-medium text-sm',
                      reminder.completed
                        ? 'text-gray-400 line-through'
                        : 'text-gray-800 dark:text-white'
                    )}>
                      {reminder.name}
                    </p>
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full',
                      reminder.type === 'vaccine'
                        ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300'
                        : 'bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300'
                    )}>
                      {reminder.type === 'vaccine' ? '疫苗' : '体检'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className={cn(
                      'text-xs',
                      isOverdue(reminder.date) && !reminder.completed
                        ? 'text-red-500 font-medium'
                        : isUpcoming(reminder.date) && !reminder.completed
                        ? 'text-yellow-600 dark:text-yellow-400 font-medium'
                        : 'text-gray-500 dark:text-gray-400'
                    )}>
                      {reminder.date}
                      {isOverdue(reminder.date) && !reminder.completed && ' · 已逾期'}
                      {isUpcoming(reminder.date) && !reminder.completed && !isOverdue(reminder.date) && ' · 即将到来'}
                    </p>
                    {reminder.note && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">· {reminder.note}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleReminder(reminder.id)}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      reminder.completed
                        ? 'text-mint-500 bg-mint-100 dark:bg-mint-900/30'
                        : 'text-gray-400 hover:text-mint-500 hover:bg-mint-50 dark:hover:bg-mint-900/30'
                    )}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('确定删除这个提醒吗？')) {
                        deleteReminder(reminder.id);
                      }
                    }}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h3 className="font-bold text-gray-800 dark:text-white mb-4">关于</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600 dark:text-gray-300">版本</span>
            <span className="text-gray-400 dark:text-gray-500">v1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600 dark:text-gray-300">数据存储</span>
            <span className="text-gray-400 dark:text-gray-500">本地存储</span>
          </div>
          <div className="pt-2">
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
              宝妈日记 · 轻松育儿每一天 ❤️
            </p>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-r from-primary-50 to-mint-50 dark:from-primary-900/20 dark:to-mint-900/20 border-0">
        <div className="text-center py-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            所有数据仅保存在本地浏览器中
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            清除浏览器数据会导致记录丢失，请定期导出备份
          </p>
        </div>
      </Card>

      <Modal isOpen={showAddBaby} onClose={() => { setShowAddBaby(false); resetBabyForm(); }} title="添加宝宝档案">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              宝宝姓名
            </label>
            <input
              type="text"
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              placeholder="请输入宝宝姓名"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              出生日期
            </label>
            <input
              type="date"
              value={babyBirthday}
              onChange={(e) => setBabyBirthday(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              性别
            </label>
            <div className="flex gap-2">
              {(['girl', 'boy', 'unknown'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setBabyGender(g)}
                  className={cn(
                    'flex-1 py-3 rounded-xl text-sm font-medium transition-all',
                    babyGender === g
                      ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  )}
                >
                  {g === 'girl' ? '👧 女宝' : g === 'boy' ? '👦 男宝' : '👶 保密'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={() => { setShowAddBaby(false); resetBabyForm(); }}>
              取消
            </Button>
            <Button fullWidth onClick={handleAddBaby}>
              创建
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!editingBabyId} onClose={() => { setEditingBabyId(null); resetBabyForm(); }} title="编辑宝宝档案">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              宝宝姓名
            </label>
            <input
              type="text"
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              出生日期
            </label>
            <input
              type="date"
              value={babyBirthday}
              onChange={(e) => setBabyBirthday(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              性别
            </label>
            <div className="flex gap-2">
              {(['girl', 'boy', 'unknown'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setBabyGender(g)}
                  className={cn(
                    'flex-1 py-3 rounded-xl text-sm font-medium transition-all',
                    babyGender === g
                      ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  )}
                >
                  {g === 'girl' ? '👧 女宝' : g === 'boy' ? '👦 男宝' : '👶 保密'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={() => { setEditingBabyId(null); resetBabyForm(); }}>
              取消
            </Button>
            <Button fullWidth onClick={handleUpdateBaby}>
              保存
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showAddReminder} onClose={() => setShowAddReminder(false)} title="添加提醒">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              类型
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setReminderType('vaccine')}
                className={cn(
                  'flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2',
                  reminderType === 'vaccine'
                    ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                )}
              >
                <Syringe className="w-4 h-4" />
                疫苗
              </button>
              <button
                onClick={() => setReminderType('checkup')}
                className={cn(
                  'flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2',
                  reminderType === 'checkup'
                    ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                )}
              >
                <Stethoscope className="w-4 h-4" />
                体检
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              名称
            </label>
            <input
              type="text"
              value={reminderName}
              onChange={(e) => setReminderName(e.target.value)}
              placeholder={reminderType === 'vaccine' ? '例如：乙肝疫苗第三针' : '例如：6个月体检'}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              日期
            </label>
            <input
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              min={getToday()}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              备注（选填）
            </label>
            <input
              type="text"
              value={reminderNote}
              onChange={(e) => setReminderNote(e.target.value)}
              placeholder="有什么想提醒的..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setShowAddReminder(false)}>
              取消
            </Button>
            <Button fullWidth onClick={handleAddReminder}>
              添加
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
