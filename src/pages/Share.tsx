import { useState } from 'react';
import {
  Share2,
  Copy,
  Link2,
  Baby,
  Check,
  QrCode,
  Trash2,
  RefreshCw,
  Shield,
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useUISettingsStore } from '../store/useUISettingsStore';
import { useBabyStore } from '../store/useBabyStore';
import { useFeedingStore } from '../store/useFeedingStore';
import { useSleepStore } from '../store/useSleepStore';
import { useTodoStore } from '../store/useTodoStore';
import { useSupplyStore } from '../store/useSupplyStore';
import { useGrowthStore } from '../store/useGrowthStore';
import {
  useShareStore,
  ShareSnapshot,
  encodeSnapshot,
} from '../store/useShareStore';
import { copyToClipboard } from '../utils/export';
import { getToday } from '../utils/date';

interface LastGenerated {
  babyId: string;
  token: string;
  encodedData: string;
}

export const Share = () => {
  const { currentBabyId } = useUISettingsStore();
  const { getBaby } = useBabyStore();
  const { records: feedingRecords } = useFeedingStore();
  const { records: sleepRecords } = useSleepStore();
  const { todos } = useTodoStore();
  const { items: supplyItems } = useSupplyStore();
  const { records: growthRecords } = useGrowthStore();
  const { shares, createShare, revokeShare, isTokenRevoked } = useShareStore();

  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<LastGenerated | null>(null);

  const currentBaby = currentBabyId ? getBaby(currentBabyId) : undefined;

  const currentBabyShares = shares.filter(
    (s) => currentBabyId && s.babyId === currentBabyId
  );

  const handleGenerateLink = () => {
    if (!currentBabyId || !currentBaby) return;

    const snapshot: ShareSnapshot = {
      baby: currentBaby,
      exportedAt: new Date().toISOString(),
      feeding: feedingRecords.filter((r) => r.babyId === currentBabyId),
      sleep: sleepRecords.filter((r) => r.babyId === currentBabyId),
      todos: todos.filter((t) => t.babyId === currentBabyId),
      supplies: supplyItems.filter((s) => s.babyId === currentBabyId),
      growth: growthRecords.filter((g) => g.babyId === currentBabyId),
    };

    const { token, encodedData } = createShare(currentBabyId, snapshot);
    setLastGenerated({ babyId: currentBabyId, token, encodedData });
  };

  const buildShareUrl = (token: string, encodedData?: string) => {
    if (encodedData) {
      return `${window.location.origin}/#/share/${token}?d=${encodeURIComponent(
        encodedData
      )}`;
    }
    return `${window.location.origin}/#/share/${token}`;
  };

  const handleCopyLink = async (shareToken: string, encoded?: string) => {
    let useEncoded = encoded;
    if (!useEncoded && currentBabyId && currentBaby) {
      const snapshot: ShareSnapshot = {
        baby: currentBaby,
        exportedAt: new Date().toISOString(),
        feeding: feedingRecords.filter((r) => r.babyId === currentBabyId),
        sleep: sleepRecords.filter((r) => r.babyId === currentBabyId),
        todos: todos.filter((t) => t.babyId === currentBabyId),
        supplies: supplyItems.filter((s) => s.babyId === currentBabyId),
        growth: growthRecords.filter((g) => g.babyId === currentBabyId),
      };
      useEncoded = encodeSnapshot(snapshot);
    }
    const link = buildShareUrl(shareToken, useEncoded);
    await copyToClipboard(link);
    setCopiedToken(shareToken);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleRevoke = (shareToken: string) => {
    if (
      confirm('确定撤销这个分享链接？撤销后旧链接将无法再访问，且不可恢复。')
    ) {
      revokeShare(shareToken);
    }
  };

  if (!currentBaby) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white">
          家庭共享
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
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white">
          家庭共享
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          为每个宝宝生成独立只读快照链接，可随时单独撤销
        </p>
      </div>

      <Card className="bg-gradient-to-br from-primary-50 to-mint-50 dark:from-primary-900/20 dark:to-mint-900/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm">
            <span className="text-3xl">{currentBaby.avatar}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 dark:text-white">
              {currentBaby.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              当前档案：{currentBabyShares.length} 个有效分享链接
            </p>
          </div>
          <Share2 className="w-6 h-6 text-primary-400" />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 dark:text-white">分享链接</h3>
          <Button onClick={handleGenerateLink} size="sm">
            <RefreshCw className="w-4 h-4" />
            生成新链接
          </Button>
        </div>

        {currentBabyShares.length === 0 && !lastGenerated ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-8 h-8 text-primary-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              生成的链接是快照副本，可在任意设备打开
              <br />
              <span className="text-sm text-gray-400 dark:text-gray-500">
                对方只能查看，完全不可修改
              </span>
            </p>
            <Button onClick={handleGenerateLink} size="lg">
              <Share2 className="w-5 h-5" />
              生成第一个分享链接
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {lastGenerated && lastGenerated.babyId === currentBabyId &&
            !currentBabyShares.find(
              (s) => s.token === lastGenerated.token && s.revoked
            ) ? (
              <div className="p-4 rounded-xl bg-mint-50 dark:bg-mint-900/20 border-2 border-mint-300 dark:border-mint-700">
                <p className="text-xs text-mint-600 dark:text-mint-300 mb-2 font-bold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  最新生成 · {getToday()}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200 break-all font-mono bg-white dark:bg-gray-700/70 rounded-lg p-3">
                  {buildShareUrl(lastGenerated.token, lastGenerated.encodedData)}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    fullWidth
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      handleCopyLink(lastGenerated.token, lastGenerated.encodedData)
                    }
                  >
                    {copiedToken === lastGenerated.token ? (
                      <>
                        <Check className="w-4 h-4" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        复制链接
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : null}

            {currentBabyShares
              .slice()
              .reverse()
              .map((share) => {
                if (lastGenerated && share.token === lastGenerated.token)
                  return null;
                return (
                  <div
                    key={share.token}
                    className={
                      share.revoked
                        ? 'p-4 rounded-xl bg-gray-100 dark:bg-gray-700/30 opacity-60'
                        : 'p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40'
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={
                          share.revoked
                            ? 'text-xs text-gray-500 dark:text-gray-400'
                            : 'text-xs text-primary-500 dark:text-primary-300 font-bold'
                        }
                      >
                        {share.revoked ? '已撤销' : '有效链接'} · {share.createdAt}
                      </span>
                      {!share.revoked && (
                        <button
                          onClick={() => handleRevoke(share.token)}
                          className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          撤销
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-200 break-all font-mono bg-white dark:bg-gray-700/70 rounded-lg p-3 select-all">
                      {buildShareUrl(share.token)}
                    </p>
                    {!share.revoked && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          fullWidth
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCopyLink(share.token)}
                        >
                          {copiedToken === share.token ? (
                            <>
                              <Check className="w-4 h-4" />
                              已复制
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              复制
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </Card>

      <Card>
        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <QrCode className="w-5 h-5 text-primary-400" />
          分享给家人的方式
        </h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <p>
            <span className="font-bold text-gray-800 dark:text-white">① 复制链接：</span>
            通过微信 / QQ / 短信直接粘贴给家人
          </p>
          <p>
            <span className="font-bold text-gray-800 dark:text-white">② 跨设备可用：</span>
            手机、平板、电脑、无痕窗口都能直接打开
          </p>
          <p>
            <span className="font-bold text-gray-800 dark:text-white">③ 独立快照：</span>
            每个链接都打包了当时的数据，之后切换宝宝档案不影响历史链接
          </p>
          <p>
            <span className="font-bold text-gray-800 dark:text-white">④ 完全只读：</span>
            家人无法勾选、添加、删除或修改任何记录
          </p>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-gray-800 dark:text-white mb-4">
          家人可查看的内容
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '📝', label: '每日待办' },
            { icon: '🍼', label: '喂养记录' },
            { icon: '😴', label: '睡眠记录' },
            { icon: '📦', label: '用品清单' },
            { icon: '📏', label: '成长数据' },
            { icon: '📊', label: '今日概览' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm text-gray-700 dark:text-gray-200">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
