import { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight, Baby, Star } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Tabs } from '../components/Tabs';
import { useUISettingsStore } from '../store/useUISettingsStore';
import { useBabyStore } from '../store/useBabyStore';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { knowledgeCards, getCardsByMonth } from '../data/knowledgeCards';
import { calculateAgeInMonths, formatAge } from '../utils/date';
import { cn } from '../lib/utils';
import { KnowledgeCard } from '../types';

const categoryTabs = [
  { id: 'all', label: '全部', icon: '📚' },
  { id: 'feeding', label: '喂养', icon: '🍼' },
  { id: 'sleep', label: '睡眠', icon: '😴' },
  { id: 'care', label: '护理', icon: '🛁' },
  { id: 'development', label: '发育', icon: '🌟' },
];

export const Knowledge = () => {
  const { currentBabyId } = useUISettingsStore();
  const { getBaby } = useBabyStore();
  const { favorites, addFavorite, removeFavorite, isFavorite, getFavoritesByBaby } = useFavoriteStore();

  const [activeCategory, setActiveCategory] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const currentBaby = currentBabyId ? getBaby(currentBabyId) : undefined;
  const babyAgeMonths = currentBaby ? calculateAgeInMonths(currentBaby.birthday) : 0;
  const displayMonth = selectedMonth !== null ? selectedMonth : babyAgeMonths;

  let cards: KnowledgeCard[];
  if (showFavorites) {
    const favCardIds = currentBabyId
      ? getFavoritesByBaby(currentBabyId).map(f => f.cardId)
      : [];
    cards = knowledgeCards.filter(c => favCardIds.includes(c.id));
  } else {
    cards = getCardsByMonth(displayMonth);
  }

  if (activeCategory !== 'all') {
    cards = cards.filter(c => c.category === activeCategory);
  }

  const currentCard = cards[currentCardIndex];

  const handleToggleFavorite = (cardId: string) => {
    if (!currentBabyId) return;
    if (isFavorite(currentBabyId, cardId)) {
      removeFavorite(currentBabyId, cardId);
    } else {
      addFavorite(currentBabyId, cardId);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feeding': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300';
      case 'sleep': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300';
      case 'care': return 'bg-mint-100 dark:bg-mint-900/30 text-mint-600 dark:text-mint-300';
      case 'development': return 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'feeding': return '喂养';
      case 'sleep': return '睡眠';
      case 'care': return '护理';
      case 'development': return '发育';
      default: return '其他';
    }
  };

  const monthOptions = [];
  for (let i = 0; i <= 36; i += 3) {
    monthOptions.push(i);
  }

  if (!currentBaby) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white">
          知识卡片
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
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white">
            知识卡片
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {showFavorites ? '我的收藏' : `${displayMonth}月龄 · 共${cards.length}张`}
          </p>
        </div>
        <Button
          variant={showFavorites ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => {
            setShowFavorites(!showFavorites);
            setCurrentCardIndex(0);
          }}
        >
          <Heart className={cn('w-4 h-4', showFavorites && 'fill-current')} />
          收藏
        </Button>
      </div>

      {!showFavorites && (
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">选择月龄查看对应知识</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {monthOptions.map((month) => (
              <button
                key={month}
                onClick={() => {
                  setSelectedMonth(month);
                  setCurrentCardIndex(0);
                }}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all',
                  displayMonth === month
                    ? 'bg-primary-400 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                {month}个月
              </button>
            ))}
          </div>
        </Card>
      )}

      <Tabs
        tabs={categoryTabs.map(t => ({ id: t.id, label: t.label, icon: <span>{t.icon}</span> }))}
        activeTab={activeCategory}
        onChange={(id) => {
          setActiveCategory(id);
          setCurrentCardIndex(0);
        }}
      />

      {cards.length === 0 ? (
        <Card className="text-center py-12">
          <Star className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            {showFavorites ? '还没有收藏的卡片' : '这个月龄暂无相关知识'}
          </p>
        </Card>
      ) : (
        <div className="relative">
          <Card className="min-h-[300px] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-300 to-mint-300" />

            <div className="flex items-center justify-between mb-4">
              <span className={cn(
                'text-xs font-medium px-3 py-1 rounded-full',
                getCategoryColor(currentCard.category)
              )}>
                {getCategoryLabel(currentCard.category)}
              </span>
              <button
                onClick={() => handleToggleFavorite(currentCard.id)}
                className={cn(
                  'p-2 rounded-full transition-all',
                  isFavorite(currentBabyId!, currentCard.id)
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/30'
                    : 'text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30'
                )}
              >
                <Heart className={cn(
                  'w-5 h-5 transition-all',
                  isFavorite(currentBabyId!, currentCard.id) && 'fill-current'
                )} />
              </button>
            </div>

            <h3 className="text-xl font-extrabold text-gray-800 dark:text-white mb-4">
              {currentCard.title}
            </h3>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
              {currentCard.content}
            </p>

            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
              <button
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                className={cn(
                  'p-2 rounded-full transition-all',
                  currentCardIndex === 0
                    ? 'opacity-30 cursor-not-allowed'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

              <div className="flex gap-1.5">
                {cards.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      index === currentCardIndex
                        ? 'bg-primary-400 w-6'
                        : 'bg-gray-200 dark:bg-gray-600'
                    )}
                  />
                ))}
              </div>

              <button
                onClick={nextCard}
                disabled={currentCardIndex === cards.length - 1}
                className={cn(
                  'p-2 rounded-full transition-all',
                  currentCardIndex === cards.length - 1
                    ? 'opacity-30 cursor-not-allowed'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </Card>
        </div>
      )}

      {!showFavorites && (
        <Card>
          <h3 className="font-bold text-gray-800 dark:text-white mb-3">全部卡片</h3>
          <div className="grid gap-2 max-h-60 overflow-y-auto scrollbar-hide">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => setCurrentCardIndex(index)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl text-left transition-all',
                  currentCardIndex === index
                    ? 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-200 dark:border-primary-700'
                    : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <span className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                  getCategoryColor(card.category)
                )}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {card.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {card.monthMin}-{card.monthMax}月龄
                  </p>
                </div>
                {isFavorite(currentBabyId!, card.id) && (
                  <Heart className="w-4 h-4 text-red-500 fill-current flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
