import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Utensils,
  Droplets,
  Scale,
  Activity,
  Plus,
  Sparkles,
  CheckCircle2,
  Circle,
  Moon,
  ChevronRight,
  TrendingDown,
  ArrowUpRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { calculateBMR, calculateTDEE, calculateBMI, formatWeight, formatWater } from '../../utils/nutritionCalculations';
import { SafetyBanner } from '../common/SafetyBanner';

export const HomeView: React.FC = () => {
  const {
    currentUser,
    currentDate,
    setActiveScreen,
    todayMeals,
    todayWaterTotalMl,
    todaySleepEntry,
    todayWorkouts,
    todayCaloriesConsumed,
    todayCaloriesBurned,
    habits,
    toggleHabit,
    addWater,
    weights,
    updateProfile,
  } = useApp();

  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);

  // Time-based friendly greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Chào buổi sáng';
    if (hour < 14) return 'Chào buổi trưa';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  // Nutrition reference calculation
  const bmr = calculateBMR(currentUser.currentWeightKg, currentUser.heightCm, currentUser.age || 28, currentUser.biologicalSex);
  const tdee = calculateTDEE(bmr, currentUser.activityLevel);

  // Target calorie guidance (gentle reference, not rigid diet)
  let targetCaloriesRef = tdee;
  if (!currentUser.isGentleHabitsMode && currentUser.primaryGoal === 'manage_weight') {
    targetCaloriesRef = Math.max(1400, tdee - 300); // Gentle 300 kcal deficit, never below 1400
  }

  const calorieRemaining = Math.max(0, targetCaloriesRef - todayCaloriesConsumed);
  const caloriePercent = Math.min(100, Math.round((todayCaloriesConsumed / targetCaloriesRef) * 100));

  // Water progress
  const waterTarget = currentUser.dailyWaterTargetMl || 2000;
  const waterPercent = Math.min(100, Math.round((todayWaterTotalMl / waterTarget) * 100));

  // BMI status
  const bmiInfo = calculateBMI(currentUser.currentWeightKg, currentUser.heightCm);

  // Macro sums
  const totalProtein = todayMeals.reduce((s, m) => s + (m.protein || 0), 0);
  const totalCarbs = todayMeals.reduce((s, m) => s + (m.carbs || 0), 0);
  const totalFat = todayMeals.reduce((s, m) => s + (m.fat || 0), 0);

  // Next action suggestion
  const getNextAction = () => {
    if (todayWaterTotalMl < 1000) {
      return {
        title: 'Bù nước cho cơ thể',
        desc: 'Bạn đã ghi nhận ' + todayWaterTotalMl + 'ml. Hãy thưởng thức một ly nước mát hoặc nước dừa tươi để tinh thần tỉnh táo.',
        actionLabel: 'Thêm 250ml nước',
        onClick: () => addWater(250),
      };
    }
    if (todayMeals.length < 2) {
      return {
        title: 'Ghi nhận bữa ăn ngon miệng',
        desc: 'Chưa có đủ các bữa ăn chính trong ngày. Hãy lưu lại bữa ăn để theo dõi sự cân bằng dinh dưỡng.',
        actionLabel: 'Ghi bữa ăn',
        onClick: () => setActiveScreen('diary'),
      };
    }
    if (todayWorkouts.length === 0) {
      return {
        title: 'Thư giãn cơ thể 15 phút',
        desc: 'Một buổi đi bộ thong thả hoặc vài động tác yoga giãn cơ sẽ giúp máu lưu thông tốt và giấc ngủ êm dịu.',
        actionLabel: 'Xem bài tập gợi ý',
        onClick: () => setActiveScreen('workout'),
      };
    }
    return {
      title: 'Bạn đang duy trì nhịp sống rất tốt!',
      desc: 'Hãy duy trì sự kiên nhẫn nhẹ nhàng này và chuẩn bị một giấc ngủ thật ngon đêm nay.',
      actionLabel: 'Nhật ký thói quen',
      onClick: () => setActiveScreen('habits'),
    };
  };

  const nextAction = getNextAction();

  return (
    <div className="space-y-6 pb-20 pt-2">
      <SafetyBanner />

      {/* Greeting & Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-200 text-xs sm:text-sm font-medium mb-1">
            <span>{getGreeting()}</span>
            <span>·</span>
            <span>{currentUser.displayName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 text-balance">
            Mỗi ngày một bước nhỏ, sức khỏe bền lâu.
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-4">
            Quản lý cân nặng tích cực, nuôi dưỡng cơ thể với ẩm thực Việt hài hòa và lắng nghe nhu cầu tự nhiên của bạn.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-white/90">
            <span className="bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full font-medium">
              Mục tiêu: {currentUser.primaryGoal === 'manage_weight' ? 'Quản lý cân nặng bền vững' : currentUser.primaryGoal === 'maintain_weight' ? 'Duy trì cân nặng' : 'Xây dựng thói quen'}
            </span>
            {currentUser.enableWeightDisplay && (
              <span className="bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full font-medium tabular-nums">
                Cân nặng: {formatWeight(currentUser.currentWeightKg, currentUser.preferredWeightUnit)}
              </span>
            )}
          </div>
        </div>

        {/* Decorative subtle background image overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
          <img
            src="/src/assets/images/hero_vietnamese_healthy_food_1792918362125.jpg"
            alt="Món ăn lành mạnh"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 4 Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveScreen('diary')}
          className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-stone-200/80 dark:border-slate-700 shadow-sm hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-stone-500 dark:text-slate-400 block font-normal">Thực đơn</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 block">Thêm bữa ăn</span>
          </div>
        </button>

        <button
          onClick={() => setIsWaterModalOpen(true)}
          className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-stone-200/80 dark:border-slate-700 shadow-sm hover:border-sky-500 dark:hover:border-sky-500 hover:shadow transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-stone-500 dark:text-slate-400 block font-normal">Nước uống</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 block">Thêm nước</span>
          </div>
        </button>

        <button
          onClick={() => setActiveScreen('progress')}
          className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-stone-200/80 dark:border-slate-700 shadow-sm hover:border-amber-500 dark:hover:border-amber-500 hover:shadow transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-stone-500 dark:text-slate-400 block font-normal">Tiến trình</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 block">Ghi cân nặng</span>
          </div>
        </button>

        <button
          onClick={() => setActiveScreen('workout')}
          className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-stone-200/80 dark:border-slate-700 shadow-sm hover:border-orange-500 dark:hover:border-orange-500 hover:shadow transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-stone-500 dark:text-slate-400 block font-normal">Thể lực</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 block">Thêm vận động</span>
          </div>
        </button>
      </div>

      {/* Main 2-column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Nutrition & Meals summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Nutrition Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-stone-200/80 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-slate-700/80">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Dinh dưỡng hôm nay
                </h2>
                <p className="text-xs text-stone-500 dark:text-slate-400">
                  {currentUser.enableCaloriesDisplay ? 'Ước tính calo và các chất dinh dưỡng đa lượng' : 'Chế độ tập trung vào thói quen ăn uống lành mạnh'}
                </p>
              </div>

              {/* Toggle Calorie Visibility */}
              <button
                onClick={() => updateProfile({ enableCaloriesDisplay: !currentUser.enableCaloriesDisplay })}
                className="text-xs flex items-center gap-1.5 text-stone-500 hover:text-emerald-600 transition-colors px-2 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-700"
                title={currentUser.enableCaloriesDisplay ? 'Ẩn calo (chuyển sang chế độ thói quen)' : 'Hiện calo tham khảo'}
              >
                {currentUser.enableCaloriesDisplay ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Ẩn calo</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Hiện calo</span>
                  </>
                )}
              </button>
            </div>

            {currentUser.enableCaloriesDisplay ? (
              <div className="mt-5 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-xs text-stone-500 dark:text-slate-400 block mb-1">Năng lượng đã nạp</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                        {todayCaloriesConsumed}
                      </span>
                      <span className="text-xs text-stone-500 dark:text-slate-400 font-medium">
                        / ~{targetCaloriesRef} kcal tham khảo
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-stone-500 dark:text-slate-400 block mb-1">Khoảng tham khảo còn lại</span>
                    <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      ~{calorieRemaining} kcal
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${caloriePercent}%` }}
                  />
                </div>

                {/* Macro breakdown */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-stone-50 dark:bg-slate-800/80 rounded-2xl border border-stone-100 dark:border-slate-700 text-center">
                    <span className="text-xs text-stone-500 dark:text-slate-400 block">Đạm (Protein)</span>
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {totalProtein.toFixed(0)}g
                    </span>
                  </div>
                  <div className="p-3 bg-stone-50 dark:bg-slate-800/80 rounded-2xl border border-stone-100 dark:border-slate-700 text-center">
                    <span className="text-xs text-stone-500 dark:text-slate-400 block">Tinh bột (Carbs)</span>
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {totalCarbs.toFixed(0)}g
                    </span>
                  </div>
                  <div className="p-3 bg-stone-50 dark:bg-slate-800/80 rounded-2xl border border-stone-100 dark:border-slate-700 text-center">
                    <span className="text-xs text-stone-500 dark:text-slate-400 block">Chất béo (Fat)</span>
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {totalFat.toFixed(0)}g
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-stone-600 dark:text-slate-300">
                <p className="text-sm font-medium">Chế độ Thói quen lành mạnh đang bật</p>
                <p className="text-xs text-stone-400 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Bạn đang tập trung vào chất lượng món ăn tươi ngon, rau xanh và cảm giác no tự nhiên thay vì đếm từng calo.
                </p>
              </div>
            )}
          </div>

          {/* Today Meals List Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-stone-200/80 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-slate-700/80">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Bữa ăn đã ghi hôm nay ({todayMeals.length})
              </h2>
              <button
                onClick={() => setActiveScreen('diary')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
              >
                <span>Xem chi tiết</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayMeals.length === 0 ? (
              <div className="py-8 text-center">
                <Utensils className="w-8 h-8 text-stone-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400">
                  Chưa có bữa ăn nào được ghi lại hôm nay.
                </p>
                <button
                  onClick={() => setActiveScreen('diary')}
                  className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl transition-colors"
                >
                  Thêm món ngay
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-100 dark:divide-slate-700/60 mt-2">
                {todayMeals.map((meal) => (
                  <div key={meal.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                          {meal.mealType === 'breakfast'
                            ? 'Sáng'
                            : meal.mealType === 'lunch'
                            ? 'Trưa'
                            : meal.mealType === 'dinner'
                            ? 'Tối'
                            : 'Phụ'}
                        </span>
                        <span className="text-stone-300 dark:text-slate-600">·</span>
                        <span className="text-xs text-stone-400 dark:text-slate-400 tabular-nums">{meal.time}</span>
                      </div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate mt-0.5">
                        {meal.foodName}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-slate-400">
                        {meal.portionLabel} {meal.notes && `· ${meal.notes}`}
                      </p>
                    </div>

                    {currentUser.enableCaloriesDisplay && (
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums shrink-0">
                        {meal.calories} kcal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 span): Water, Sleep, Habits, Next action */}
        <div className="space-y-6">
          {/* Next Best Action Suggestion */}
          <div className="bg-amber-50/70 dark:bg-amber-950/40 rounded-3xl p-5 border border-amber-200/80 dark:border-amber-800/60">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Gợi ý cho bạn</span>
            </div>
            <h3 className="text-sm font-bold text-amber-950 dark:text-amber-100 mb-1">{nextAction.title}</h3>
            <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed mb-3">
              {nextAction.desc}
            </p>
            <button
              onClick={nextAction.onClick}
              className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{nextAction.actionLabel}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hydration Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-stone-200/80 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Nước uống</h3>
              </div>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                {waterPercent}%
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {formatWater(todayWaterTotalMl, currentUser.preferredWaterUnit)}
              </span>
              <span className="text-xs text-stone-500 dark:text-slate-400 tabular-nums">
                Mục tiêu: {formatWater(waterTarget, currentUser.preferredWaterUnit)}
              </span>
            </div>

            <div className="w-full bg-stone-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden mb-3">
              <div className="bg-sky-500 h-2 rounded-full transition-all duration-300" style={{ width: `${waterPercent}%` }} />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => addWater(150)}
                className="flex-1 py-1.5 text-xs font-medium bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 rounded-xl hover:bg-sky-100 transition-colors"
              >
                +150ml
              </button>
              <button
                onClick={() => addWater(250)}
                className="flex-1 py-1.5 text-xs font-medium bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 rounded-xl hover:bg-sky-100 transition-colors"
              >
                +250ml
              </button>
              <button
                onClick={() => addWater(500)}
                className="flex-1 py-1.5 text-xs font-medium bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 rounded-xl hover:bg-sky-100 transition-colors"
              >
                +500ml
              </button>
            </div>
          </div>

          {/* Sleep & Wellbeing */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-stone-200/80 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Giấc ngủ đêm qua</h3>
              </div>
              <button
                onClick={() => setActiveScreen('habits')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                {todaySleepEntry ? 'Sửa' : 'Ghi nhận'}
              </button>
            </div>

            {todaySleepEntry ? (
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                    {todaySleepEntry.durationHours} giờ
                  </span>
                  <span className="text-xs text-stone-500 dark:text-slate-400">
                    ({todaySleepEntry.bedTime} → {todaySleepEntry.wakeTime})
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-slate-300">
                  Cảm nhận: {todaySleepEntry.quality === 'great' ? 'Rất sảng khoái' : todaySleepEntry.quality === 'good' ? 'Tốt, êm ái' : todaySleepEntry.quality === 'fair' ? 'Bình thường' : 'Hơi mệt'}
                </p>
              </div>
            ) : (
              <p className="text-xs text-stone-500 dark:text-slate-400">
                Chưa ghi nhận giấc ngủ đêm qua. Ngủ đủ 7-8 tiếng là nền tảng phục hồi chuyển hóa tự nhiên.
              </p>
            )}
          </div>

          {/* Daily Habits Checklist */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-stone-200/80 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Thói quen hôm nay</h3>
              <button
                onClick={() => setActiveScreen('habits')}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
              >
                Quản lý
              </button>
            </div>

            <div className="space-y-2">
              {habits.slice(0, 4).map((h) => {
                const isCompleted = h.completedDates.includes(currentDate);
                return (
                  <button
                    key={h.id}
                    onClick={() => toggleHabit(h.id, currentDate)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 dark:hover:bg-slate-750 text-left transition-colors"
                  >
                    <span className={`text-xs font-medium ${isCompleted ? 'line-through text-stone-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                      {h.title}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-stone-300 dark:text-slate-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Water Modal */}
      {isWaterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sky-500" />
              <span>Ghi nhận nước uống</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Chọn dung tích ly hoặc bình bạn vừa dùng:
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Tách trà nhỏ', ml: 150 },
                { label: 'Ly nước tiêu chuẩn', ml: 250 },
                { label: 'Cốc lớn / Nước dừa', ml: 350 },
                { label: 'Bình nước cá nhân', ml: 500 },
              ].map((opt) => (
                <button
                  key={opt.ml}
                  onClick={() => {
                    addWater(opt.ml);
                    setIsWaterModalOpen(false);
                  }}
                  className="p-3 bg-stone-50 dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 hover:border-sky-500 text-left transition-all"
                >
                  <span className="text-xs text-stone-500 dark:text-slate-400 block">{opt.label}</span>
                  <span className="text-sm font-bold text-sky-600 dark:text-sky-400">+{opt.ml}ml</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsWaterModalOpen(false)}
              className="w-full py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
