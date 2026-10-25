/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ToastUndo } from './components/common/ToastUndo';

// Screens
import { HomeView } from './components/home/HomeView';
import { DiaryView } from './components/diary/DiaryView';
import { PhotoScannerView } from './components/photo/PhotoScannerView';
import { PlansView } from './components/plans/PlansView';
import { WorkoutView } from './components/workout/WorkoutView';
import { HabitsView } from './components/habits/HabitsView';
import { ProgressView } from './components/progress/ProgressView';
import { AIAssistantView } from './components/ai/AIAssistantView';
import { ProfileView } from './components/profile/ProfileView';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { AuthView } from './components/auth/AuthView';
import { AdminView } from './components/admin/AdminView';

const MainLayout: React.FC = () => {
  const { activeScreen, deviceViewMode, theme, isLargeFont } = useApp();

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeView />;
      case 'diary':
        return <DiaryView />;
      case 'photo_scanner':
        return <PhotoScannerView />;
      case 'plans':
        return <PlansView />;
      case 'workout':
        return <WorkoutView />;
      case 'habits':
        return <HabitsView />;
      case 'progress':
        return <ProgressView />;
      case 'ai':
        return <AIAssistantView />;
      case 'profile':
        return <ProfileView />;
      case 'onboarding':
        return <OnboardingWizard />;
      case 'auth':
        return <AuthView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors ${
        theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#FBF9F5] text-slate-900'
      } ${isLargeFont ? 'text-[17px]' : 'text-[15px]'}`}
    >
      {/* If deviceViewMode is 'mobile_preview', render inside simulated smartphone chassis for laptop users */}
      {deviceViewMode === 'mobile_preview' ? (
        <div className="py-6 px-3 flex flex-col items-center justify-center min-h-screen bg-stone-200 dark:bg-slate-950">
          <div className="text-center mb-3 text-xs text-stone-600 dark:text-stone-400 font-medium">
            Mô phỏng màn hình điện thoại iPhone/Android · Chạm vào nút "Màn hình rộng" ở thanh trên để xem giao diện máy tính
          </div>

          <div className="relative w-full max-w-[420px] h-[850px] bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl border-[12px] border-slate-900 dark:border-slate-800 flex flex-col overflow-hidden">
            {/* Phone speaker notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 dark:bg-slate-800 rounded-full z-50 pointer-events-none" />

            {/* Inner App Container */}
            <div className="flex-1 flex flex-col overflow-hidden pt-2">
              <Header />
              <main className="flex-1 overflow-y-auto px-4 py-2">
                {renderScreen()}
              </main>
              {activeScreen !== 'onboarding' && <BottomNav />}
            </div>
          </div>
        </div>
      ) : (
        /* Full Desktop / Tablet Responsive Layout */
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
            {renderScreen()}
          </main>
          {/* Bottom navigation bar (visible on mobile screens or as fixed bar) */}
          {activeScreen !== 'onboarding' && (
            <div className="md:hidden">
              <BottomNav />
            </div>
          )}
        </div>
      )}

      {/* Global Toast with Undo support */}
      <ToastUndo />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
