import { useState } from 'react';
import { Plus, Trash2, ShoppingCart, AlertTriangle, Baby, Package } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Tabs } from '../components/Tabs';
import { useSupplyStore } from '../store/useSupplyStore';
import { useUISettingsStore } from '../store/useUISettingsStore';
import { useBabyStore } from '../store/useBabyStore';
import { SupplyItem } from '../types';
import { cn } from '../lib/utils';
import { copyToClipboard } from '../utils/export';

const categories = [
  { id: 'all', label: '全部', icon: '📦' },
  { id: 'milk', label: '奶粉', icon: '🍼' },
  { id: 'diaper', label: '纸尿裤', icon: '🧷' },
  { id: 'clothes', label: '衣物', icon: '👕' },
  { id: 'other', label: '其他', icon: '🎁' },
];

export const Supplies = () => {
  const { currentBabyId } = useUISettingsStore();
  const { getBaby } = useBabyStore();
  const { items, addItem, deleteItem, updateItem, getItemsByBaby, getLowStockItems, generateShoppingList } = useSupplyStore();

  const [activeCategory, setActiveCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SupplyItem['category']>('milk');
  const [stock, setStock] = useState('');
  const [warningLevel, setWarningLevel] = useState('');
  const [unit, setUnit] = useState('罐');

  const currentBaby = currentBabyId ? getBaby(currentBabyId) : undefined;
  const allItems = currentBabyId ? getItemsByBaby(currentBabyId) : [];
  const lowStockItems = currentBabyId ? getLowStockItems(currentBabyId) : [];
  const shoppingList = currentBabyId ? generateShoppingList(currentBabyId) : [];

  const displayItems = activeCategory === 'all'
    ? allItems
    : allItems.filter((i) => i.category === activeCategory);

  const handleAddItem = () => {
    if (!currentBabyId || !name || !stock) return;
    addItem({
      babyId: currentBabyId,
      name,
      category,
      stock: Number(stock),
      warningLevel: warningLevel ? Number(warningLevel) : 0,
      unit,
    });
    resetForm();
    setShowAddModal(false);
  };

  const resetForm = () => {
    setName('');
    setCategory('milk');
    setStock('');
    setWarningLevel('');
    setUnit('罐');
  };

  const handleCopyShoppingList = async () => {
    const text = shoppingList.map(item => `${item.name} × 1`).join('\n');
    await copyToClipboard(`购物清单：\n${text}`);
    alert('已复制到剪贴板');
  };

  const adjustStock = (id: string, delta: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    updateItem(id, { stock: Math.max(0, item.stock + delta) });
  };

  if (!currentBaby) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white">
          用品清单
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
          用品清单
        </h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowShoppingList(true)}>
            <ShoppingCart className="w-4 h-4" />
            购物清单
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            添加
          </Button>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-600 dark:text-red-400 text-sm">
                库存预警 ({lowStockItems.length}项)
              </p>
              <p className="text-xs text-red-500 dark:text-red-400/80 mt-0.5">
                {lowStockItems.map(i => i.name).join('、')} 库存不足
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <Tabs
          tabs={categories.map(c => ({ id: c.id, label: c.label, icon: <span>{c.icon}</span> }))}
          activeTab={activeCategory}
          onChange={setActiveCategory}
          className="mb-4"
        />

        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
          {displayItems.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">
              暂无用品，点击添加
            </p>
          ) : (
            displayItems.map((item) => {
              const isLow = item.stock <= item.warningLevel;
              const stockPercent = item.warningLevel > 0
                ? Math.min((item.stock / (item.warningLevel * 3)) * 100, 100)
                : 100;

              return (
                <div
                  key={item.id}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all',
                    isLow
                      ? 'border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10'
                      : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-700/30'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {item.category === 'milk' ? '🍼' : item.category === 'diaper' ? '🧷' : item.category === 'clothes' ? '👕' : '🎁'}
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {item.name}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-500 dark:text-gray-400">
                        库存：{item.stock} {item.unit}
                      </span>
                      {isLow && (
                        <span className="text-xs text-red-500 font-medium">库存不足</span>
                      )}
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          isLow ? 'bg-red-400' : 'bg-mint-400'
                        )}
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      警戒线：{item.warningLevel} {item.unit}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => adjustStock(item.id, -1)}
                        className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                      >
                        -
                      </button>
                      <button
                        onClick={() => adjustStock(item.id, 1)}
                        className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="添加用品">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              用品名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：一段奶粉"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              分类
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['milk', 'diaper', 'clothes', 'other'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'py-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1',
                    category === cat
                      ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  )}
                >
                  <span className="text-lg">
                    {cat === 'milk' ? '🍼' : cat === 'diaper' ? '🧷' : cat === 'clothes' ? '👕' : '🎁'}
                  </span>
                  {cat === 'milk' ? '奶粉' : cat === 'diaper' ? '纸尿裤' : cat === 'clothes' ? '衣物' : '其他'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                当前库存
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                单位
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="罐/包/件"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              警戒库存
            </label>
            <input
              type="number"
              value={warningLevel}
              onChange={(e) => setWarningLevel(e.target.value)}
              placeholder="低于此数量时提醒"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-300 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setShowAddModal(false)}>
              取消
            </Button>
            <Button fullWidth onClick={handleAddItem}>
              添加
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showShoppingList} onClose={() => setShowShoppingList(false)} title="购物清单">
        <div className="space-y-4">
          {shoppingList.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-6">
              太棒了！没有需要购买的物品 🎉
            </p>
          ) : (
            <>
              <div className="space-y-2">
                {shoppingList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-300"
                      />
                      <span className="text-gray-800 dark:text-white">{item.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      剩 {item.stock} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="secondary" fullWidth onClick={handleCopyShoppingList}>
                📋 复制清单
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
