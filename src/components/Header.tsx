import { useState } from 'react';
import { Moon, Sun, ChevronDown, Baby } from 'lucide-react';
import { useUISettingsStore } from '../store/useUISettingsStore';
import { useBabyStore } from '../store/useBabyStore';
import { formatAge } from '../utils/date';
import { cn } from '../lib/utils';
import { Modal } from './Modal';
import { Button } from './Button';

export const Header = () => {
  const { darkMode, toggleDarkMode, currentBabyId, setCurrentBabyId } = useUISettingsStore();
  const { babies, addBaby } = useBabyStore();
  const [showBabyPicker, setShowBabyPicker] = useState(false);
  const [showAddBaby, setShowAddBaby] = useState(false);
  const [newBabyName, setNewBabyName] = useState('');
  const [newBabyBirthday, setNewBabyBirthday] = useState('');
  const [newBabyGender, setNewBabyGender] = useState<'boy' | 'girl' | 'unknown'>('unknown');

  const currentBaby = babies.find((b) => b.id === currentBabyId);

  const handleAddBaby = () => {
    if (!newBabyName || !newBabyBirthday) return;
    addBaby({
      name: newBabyName,
      birthday: newBabyBirthday,
      gender: newBabyGender,
      avatar: newBabyGender === 'boy' ? '👦' : newBabyGender === 'girl' ? '👧' : '👶',
    });
    setNewBabyName('');
    setNewBabyBirthday('');
    setNewBabyGender('unknown');
    setShowAddBaby(false);
  };

  const handleSelectBaby = (id: string) => {
    setCurrentBabyId(id);
    setShowBabyPicker(false);
  };

  const getAvatar = (gender: string) => {
    switch (gender) {
      case 'boy': return '👦';
      case 'girl': return '👧';
      default: return '👶';
    }
  };

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 glass border-b border-gray-100 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowBabyPicker(true)}
          className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl px-3 py-2 transition-colors"
        >
          {currentBaby ? (
            <>
              <span className="text-2xl">{currentBaby.avatar}</span>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800 dark:text-white">
                  {currentBaby.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatAge(currentBaby.birthday)}
                </p>
              </div>
            </>
          ) : (
            <>
              <Baby className="w-6 h-6 text-primary-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">选择宝宝</span>
            </>
          )}
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="切换夜间模式"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      <Modal isOpen={showBabyPicker} onClose={() => setShowBabyPicker(false)} title="选择宝宝档案">
        <div className="space-y-2 mb-4">
          {babies.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              还没有宝宝档案，快去创建一个吧～
            </p>
          ) : (
            babies.map((baby) => (
              <button
                key={baby.id}
                onClick={() => handleSelectBaby(baby.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left',
                  currentBabyId === baby.id
                    ? 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-300 dark:border-primary-700'
                    : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <span className="text-2xl">{getAvatar(baby.gender)}</span>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{baby.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatAge(baby.birthday)} · {baby.birthday}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
        <Button fullWidth onClick={() => setShowAddBaby(true)} variant="primary">
          + 添加宝宝档案
        </Button>
      </Modal>

      <Modal isOpen={showAddBaby} onClose={() => setShowAddBaby(false)} title="添加宝宝档案">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              宝宝姓名
            </label>
            <input
              type="text"
              value={newBabyName}
              onChange={(e) => setNewBabyName(e.target.value)}
              placeholder="请输入宝宝姓名"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              出生日期
            </label>
            <input
              type="date"
              value={newBabyBirthday}
              onChange={(e) => setNewBabyBirthday(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none transition-all"
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
                  onClick={() => setNewBabyGender(g)}
                  className={cn(
                    'flex-1 py-3 rounded-xl text-sm font-medium transition-all',
                    newBabyGender === g
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
            <Button variant="ghost" fullWidth onClick={() => setShowAddBaby(false)}>
              取消
            </Button>
            <Button fullWidth onClick={handleAddBaby}>
              创建
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  );
};
