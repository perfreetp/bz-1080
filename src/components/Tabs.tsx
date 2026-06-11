import { cn } from '../lib/utils';

interface TabProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs = ({ tabs, activeTab, onChange, className }: TabProps) => {
  return (
    <div className={cn('flex bg-gray-100 dark:bg-gray-700 rounded-full p-1', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200',
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-600 text-primary-500 dark:text-primary-300 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};
