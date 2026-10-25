import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HabitItem, SleepLogEntry } from '../../types';
import {
  Droplets,
  Moon,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  RotateCcw,
  Smile,
  Meh,
  Frown,
  Heart
} from 'lucide-react';
import { calculateSleepDuration, formatWater } from '../../utils/nutritionCalculations';
import { getRelativeDateString } from '../../data/initialDemoData';

export const HabitsView: React.FC = () => {
  const {
    currentDate,
    water,
    todayWaterTotalMl,
    addWater,
    deleteWater,
    resetDayWater,
    sleep,
    todaySleepEntry,
    logSleep,
    habits,
    toggleHabit,
    addHabit,
    deleteHabit,
    currentUser,
    updateProfile,
  } = useApp();

  // Sleep form
  const [bedTime, setBedTime] = useState(todaySleepEntry?.bedTime || '23:00');
  const [wakeTime, setWakeTime] = useState(todaySleepEntry?.wakeTime || '06:30');
  const [quality, setQuality] = useState<SleepLogEntry['quality']>(todaySleepEntry?.quality || 'good');
  const [sleepNotes, setSleepNotes] = useState(todaySleepEntry?.notes || '');

  // Water target editing
  const [isEditingWaterTarget, setIsEditingWaterTarget] = useState(false);
  const [customWaterTarget, setCustomWaterTarget] = useState(currentUser.dailyWaterTargetMl || 2000);

  // New habit form
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<HabitItem['category']>('nutrition');

  const todayWaterEntries = water.filter((w) => w.date === currentDate);
  const waterTarget = currentUser.dailyWaterTargetMl || 2000;
  const waterPercent = Math.min(100, Math.round((todayWaterTotalMl / waterTarget) * 100));

  const calculatedHours = calculateSleepDuration(bedTime, wakeTime);

  const handleSaveSleep = (e: React.FormEvent) => {
    e.preventDefault();
    logSleep({
      date: currentDate,
      bedTime,
      wakeTime,
      durationHours: calculatedHours,
      quality,
      notes: sleepNotes,
    });
  };

  const handleSaveWaterTarget = () => {
    updateProfile({ dailyWaterTargetMl: Number(customWaterTarget) || 2000 });
    setIsEditingWaterTarget(false);
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    addHabit(newHabitTitle.trim(), newHabitCategory, 'Sparkles');
    setNewHabitTitle('');
    setIsNewHabitModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>Nước uống, Giấc ngủ & Thói quen</span>
        </h1>
        <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
          Những thói quen bền bỉ mỗi ngày tạo nên nền tảng chuyển hóa khỏe mạnh lâu dài
        </p>
      </div>

      {/* 1. Hydration Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 flex items-center justify-center font-bold">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Nước uống hôm nay
              </h2>
              <span className="text-[11px] text-stone-500 dark:text-slate-400">
                Lắng nghe cơn khát tự nhiên, bổ sung từng ngụm nhỏ
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditingWaterTarget(!isEditingWaterTarget)}
            className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
          >
            {isEditingWaterTarget ? 'Hủy' : 'Đổi mục tiêu'}
          </button>
        </div>

        {isEditingWaterTarget && (
          <div className="p-4 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border border-sky-200 dark:border-sky-800 flex items-center gap-3 text-xs">
            <span className="font-medium text-sky-900 dark:text-sky-200">Mục tiêu cá nhân:</span>
            <input
              type="number"
              step="100"
              value={customWaterTarget}
              onChange={(e) => setCustomWaterTarget(Number(e.target.value))}
              className="w-24 px-2 py-1 bg-white dark:bg-slate-800 rounded-lg border border-sky-300 dark:border-sky-700 font-bold tabular-nums"
            />
            <span className="text-sky-800 dark:text-sky-300">ml/ngày</span>
            <button
              onClick={handleSaveWaterTarget}
              className="px-3 py-1 bg-sky-600 text-white rounded-lg font-bold hover:bg-sky-500 transition-colors"
            >
              Lưu
            </button>
          </div>
        )}

        {/* Progress & Quick Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                {formatWater(todayWaterTotalMl, currentUser.preferredWaterUnit)}
              </span>
              <span className="text-xs text-stone-500 dark:text-slate-400 tabular-nums">
                / {formatWater(waterTarget, currentUser.preferredWaterUnit)} ({waterPercent}%)
              </span>
            </div>
          </div>

          {/* Quick add buttons */}
          <div className="flex items-center gap-2">
            {[
              { label: '+150ml (Tách)', ml: 150 },
              { label: '+250ml (Ly)', ml: 250 },
              { label: '+350ml (Cốc)', ml: 350 },
              { label: '+500ml (Bình)', ml: 500 },
            ].map((b) => (
              <button
                key={b.ml}
                onClick={() => addWater(b.ml)}
                className="px-3 py-2 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 hover:bg-sky-100 rounded-xl text-xs font-semibold transition-colors"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Water Log Entries History for today */}
        {todayWaterEntries.length > 0 && (
          <div className="pt-3 border-t border-stone-100 dark:border-slate-700">
            <span className="text-xs font-semibold text-stone-500 dark:text-slate-400 block mb-2">
              Các lần uống hôm nay:
            </span>
            <div className="flex flex-wrap gap-2">
              {todayWaterEntries.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-50 dark:bg-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700"
                >
                  <span className="font-semibold text-sky-600 dark:text-sky-400 tabular-nums">
                    +{w.amountMl}ml
                  </span>
                  <span className="text-stone-400 dark:text-slate-500 tabular-nums">({w.time})</span>
                  <button
                    onClick={() => deleteWater(w.id)}
                    className="text-stone-400 hover:text-rose-500 p-0.5"
                    title="Xóa"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Sleep Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 flex items-center justify-center font-bold">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Giấc ngủ qua đêm
              </h2>
              <span className="text-[11px] text-stone-500 dark:text-slate-400">
                Hỗ trợ giấc ngủ qua nửa đêm, tự đánh giá chất lượng phục hồi
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveSleep} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-stone-600 dark:text-slate-400 block font-semibold mb-1">
                Giờ lên giường ngủ:
              </label>
              <input
                type="time"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-sm font-semibold tabular-nums"
              />
            </div>

            <div>
              <label className="text-stone-600 dark:text-slate-400 block font-semibold mb-1">
                Giờ thức dậy sáng:
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-sm font-semibold tabular-nums"
              />
            </div>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-slate-800/80 rounded-2xl flex items-center justify-between text-xs">
            <span className="text-stone-600 dark:text-slate-300">
              Thời gian ngủ tính toán chính xác:
            </span>
            <span className="text-base font-bold text-indigo-700 dark:text-indigo-400 tabular-nums">
              {calculatedHours} giờ
            </span>
          </div>

          {/* Quality buttons */}
          <div>
            <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-2">
              Cảm nhận sau khi thức dậy:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'great', label: 'Rất sảng khoái' },
                { id: 'good', label: 'Tốt, êm ái' },
                { id: 'fair', label: 'Bình thường' },
                { id: 'tired', label: 'Hơi mệt mỏi' },
              ].map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setQuality(q.id as any)}
                  className={`py-2 px-2 text-xs font-medium rounded-xl border transition-colors ${
                    quality === q.id
                      ? 'bg-indigo-600 border-indigo-600 text-white font-bold'
                      : 'bg-stone-50 dark:bg-slate-800 text-stone-600 dark:text-slate-300 border-stone-200 dark:border-slate-700'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
              Ghi chú thêm (tuỳ chọn):
            </label>
            <input
              type="text"
              placeholder="Phòng thoáng mát, không dùng điện thoại..."
              value={sleepNotes}
              onChange={(e) => setSleepNotes(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            Lưu nhật ký giấc ngủ
          </button>
        </form>
      </div>

      {/* 3. Daily Habits Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-slate-700">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Thói quen lối sống tích cực
            </h2>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Có thể tạm dừng và tiếp tục linh hoạt mà không gây cảm giác tội lỗi
            </p>
          </div>

          <button
            onClick={() => setIsNewHabitModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 rounded-xl text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm thói quen</span>
          </button>
        </div>

        <div className="divide-y divide-stone-100 dark:divide-slate-700/60">
          {habits.map((habit) => {
            const isCompleted = habit.completedDates.includes(currentDate);

            return (
              <div
                key={habit.id}
                className="py-3 flex items-center justify-between gap-3 group"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => toggleHabit(habit.id, currentDate)}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 dark:border-slate-600'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div>
                    <span
                      className={`text-sm font-medium block ${
                        isCompleted
                          ? 'line-through text-stone-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {habit.title}
                    </span>
                    <span className="text-[11px] text-stone-400 dark:text-slate-500">
                      {habit.categoryLabel} · Đã duy trì {habit.completedDates.length} ngày
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                  title="Xóa thói quen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Habit Modal */}
      {isNewHabitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateHabit}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 dark:border-slate-800 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tạo thói quen mới
            </h3>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Tên thói quen:
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Ăn chậm nhai kỹ, ngồi thẳng lưng..."
                value={newHabitTitle}
                onChange={(e) => setNewHabitTitle(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Nhóm thói quen:
              </label>
              <select
                value={newHabitCategory}
                onChange={(e) => setNewHabitCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-xs"
              >
                <option value="nutrition">Dinh dưỡng & Bữa ăn</option>
                <option value="movement">Vận động & Thể chất</option>
                <option value="hydration">Nước uống & Bù nước</option>
                <option value="sleep">Giấc ngủ & Thư giãn</option>
                <option value="mindfulness">Tâm trí & Cảm xúc</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewHabitModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold text-stone-600 dark:text-slate-400 bg-stone-100 dark:bg-slate-800 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors"
              >
                Thêm thói quen
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
