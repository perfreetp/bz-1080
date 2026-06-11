import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Eye, Calendar, Package, Ruler, Lock, AlertTriangle } from 'lucide-react';
import { Card } from '../components/Card';
import {
  useShareStore,
  ShareSnapshot,
  decodeSnapshot,
} from '../store/useShareStore';
import {
  formatAge,
  getToday,
  formatDuration,
  formatTime,
} from '../utils/date';
import { FeedingRecord, SleepRecord, TodoItem, SupplyItem, GrowthRecord } from '../types';

export const SharedView = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const { isTokenRevoked, getShareByToken } = useShareStore();

  const [loadState, setLoadState] = useState<
    'loading' | 'valid' | 'revoked' | 'invalid'
  >('loading');
  const [snapshot, setSnapshot] = useState<ShareSnapshot | null>(null);

  useEffect(() => {
    if (!token) {
      setLoadState('invalid');
      return;
    }

    const dParam = searchParams.get('d');
    let decoded: ShareSnapshot | null = null;

    if (dParam) {
      decoded = decodeSnapshot(dParam);
    }

    const shareRecord = getShareByToken(token);
    const revoked = isTokenRevoked(token);

    if (revoked) {
      setLoadState('revoked');
      return;
    }

    if (decoded) {
      setSnapshot(decoded);
      setLoadState('valid');
      return;
    }

    if (shareRecord && !shareRecord.revoked) {
      setLoadState('invalid');
      return;
    }

    setLoadState('invalid');
  }, [token, searchParams, isTokenRevoked, getShareByToken]);

  const baby = snapshot?.baby;

  const todayStr = useMemo(() => getToday(), []);

  const todayFeedingRecords: FeedingRecord[] = useMemo(() => {
    if (!snapshot) return [];
    return snapshot.feeding
      .filter((r) => r.date === todayStr)
      .sort((a, b) => b.time.localeCompare(a.time));
  }, [snapshot, todayStr]);

  const todaySleepRecords: SleepRecord[] = useMemo(() => {
    if (!snapshot) return [];
    return snapshot.sleep
      .filter((r) => r.date === todayStr)
      .sort((a, b) => b.startTime.localeCompare(a.startTime));
  }, [snapshot, todayStr]);

  const todaySleepDuration = useMemo(() => {
    return todaySleepRecords.reduce((sum, r) => sum + (r.duration || 0), 0);
  }, [todaySleepRecords]);

  const todayTodos: TodoItem[] = useMemo(() => {
    if (!snapshot) return [];
    return snapshot.todos.filter((t) => t.date === todayStr);
  }, [snapshot, todayStr]);

  const supplies: SupplyItem[] = useMemo(() => snapshot?.supplies || [], [snapshot]);
  const growthRecords: GrowthRecord[] = useMemo(
    () => snapshot?.growth || [],
    [snapshot]
  );
  const latestGrowth: GrowthRecord | undefined = useMemo(() => {
    if (growthRecords.length === 0) return undefined;
    return [...growthRecords].sort((a, b) => b.date.localeCompare(a.date))[0];
  }, [growthRecords]);

  if (loadState === 'loading') {
    return (
      <div className="min-h-screen bg-primary-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">正在加载分享内容...</p>
        </div>
      </div>
    );
  }

  if (loadState === 'revoked') {
    return (
      <div className="min-h-screen bg-primary-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center py-12">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            分享链接已被撤销
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            该分享链接已被创建者撤销，无法继续访问
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
            如需查看，请联系宝妈获取新的分享链接
          </p>
          <div className="text-xs text-gray-300 dark:text-gray-600 mt-4 select-none cursor-default">
            宝妈日记 · 家庭共享
          </div>
        </Card>
      </div>
    );
  }

  if (loadState === 'invalid' || !snapshot || !baby) {
    return (
      <div className="min-h-screen bg-primary-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center py-12">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <Eye className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            链接无效或已过期
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            该分享链接不存在或格式不正确
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
            请向宝妈索取最新有效的分享链接
          </p>
          <div className="text-xs text-gray-300 dark:text-gray-600 mt-4 select-none cursor-default">
            宝妈日记 · 家庭共享
          </div>
        </Card>
      </div>
    );
  }

  const completedTodos = todayTodos.filter((t) => t.completed).length;
  const milkCount = todayFeedingRecords.filter((r) => r.type === 'milk').length;
  const foodCount = todayFeedingRecords.filter((r) => r.type === 'food').length;
  const diaperCount = todayFeedingRecords.filter((r) => r.type === 'diaper').length;
  const lowStockSupplies = supplies.filter((s) => s.stock <= s.warningLevel);

  const exportTime = snapshot.exportedAt
    ? new Date(snapshot.exportedAt).toLocaleString('zh-CN')
    : '';

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none">{baby.avatar}</span>
            <div>
              <h1 className="text-xl font-extrabold text-gray-800 dark:text-white select-none">
                {baby.name}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 select-none">
                {formatAge(baby.birthday)} · {getToday()}
              </p>
            </div>
          </div>
          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1.5 rounded-full font-medium inline-flex items-center gap-1 select-none">
            <Lock className="w-3 h-3" />
            只读模式 · 不可修改
          </span>
        </div>

        {exportTime && (
          <div className="mb-4 text-center text-[10px] text-gray-400 dark:text-gray-500 select-none">
            数据导出时间：{exportTime}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            <Card className="text-center py-3 select-none">
              <p className="text-lg font-extrabold text-primary-500">
                {completedTodos}/{todayTodos.length}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                📝 待办
              </p>
            </Card>
            <Card className="text-center py-3 select-none">
              <p className="text-lg font-extrabold text-orange-500">
                {milkCount + foodCount}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                🍼 喂养
              </p>
            </Card>
            <Card className="text-center py-3 select-none">
              <p className="text-lg font-extrabold text-sky-500">
                {diaperCount}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                🧷 尿布
              </p>
            </Card>
            <Card className="text-center py-3 select-none">
              <p className="text-lg font-extrabold text-indigo-500">
                {Math.floor(todaySleepDuration / 60)}h{todaySleepDuration % 60}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                😴 睡眠
              </p>
            </Card>
          </div>

          <Card>
            <div className="flex items-center gap-2 mb-3 select-none">
              <Calendar className="w-4 h-4 text-primary-400" />
              <h3 className="font-bold text-gray-800 dark:text-white text-sm">
                今日待办
              </h3>
            </div>
            {todayTodos.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 py-2 text-center select-none">
                今日暂无待办
              </p>
            ) : (
              <div className="space-y-1.5">
                {todayTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-2 py-1 cursor-not-allowed"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 opacity-90 ${
                        todo.completed
                          ? 'bg-mint-400 border-mint-400'
                          : 'border-gray-300 dark:border-gray-500'
                      }`}
                    >
                      {todo.completed && (
                        <span className="text-[8px] text-white">✓</span>
                      )}
                    </div>
                    <span
                      className={`text-xs select-none ${
                        todo.completed
                          ? 'text-gray-400 line-through'
                          : 'text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {todo.content}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-3 text-center select-none">
              🔒 只读 · 待办状态不可切换
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3 select-none">
              <span className="text-sm">🍼</span>
              <h3 className="font-bold text-gray-800 dark:text-white text-sm">
                今日喂养记录
              </h3>
              <span className="ml-auto text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 px-2 py-0.5 rounded-full">
                奶{milkCount} · 辅{foodCount} · 尿{diaperCount}
              </span>
            </div>
            {todayFeedingRecords.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 py-2 text-center select-none">
                今日暂无喂养记录
              </p>
            ) : (
              <div className="space-y-1.5 max-h-60 overflow-y-auto scrollbar-hide pr-1">
                {todayFeedingRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center gap-2 py-1.5 px-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                  >
                    <span className="text-sm select-none">
                      {record.type === 'milk'
                        ? '🍼'
                        : record.type === 'food'
                        ? '🥣'
                        : '🧷'}
                    </span>
                    <span className="text-xs font-medium text-gray-800 dark:text-white w-12 flex-shrink-0 select-none">
                      {formatTime(record.time)}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-300 flex-1 truncate select-none">
                      {record.type === 'milk' && record.amount && (
                        <span>{record.amount}{record.unit || 'ml'}</span>
                      )}
                      {record.type === 'food' && (
                        <span>
                          {record.foodName || '辅食'}
                          {record.amount && ` (${record.amount}g)`}
                        </span>
                      )}
                      {record.type === 'diaper' && (
                        <span>
                          {record.diaperType === 'wet'
                            ? '嘘嘘'
                            : record.diaperType === 'dirty'
                            ? '便便'
                            : '嘘嘘+便便'}
                        </span>
                      )}
                      {record.note && (
                        <span className="text-gray-400"> · {record.note}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-3 text-center select-none">
              🔒 只读 · 不支持新增或删除记录
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3 select-none">
              <span className="text-sm">😴</span>
              <h3 className="font-bold text-gray-800 dark:text-white text-sm">
                今日睡眠
              </h3>
              <span className="ml-auto text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full select-none">
                {todaySleepRecords.length}段 · {formatDuration(todaySleepDuration)}
              </span>
            </div>
            {todaySleepRecords.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 py-2 text-center select-none">
                今日暂无睡眠记录
              </p>
            ) : (
              <div className="space-y-1.5">
                {todaySleepRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between py-1.5 px-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                  >
                    <span className="text-xs text-gray-700 dark:text-gray-200 select-none">
                      {formatTime(record.startTime)} - {formatTime(record.endTime)}
                    </span>
                    <span className="text-xs font-medium text-indigo-500 select-none">
                      {formatDuration(record.duration)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-3 text-center select-none">
              🔒 只读 · 不支持新增或删除记录
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3 select-none">
              <Package className="w-4 h-4 text-sky-400" />
              <h3 className="font-bold text-gray-800 dark:text-white text-sm">
                用品库存
              </h3>
              {lowStockSupplies.length > 0 && (
                <span className="ml-auto text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-2 py-0.5 rounded-full select-none">
                  ⚠️ {lowStockSupplies.length}项低库存
                </span>
              )}
            </div>
            {supplies.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 py-2 text-center select-none">
                暂无用品清单
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {supplies.slice(0, 12).map((supply) => (
                  <div
                    key={supply.id}
                    className={`p-2.5 rounded-lg text-center cursor-default ${
                      supply.stock <= supply.warningLevel
                        ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30'
                        : 'bg-gray-50 dark:bg-gray-700/30'
                    }`}
                  >
                    <p className="text-xs font-medium text-gray-800 dark:text-white truncate select-none">
                      {supply.name}
                    </p>
                    <p
                      className={`text-[10px] mt-0.5 select-none ${
                        supply.stock <= supply.warningLevel
                          ? 'text-red-500 font-bold'
                          : 'text-gray-500'
                      }`}
                    >
                      {supply.stock} {supply.unit}
                      {supply.stock <= supply.warningLevel && ' ⚠️'}
                    </p>
                  </div>
                ))}
                {supplies.length > 12 && (
                  <div className="p-2.5 rounded-lg text-center bg-gray-50 dark:bg-gray-700/30 flex items-center justify-center">
                    <span className="text-[10px] text-gray-400 select-none">
                      +{supplies.length - 12}项更多...
                    </span>
                  </div>
                )}
              </div>
            )}
            <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-3 text-center select-none">
              🔒 只读 · 不支持修改库存
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3 select-none">
              <Ruler className="w-4 h-4 text-mint-400" />
              <h3 className="font-bold text-gray-800 dark:text-white text-sm">
                成长数据
              </h3>
            </div>
            {!latestGrowth ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 py-2 text-center select-none">
                暂无成长记录
              </p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2.5 bg-mint-50 dark:bg-mint-900/20 rounded-lg">
                    <p className="text-lg font-extrabold text-mint-500 select-none">
                      {latestGrowth.weight}
                      <span className="text-[10px]">kg</span>
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5 select-none">
                      体重
                    </p>
                  </div>
                  <div className="text-center p-2.5 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                    <p className="text-lg font-extrabold text-sky-500 select-none">
                      {latestGrowth.height}
                      <span className="text-[10px]">cm</span>
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5 select-none">
                      身高
                    </p>
                  </div>
                  <div className="text-center p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-sm font-extrabold text-orange-500 py-1 select-none">
                      {latestGrowth.headCircumference
                        ? `${latestGrowth.headCircumference}cm`
                        : '-'}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5 select-none">
                      头围
                    </p>
                  </div>
                </div>
                <div className="text-[10px] text-gray-400 text-center select-none">
                  最近一次测量：{latestGrowth.date}
                </div>
                {growthRecords.length > 1 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2 select-none">
                      历史测量（共{growthRecords.length}次）
                    </p>
                    <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-hide">
                      {[...growthRecords]
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .slice(1, 6)
                        .map((record) => (
                          <div
                            key={record.id}
                            className="flex items-center justify-between text-[10px] px-2 py-1 bg-gray-50 dark:bg-gray-700/30 rounded"
                          >
                            <span className="text-gray-400 dark:text-gray-500 select-none">
                              {record.date}
                            </span>
                            <span className="text-gray-600 dark:text-gray-300 select-none">
                              {record.weight}kg / {record.height}cm
                              {record.headCircumference &&
                                ` / ${record.headCircumference}cm`}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
            <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-3 text-center select-none">
              🔒 只读 · 不支持新增测量记录
            </p>
          </Card>
        </div>

        <div className="mt-8 py-4 text-center select-none">
          <div className="inline-flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500 bg-white/60 dark:bg-gray-800/40 px-3 py-1.5 rounded-full">
            <Lock className="w-3 h-3" />
            本页面为只读模式，全程不可做任何更改
          </div>
          <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-4">
            宝妈日记 · 家庭共享只读页面
          </p>
        </div>
      </div>
    </div>
  );
};
