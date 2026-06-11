import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, Calendar, Package, Ruler } from 'lucide-react';
import { Card } from '../components/Card';
import { useBabyStore } from '../store/useBabyStore';
import { useFeedingStore } from '../store/useFeedingStore';
import { useSleepStore } from '../store/useSleepStore';
import { useTodoStore } from '../store/useTodoStore';
import { useSupplyStore } from '../store/useSupplyStore';
import { useGrowthStore } from '../store/useGrowthStore';
import { useUISettingsStore } from '../store/useUISettingsStore';
import { formatAge, getToday, formatDuration } from '../utils/date';
import { useNavigate } from 'react-router-dom';

export const SharedView = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { shareToken, currentBabyId, setCurrentBabyId } = useUISettingsStore();
  const { getBaby } = useBabyStore();
  const { getTodayRecords: getFeedingRecords } = useFeedingStore();
  const { getTodayTotalDuration, getTodayRecords: getSleepRecords } = useSleepStore();
  const { getTodayTodos } = useTodoStore();
  const { getItemsByBaby } = useSupplyStore();
  const { getRecordsByBaby, getLatestRecord } = useGrowthStore();

  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (token && shareToken && token === shareToken && currentBabyId) {
      setIsValid(true);
    } else if (!currentBabyId) {
      setIsValid(false);
    } else {
      setIsValid(token === shareToken);
    }
  }, [token, shareToken, currentBabyId]);

  const baby = currentBabyId ? getBaby(currentBabyId) : undefined;
  const feedingRecords = currentBabyId ? getFeedingRecords(currentBabyId) : [];
  const sleepDuration = currentBabyId ? getTodayTotalDuration(currentBabyId) : 0;
  const sleepRecords = currentBabyId ? getSleepRecords(currentBabyId) : [];
  const todos = currentBabyId ? getTodayTodos(currentBabyId) : [];
  const supplies = currentBabyId ? getItemsByBaby(currentBabyId) : [];
  const latestGrowth = currentBabyId ? getLatestRecord(currentBabyId) : undefined;

  if (!isValid) {
    return (
      <div className="min-h-screen bg-primary-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center py-12">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <Eye className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            链接无效或已失效
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            该分享链接已被撤销或不正确
          </p>
          <Link to="/" className="inline-block">
            <button className="px-6 py-2.5 bg-primary-400 hover:bg-primary-500 text-white rounded-full font-semibold transition-colors">
              返回首页
            </button>
          </Link>
        </Card>
      </div>
    );
  }

  const completedTodos = todos.filter(t => t.completed).length;
  const milkCount = feedingRecords.filter(r => r.type === 'milk').length;
  const diaperCount = feedingRecords.filter(r => r.type === 'diaper').length;
  const lowStockSupplies = supplies.filter(s => s.stock <= s.warningLevel);

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{baby?.avatar || '👶'}</span>
            <div>
              <h1 className="text-xl font-extrabold text-gray-800 dark:text-white">
                {baby?.name || '宝宝'}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {baby ? formatAge(baby.birthday) : ''} · {getToday()}
              </p>
            </div>
          </div>
          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
            🔒 只读模式
          </span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            <Card className="text-center py-3">
              <p className="text-lg font-extrabold text-primary-500">{completedTodos}/{todos.length}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">📝 待办</p>
            </Card>
            <Card className="text-center py-3">
              <p className="text-lg font-extrabold text-orange-500">{milkCount}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">🍼 喂奶</p>
            </Card>
            <Card className="text-center py-3">
              <p className="text-lg font-extrabold text-sky-500">{diaperCount}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">🧷 尿布</p>
            </Card>
            <Card className="text-center py-3">
              <p className="text-lg font-extrabold text-indigo-500">{Math.floor(sleepDuration/60)}h{sleepDuration%60}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">😴 睡眠</p>
            </Card>
          </div>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-primary-400" />
              <h3 className="font-bold text-gray-800 dark:text-white text-sm">今日待办</h3>
            </div>
            {todos.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 py-2 text-center">暂无待办</p>
            ) : (
              <div className="space-y-1.5">
                {todos.map(todo => (
                  <div key={todo.id} className="flex items-center gap-2 py-1">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      todo.completed ? 'bg-mint-400 border-mint-400' : 'border-gray-300 dark:border-gray-500'
                    }`}>
                      {todo.completed && <span className="text-[8px] text-white">✓</span>}
                    </div>
                    <span className={`text-xs ${
                      todo.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'
                    }`}>
                      {todo.content}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">🍼</span>
              <h3 className="font-bold text-gray-800 dark:text-white text-sm">今日喂养记录</h3>
            </div>
            {feedingRecords.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 py-2 text-center">暂无记录</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-hide">
                {feedingRecords.map(record => (
                  <div key={record.id} className="flex items-center gap-2 py-1 px-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <span className="text-sm">
                      {record.type === 'milk' ? '🍼' : record.type === 'food' ? '🥣' : '🧷'}
                    </span>
                    <span className="text-xs font-medium text-gray-800 dark:text-white w-10">
                      {record.time}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-300 flex-1 truncate">
                      {record.type === 'milk' && record.amount && `${record.amount}${record.unit}`}
                      {record.type === 'food' && (record.foodName || '辅食')}
                      {record.type === 'diaper' && (record.diaperType === 'wet' ? '嘘嘘' : record.diaperType === 'dirty' ? '便便' : '嘘嘘+便便')}
                      {record.note && ` · ${record.note}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">😴</span>
              <h3 className="font-bold text-gray-800 dark:text-white text-sm">今日睡眠</h3>
              <span className="ml-auto text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                {sleepRecords.length}段 · {formatDuration(sleepDuration)}
              </span>
            </div>
            {sleepRecords.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 py-2 text-center">暂无睡眠记录</p>
            ) : (
              <div className="space-y-1.5">
                {sleepRecords.map(record => (
                  <div key={record.id} className="flex items-center justify-between py-1 px-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <span className="text-xs text-gray-700 dark:text-gray-200">
                      {record.startTime} - {record.endTime}
                    </span>
                    <span className="text-xs font-medium text-indigo-500">
                      {formatDuration(record.duration)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-sky-400" />
              <h3 className="font-bold text-gray-800 dark:text-white text-sm">用品库存</h3>
            </div>
            {supplies.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 py-2 text-center">暂无用品</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {supplies.slice(0, 6).map(supply => (
                  <div key={supply.id} className={`p-2 rounded-lg text-center ${
                    supply.stock <= supply.warningLevel
                      ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30'
                      : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <p className="text-xs font-medium text-gray-800 dark:text-white truncate">
                      {supply.name}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${
                      supply.stock <= supply.warningLevel ? 'text-red-500 font-bold' : 'text-gray-500'
                    }`}>
                      {supply.stock} {supply.unit}
                      {supply.stock <= supply.warningLevel && ' ⚠️'}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {lowStockSupplies.length > 0 && (
              <p className="text-[10px] text-red-500 mt-2 text-center">
                {lowStockSupplies.length}项库存不足
              </p>
            )}
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Ruler className="w-4 h-4 text-mint-400" />
              <h3 className="font-bold text-gray-800 dark:text-white text-sm">成长数据</h3>
            </div>
            {!latestGrowth ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 py-2 text-center">暂无记录</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-mint-50 dark:bg-mint-900/20 rounded-lg">
                  <p className="text-lg font-extrabold text-mint-500">{latestGrowth.weight}<span className="text-[10px]">kg</span></p>
                  <p className="text-[10px] text-gray-500 mt-0.5">体重</p>
                </div>
                <div className="text-center p-2 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                  <p className="text-lg font-extrabold text-sky-500">{latestGrowth.height}<span className="text-[10px]">cm</span></p>
                  <p className="text-[10px] text-gray-500 mt-0.5">身高</p>
                </div>
                <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-[10px] font-medium text-gray-600 dark:text-gray-300 py-1">
                    {latestGrowth.date.slice(5)}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">记录日</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-3 h-3 inline mr-1" />
            返回宝妈日记
          </button>
          <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-2">
            宝妈日记 · 家庭共享只读页面
          </p>
        </div>
      </div>
    </div>
  );
};
