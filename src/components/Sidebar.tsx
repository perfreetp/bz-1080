import { NavLink } from 'react-router-dom';
import {
  Calendar,
  Milk,
  Moon,
  Package,
  BookOpen,
  Share2,
  BarChart3,
  Settings,
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { path: '/', label: '今日计划', icon: Calendar, end: true },
  { path: '/feeding', label: '喂养记录', icon: Milk },
  { path: '/sleep', label: '睡眠记录', icon: Moon },
  { path: '/supplies', label: '用品清单', icon: Package },
  { path: '/knowledge', label: '知识卡片', icon: BookOpen },
  { path: '/share', label: '家庭共享', icon: Share2 },
  { path: '/summary', label: '数据汇总', icon: BarChart3 },
  { path: '/settings', label: '设置', icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <aside
      className={cn(
        'w-60 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col py-6',
        className
      )}
    >
      <div className="px-6 mb-8">
        <h1 className="text-xl font-extrabold text-primary-500 dark:text-primary-400 flex items-center gap-2">
          <span className="text-2xl">👶</span>
          宝妈日记
        </h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          轻松育儿每一天
        </p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="bg-gradient-to-r from-primary-100 to-mint-100 dark:from-primary-900/30 dark:to-mint-900/30 rounded-xl p-4">
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            育儿小贴士
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            多抱抱宝宝，建立安全感 ❤️
          </p>
        </div>
      </div>
    </aside>
  );
};
