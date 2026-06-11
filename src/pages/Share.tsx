import { useState } from 'react';
import { Share2, Copy, Link2, Users, Baby, Check, QrCode } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useUISettingsStore } from '../store/useUISettingsStore';
import { useBabyStore } from '../store/useBabyStore';
import { generateShareToken, copyToClipboard } from '../utils/export';
import { cn } from '../lib/utils';

export const Share = () => {
  const { currentBabyId, shareToken, setShareToken } = useUISettingsStore();
  const { getBaby } = useBabyStore();

  const [copied, setCopied] = useState(false);

  const currentBaby = currentBabyId ? getBaby(currentBabyId) : undefined;

  const handleGenerateLink = () => {
    const token = generateShareToken();
    setShareToken(token);
  };

  const handleCopyLink = async () => {
    if (!shareToken) return;
    const link = `${window.location.origin}/share/${shareToken}`;
    await copyToClipboard(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = () => {
    if (confirm('确定要撤销当前分享链接吗？撤销后链接将失效。')) {
      setShareToken(null);
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
          分享只读链接，让家人一起关注宝宝成长
        </p>
      </div>

      <Card className="bg-gradient-to-br from-primary-50 to-mint-50 dark:from-primary-900/20 dark:to-mint-900/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm">
            <span className="text-3xl">{currentBaby.avatar}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 dark:text-white">{currentBaby.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              正在分享宝宝的育儿记录
            </p>
          </div>
          <Share2 className="w-6 h-6 text-primary-400" />
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-gray-800 dark:text-white mb-4">分享链接</h3>

        {!shareToken ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-8 h-8 text-primary-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              生成只读链接，分享给家人查看<br />
              <span className="text-sm text-gray-400 dark:text-gray-500">
                对方只能查看，不能修改数据
              </span>
            </p>
            <Button onClick={handleGenerateLink} size="lg">
              <Share2 className="w-5 h-5" />
              生成分享链接
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">分享链接</p>
              <p className="text-sm text-gray-700 dark:text-gray-200 break-all font-mono">
                {window.location.origin}/share/{shareToken}
              </p>
            </div>

            <div className="flex gap-3">
              <Button fullWidth onClick={handleCopyLink} variant="secondary">
                {copied ? (
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

            <div className="flex items-center justify-center gap-4 py-4">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
              <span className="text-xs text-gray-400 dark:text-gray-500">或者</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
            </div>

            <div className="flex flex-col items-center py-4">
              <div className="w-32 h-32 bg-white dark:bg-gray-700 rounded-xl shadow-sm flex items-center justify-center mb-2">
                <QrCode className="w-20 h-20 text-gray-300 dark:text-gray-500" />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">扫码查看</p>
            </div>

            <button
              onClick={handleRevoke}
              className="w-full py-3 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              撤销分享链接
            </button>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="font-bold text-gray-800 dark:text-white mb-4">分享说明</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-mint-100 dark:bg-mint-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-mint-600 dark:text-mint-300 text-sm font-bold">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">只读模式</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                分享的链接只能查看，不能修改任何数据
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-sky-600 dark:text-sky-300 text-sm font-bold">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">实时更新</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                你添加的新记录，对方刷新即可看到
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 dark:text-primary-300 text-sm font-bold">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">随时撤销</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                随时可以撤销链接，撤销后将无法访问
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-gray-800 dark:text-white mb-4">可分享的内容</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '📝', label: '每日待办' },
            { icon: '🍼', label: '喂养记录' },
            { icon: '😴', label: '睡眠记录' },
            { icon: '📦', label: '用品清单' },
            { icon: '📏', label: '成长数据' },
            { icon: '📊', label: '数据统计' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm text-gray-700 dark:text-gray-200">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
