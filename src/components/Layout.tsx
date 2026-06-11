import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-primary-50/50 dark:bg-gray-900 flex">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          <div className="max-w-5xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
};
