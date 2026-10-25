import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Laptop,
  Sparkles,
  Moon,
  Sun,
  User,
  LogIn
} from 'lucide-react';
import { getRelativeDateString } from '../../data/initialDemoData';

export const Header: React.FC = () => {
  const {
    currentUser,
    firebaseUser,
    currentDate,
    setCurrentDate,
    activeScreen,
    setActiveScreen,
    deviceViewMode,
    setDeviceViewMode,
    theme,
    setTheme,
  } = useApp();

  const handleDateShift = (days: number) => {
    const current = new Date(currentDate);
    current.setDate(current.getDate() + days);
    setCurrentDate(current.toISOString().split('T')[0]);
  };

  const isToday = currentDate === getRelativeDateString(0);

  // Format date in Vietnamese
  const formatDateVietnamese = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayName = dayNames[dateObj.getDay()];
    return `${dayName}, ${day}/${month}/${year}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveScreen(currentUser ? 'home' : 'auth')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
              KM
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white block leading-tight">
                Khỏe Mỗi Ngày
              </span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-medium">
                {currentUser ? 'Firebase Đã liên kết Google' : 'Đăng nhập để đồng bộ'}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Date Selector (center, single-line) */}
        {currentUser && (
          <div className="flex items-center gap-1.5 sm:gap-2 bg-stone-100 dark:bg-slate-800/80 rounded-xl px-2 py-1">
            <button
              onClick={() => handleDateShift(-1)}
              title="Ngày trước"
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentDate(getRelativeDateString(0))}
              className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span className="tabular-nums">
                {isToday ? `Hôm nay · ${formatDateVietnamese(currentDate)}` : formatDateVietnamese(currentDate)}
              </span>
            </button>

            <button
              onClick={() => handleDateShift(1)}
              title="Ngày tiếp theo"
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Zone 3: Actions & Quick Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {currentUser && (
            <button
              onClick={() => setActiveScreen('ai')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeScreen === 'ai'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100'
              }`}
              title="Trợ lý Sống Khỏe AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Trợ lý AI</span>
            </button>
          )}

          {/* View mode toggle: Laptop/Desktop vs Phone Preview */}
          <button
            onClick={() => setDeviceViewMode(deviceViewMode === 'responsive' ? 'mobile_preview' : 'responsive')}
            title={deviceViewMode === 'responsive' ? 'Chuyển sang khung xem Điện thoại' : 'Chuyển sang xem Toàn màn hình Máy tính'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-medium"
          >
            {deviceViewMode === 'responsive' ? (
              <>
                <Smartphone className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                <span className="hidden md:inline text-[11px] text-stone-500">Khung di động</span>
              </>
            ) : (
              <>
                <Laptop className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline text-[11px] text-emerald-600 font-semibold">Màn hình rộng</span>
              </>
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title="Chuyển chế độ sáng / tối"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* User profile / Login trigger */}
          {currentUser ? (
            <button
              onClick={() => setActiveScreen('profile')}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
              title="Xem hồ sơ cá nhân"
            >
              {firebaseUser?.photoURL ? (
                <img
                  src={firebaseUser.photoURL}
                  alt={currentUser.displayName}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 flex items-center justify-center font-bold text-xs">
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <span className="hidden lg:inline text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                {currentUser.displayName}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setActiveScreen('auth')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
