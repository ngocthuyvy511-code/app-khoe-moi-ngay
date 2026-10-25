import React from 'react';
import { useApp, ScreenType } from '../../context/AppContext';
import { Home, Utensils, CalendarDays, TrendingUp, User } from 'lucide-react';

interface NavItem {
  id: ScreenType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Trang chủ', icon: Home },
  { id: 'diary', label: 'Nhật ký', icon: Utensils },
  { id: 'plans', label: 'Kế hoạch', icon: CalendarDays },
  { id: 'progress', label: 'Tiến trình', icon: TrendingUp },
  { id: 'profile', label: 'Cá nhân', icon: User },
];

export const BottomNav: React.FC = () => {
  const { activeScreen, setActiveScreen } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-stone-200/90 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeScreen === item.id ||
            (item.id === 'diary' && activeScreen === 'photo_scanner') ||
            (item.id === 'home' && (activeScreen === 'habits' || activeScreen === 'workout'));

          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className="flex flex-col items-center justify-center h-full min-h-[48px] py-1 text-center transition-colors focus:outline-none group"
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-transform ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 scale-105'
                    : 'text-stone-500 dark:text-slate-400 group-hover:text-stone-800 dark:group-hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[1.8]" />
              </div>
              <span
                className={`text-[11px] font-medium leading-tight mt-0.5 whitespace-nowrap ${
                  isActive
                    ? 'text-emerald-800 dark:text-emerald-300 font-semibold'
                    : 'text-stone-500 dark:text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
