import { NavLink } from 'react-router-dom';
import {
  Calendar,
  Milk,
  Moon,
  Package,
  BookOpen,
  Share2,
  BarChart3,
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { path: '/', label: '今日', icon: Calendar, end: true },
  { path: '/feeding', label: '喂养', icon: Milk },
  { path: '/sleep', label: '睡眠', icon: Moon },
  { path: '/supplies', label: '用品', icon: Package },
  { path: '/knowledge', label: '知识', icon: BookOpen },
  { path: '/share', label: '共享', icon: Share2 },
  { path: '/summary', label: '数据', icon: BarChart3 },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 glass border-t border-gray-200 dark:border-gray-700 z-40 md:hidden">
      <div className="flex items-center justify-around py-1.5 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 py-2 px-2 rounded-xl transition-all duration-200 min-w-0 flex-1',
                isActive
                  ? 'text-primary-500 dark:text-primary-400'
                  : 'text-gray-400 dark:text-gray-500'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium truncate">{item.label}</span>
          </NavLink>
        ))}
      </div>
      <div className="h-safe-bottom" />
    </nav>
  );
};
