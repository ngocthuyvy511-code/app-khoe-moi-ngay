import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MealType, FoodItem, MealLogEntry } from '../../types';
import {
  Utensils,
  Plus,
  Camera,
  Search,
  Trash2,
  Copy,
  ChevronRight,
  Sparkles,
  Info,
  Clock,
  Flame,
  Check,
  X,
  PlusCircle
} from 'lucide-react';
import { removeVietnameseAccents } from '../../utils/nutritionCalculations';
import { getRelativeDateString } from '../../data/initialDemoData';

const MEAL_SECTIONS: { type: MealType; title: string; subtitle: string; iconBg: string }[] = [
  { type: 'breakfast', title: 'Bữa sáng', subtitle: 'Khởi đầu ngày mới thanh nhẹ', iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' },
  { type: 'lunch', title: 'Bữa trưa', subtitle: 'Nạp năng lượng và cân bằng dinh dưỡng', iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' },
  { type: 'dinner', title: 'Bữa tối', subtitle: 'Bữa cơm đầm ấm, dễ tiêu hóa', iconBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' },
  { type: 'snack', title: 'Bữa phụ / Tráng miệng', subtitle: 'Trái cây, hạt dinh dưỡng hoặc nước dừa', iconBg: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' },
];

export const DiaryView: React.FC = () => {
  const {
    currentDate,
    todayMeals,
    addMeal,
    deleteMeal,
    copyMealsToDate,
    foodCatalog,
    addCustomFood,
    currentUser,
    setActiveScreen,
  } = useApp();

  // Search & add meal modal state
  const [activeAddMealType, setActiveAddMealType] = useState<MealType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isCustomFoodModalOpen, setIsCustomFoodModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  // Selected food detail for adding
  const [selectedFoodForAdd, setSelectedFoodForAdd] = useState<FoodItem | null>(null);
  const [portionMultiplier, setPortionMultiplier] = useState<number>(1);
  const [mealNotes, setMealNotes] = useState<string>('');
  const [mealTime, setMealTime] = useState<string>(() => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  });

  // Custom food form state
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState<number | ''>('');
  const [customProtein, setCustomProtein] = useState<number | ''>('');
  const [customCarbs, setCustomCarbs] = useState<number | ''>('');
  const [customFat, setCustomFat] = useState<number | ''>('');
  const [customFiber, setCustomFiber] = useState<number | ''>('');
  const [customServing, setCustomServing] = useState('1 phần vừa');

  // Filter food catalog with accent-insensitive search
  const filteredFoods = useMemo(() => {
    const normalizedQuery = removeVietnameseAccents(searchQuery);
    return foodCatalog.filter((item) => {
      const matchQuery =
        !normalizedQuery ||
        removeVietnameseAccents(item.name).includes(normalizedQuery) ||
        removeVietnameseAccents(item.categoryLabel).includes(normalizedQuery);
      const matchCategory =
        selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
      return matchQuery && matchCategory;
    });
  }, [foodCatalog, searchQuery, selectedCategoryFilter]);

  const handleOpenAddModal = (mealType: MealType) => {
    setActiveAddMealType(mealType);
    setSelectedFoodForAdd(null);
    setSearchQuery('');
    setPortionMultiplier(1);
    setMealNotes('');
    const d = new Date();
    setMealTime(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
  };

  const handleConfirmAddMeal = () => {
    if (!selectedFoodForAdd || !activeAddMealType) return;

    const baseCal = selectedFoodForAdd.calories;
    const basePro = selectedFoodForAdd.protein;
    const baseCarb = selectedFoodForAdd.carbs;
    const baseFat = selectedFoodForAdd.fat;
    const baseFib = selectedFoodForAdd.fiber || 0;

    addMeal({
      date: currentDate,
      mealType: activeAddMealType,
      foodId: selectedFoodForAdd.id,
      foodName: selectedFoodForAdd.name,
      portionMultiplier,
      portionLabel:
        portionMultiplier === 1
          ? selectedFoodForAdd.servingSize
          : `${portionMultiplier}x (${selectedFoodForAdd.servingSize})`,
      calories: Math.round(baseCal * portionMultiplier),
      protein: Number((basePro * portionMultiplier).toFixed(1)),
      carbs: Number((baseCarb * portionMultiplier).toFixed(1)),
      fat: Number((baseFat * portionMultiplier).toFixed(1)),
      fiber: Number((baseFib * portionMultiplier).toFixed(1)),
      time: mealTime,
      notes: mealNotes,
      source: selectedFoodForAdd.source,
      isCustom: selectedFoodForAdd.isCustom,
    });

    setActiveAddMealType(null);
    setSelectedFoodForAdd(null);
  };

  const handleCreateCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    addCustomFood({
      name: customName.trim(),
      category: 'mon_chinh',
      categoryLabel: 'Món tùy chỉnh',
      servingSize: customServing || '1 phần vừa',
      calories: Number(customCalories) || 0,
      protein: Number(customProtein) || 0,
      carbs: Number(customCarbs) || 0,
      fat: Number(customFat) || 0,
      fiber: Number(customFiber) || 0,
      source: 'Người dùng tự tạo',
      isVerified: false,
    });

    setIsCustomFoodModalOpen(false);
    setCustomName('');
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
    setCustomFiber('');
  };

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Header bar with photo AI quick scan & copy meal buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-600" />
            <span>Nhật ký ăn uống theo ngày</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
            Ghi nhận tự nhiên, không phán xét món ăn là "tốt" hay "xấu"
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveScreen('photo_scanner')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span>Nhận diện qua ảnh</span>
          </button>

          <button
            onClick={() => setIsCopyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium transition-colors"
            title="Sao chép bữa ăn từ ngày khác"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Sao chép bữa</span>
          </button>
        </div>
      </div>

      {/* 4 Meal Category Sections */}
      <div className="space-y-5">
        {MEAL_SECTIONS.map((section) => {
          const sectionMeals = todayMeals.filter((m) => m.mealType === section.type);
          const sectionCalories = sectionMeals.reduce((s, m) => s + m.calories, 0);

          return (
            <div
              key={section.type}
              className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-stone-200/80 dark:border-slate-700 shadow-sm transition-all"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${section.iconBg}`}>
                    {section.title.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {section.title}
                    </h3>
                    <span className="text-[11px] text-stone-400 dark:text-slate-400">
                      {section.subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {currentUser?.enableCaloriesDisplay && sectionMeals.length > 0 && (
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                      {sectionCalories} kcal
                    </span>
                  )}
                  <button
                    onClick={() => handleOpenAddModal(section.type)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm</span>
                  </button>
                </div>
              </div>

              {/* Meals list */}
              {sectionMeals.length === 0 ? (
                <div className="py-5 text-center text-xs text-stone-400 dark:text-slate-500">
                  Chưa có món nào được ghi trong {section.title.toLowerCase()}.
                </div>
              ) : (
                <div className="divide-y divide-stone-100 dark:divide-slate-700/60 mt-1">
                  {sectionMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="py-3 flex items-start justify-between gap-3 group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                            {meal.foodName}
                          </h4>
                          <span className="text-[11px] text-stone-400 dark:text-slate-400 tabular-nums">
                            {meal.time}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                          <span>{meal.portionLabel}</span>
                          {currentUser?.enableCaloriesDisplay && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums font-medium text-emerald-700 dark:text-emerald-400">
                                {meal.calories} kcal
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">Đạm: {meal.protein}g</span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">Carb: {meal.carbs}g</span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">Béo: {meal.fat}g</span>
                            </>
                          )}
                        </div>

                        {meal.notes && (
                          <p className="text-xs text-stone-600 dark:text-slate-300 mt-1 italic">
                            "{meal.notes}"
                          </p>
                        )}

                        <span className="text-[10px] text-stone-400 dark:text-slate-500 mt-1 block">
                          Nguồn: {meal.source}
                        </span>
                      </div>

                      <button
                        onClick={() => deleteMeal(meal.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                        title="Xóa món"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Meal Modal with Vietnamese Cuisine Search */}
      {activeAddMealType && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 dark:border-slate-800">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Thêm món vào{' '}
                  {MEAL_SECTIONS.find((s) => s.type === activeAddMealType)?.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-slate-400">
                  Dữ liệu dinh dưỡng món Việt chuẩn mực, hỗ trợ tìm không dấu
                </p>
              </div>
              <button
                onClick={() => setActiveAddMealType(null)}
                className="p-2 text-stone-400 hover:text-slate-700 dark:hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="p-4 border-b border-stone-100 dark:border-slate-800 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm món Việt (vd: pho bo, com tam, goi cuon, canh chua)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category Filter Pills (Functional Buttons) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'mon_nuoc', label: 'Món nước' },
                  { id: 'com_dia', label: 'Cơm đĩa' },
                  { id: 'mon_chinh', label: 'Món mặn' },
                  { id: 'canh_rau', label: 'Canh rau' },
                  { id: 'an_vat', label: 'Ăn nhẹ' },
                  { id: 'trang_mieng', label: 'Trái cây' },
                  { id: 'do_uong', label: 'Đồ uống' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryFilter(cat.id)}
                    className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition-colors ${
                      selectedCategoryFilter === cat.id
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 hover:bg-stone-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Food Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredFoods.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-500 dark:text-slate-400 space-y-2">
                  <p>Không tìm thấy món ăn phù hợp với từ khóa.</p>
                  <button
                    onClick={() => setIsCustomFoodModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-medium inline-flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Tạo món tùy chỉnh mới</span>
                  </button>
                </div>
              ) : (
                filteredFoods.map((food) => {
                  const isSelected = selectedFoodForAdd?.id === food.id;
                  return (
                    <div
                      key={food.id}
                      onClick={() => setSelectedFoodForAdd(food)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-sm'
                          : 'border-stone-100 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {food.name}
                          </h4>
                          {food.isVerified && (
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                              (Đã duyệt)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                          {food.servingSize} {food.servingWeightGrams ? `(~${food.servingWeightGrams}g)` : ''} ·{' '}
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">{food.calories} kcal</span> · P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                        </p>
                      </div>

                      <div className="shrink-0">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-stone-300 dark:border-slate-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Selected food portion & notes adjustment */}
            {selectedFoodForAdd && (
              <div className="p-4 bg-stone-50 dark:bg-slate-850 border-t border-stone-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>Khẩu phần:</span>
                  <div className="flex items-center gap-2">
                    {[0.5, 1, 1.5, 2].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPortionMultiplier(p)}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${
                          portionMultiplier === p
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-stone-200 dark:bg-slate-700 text-stone-700 dark:text-slate-300'
                        }`}
                      >
                        {p}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-stone-500 block mb-1">Thời điểm:</label>
                    <input
                      type="time"
                      value={mealTime}
                      onChange={(e) => setMealTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-stone-500 block mb-1">Ghi chú (tuỳ chọn):</label>
                    <input
                      type="text"
                      placeholder="Ít dầu, thêm rau..."
                      value={mealNotes}
                      onChange={(e) => setMealNotes(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                <button
                  onClick={handleConfirmAddMeal}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Xác nhận thêm "{selectedFoodForAdd.name}" (
                  {Math.round(selectedFoodForAdd.calories * portionMultiplier)} kcal)
                </button>
              </div>
            )}

            {/* Bottom action trigger for custom food */}
            <div className="p-3 bg-stone-100 dark:bg-slate-800 flex items-center justify-between text-xs text-stone-600 dark:text-slate-400">
              <span>Không tìm thấy món bạn ăn?</span>
              <button
                onClick={() => setIsCustomFoodModalOpen(true)}
                className="font-semibold text-emerald-600 hover:underline"
              >
                + Tạo món mới
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Food Modal */}
      {isCustomFoodModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCustomFood}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tạo món ăn tùy chỉnh
              </h3>
              <button
                type="button"
                onClick={() => setIsCustomFoodModalOpen(false)}
                className="p-1 text-stone-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Tên món ăn:
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Cá chép om dưa nhà làm..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Quy cách khẩu phần:
              </label>
              <input
                type="text"
                placeholder="Ví dụ: 1 khúc vừa, 1 bát con (~150g)"
                value={customServing}
                onChange={(e) => setCustomServing(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                  Năng lượng (kcal):
                </label>
                <input
                  type="number"
                  placeholder="250"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-xs tabular-nums"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                  Đạm (Protein g):
                </label>
                <input
                  type="number"
                  placeholder="15"
                  value={customProtein}
                  onChange={(e) => setCustomProtein(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-xs tabular-nums"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                  Tinh bột (Carbs g):
                </label>
                <input
                  type="number"
                  placeholder="30"
                  value={customCarbs}
                  onChange={(e) => setCustomCarbs(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-xs tabular-nums"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                  Chất béo (Fat g):
                </label>
                <input
                  type="number"
                  placeholder="8"
                  value={customFat}
                  onChange={(e) => setCustomFat(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-xs tabular-nums"
                />
              </div>
            </div>

            <p className="text-[11px] text-stone-400 dark:text-slate-500">
              * Món mới sẽ được lưu vào danh mục món cá nhân để tái sử dụng nhanh chóng bất kỳ lúc nào.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCustomFoodModalOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-stone-600 dark:text-slate-400 bg-stone-100 dark:bg-slate-800 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors"
              >
                Lưu món
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Copy meals modal */}
      {isCopyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Copy className="w-5 h-5 text-emerald-600" />
              <span>Sao chép bữa ăn</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Chọn ngày muốn sao chép toàn bộ bữa ăn sang ngày hôm nay ({currentDate}):
            </p>

            <div className="space-y-2">
              {[
                { label: 'Hôm qua', date: getRelativeDateString(-1) },
                { label: 'Hôm kia (2 ngày trước)', date: getRelativeDateString(-2) },
                { label: 'Cùng ngày tuần trước', date: getRelativeDateString(-7) },
              ].map((item) => (
                <button
                  key={item.date}
                  onClick={() => {
                    copyMealsToDate(item.date, currentDate);
                    setIsCopyModalOpen(false);
                  }}
                  className="w-full p-3 bg-stone-50 dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 hover:border-emerald-500 text-left transition-all flex items-center justify-between"
                >
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
                  <span className="text-xs text-stone-400 dark:text-slate-500 tabular-nums">{item.date}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsCopyModalOpen(false)}
              className="w-full py-2.5 text-xs font-semibold text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
