import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PlanMealItem, ShoppingListItem } from '../../types';
import {
  CalendarDays,
  ShoppingCart,
  CheckCircle2,
  Circle,
  Clock,
  Users,
  Repeat,
  ArrowRight,
  BookOpen,
  Plus,
  Trash2,
  Check
} from 'lucide-react';

const DAYS_OF_WEEK = [
  { id: 1, label: 'Thứ 2' },
  { id: 2, label: 'Thứ 3' },
  { id: 3, label: 'Thứ 4' },
  { id: 4, label: 'Thứ 5' },
  { id: 5, label: 'Thứ 6' },
  { id: 6, label: 'Thứ 7' },
  { id: 0, label: 'Chủ Nhật' },
];

export const PlansView: React.FC = () => {
  const { plans, confirmPlanMealEaten, updatePlanItem, showToast } = useApp();

  const [selectedDay, setSelectedDay] = useState<number>(1); // Monday default
  const [servingsCount, setServingsCount] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'menu' | 'shopping'>('menu');
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<PlanMealItem | null>(null);

  // Filter plans for the selected day of week
  const dayPlans = useMemo(() => {
    return plans.filter((p) => p.dayOfWeek === selectedDay);
  }, [plans, selectedDay]);

  // Aggregate shopping list from plan ingredients
  const shoppingItems = useMemo<ShoppingListItem[]>(() => {
    const list: ShoppingListItem[] = [];
    plans.forEach((plan) => {
      plan.ingredients.forEach((ing, index) => {
        list.push({
          id: `${plan.id}_ing_${index}`,
          name: ing.name,
          amount: ing.amount,
          category: plan.title,
          checked: Boolean(ing.acquired),
        });
      });
    });
    return list;
  }, [plans]);

  // Handle toggling an ingredient checked status in plan
  const handleToggleIngredient = (planId: string, ingIndex: number) => {
    const targetPlan = plans.find((p) => p.id === planId);
    if (!targetPlan) return;

    const newIngredients = [...targetPlan.ingredients];
    newIngredients[ingIndex] = {
      ...newIngredients[ingIndex],
      acquired: !newIngredients[ingIndex].acquired,
    };

    updatePlanItem({
      ...targetPlan,
      ingredients: newIngredients,
    });
  };

  const handleSwapMeal = (plan: PlanMealItem) => {
    // Alternative healthy Vietnamese meal options
    const alternatives = [
      {
        title: 'Bún riêu cua đồng thanh mát',
        portionNote: '1 tô vừa',
        calories: 410,
        protein: 22,
        carbs: 56,
        fat: 11,
        prepTimeMinutes: 20,
        source: 'Thực đơn gợi ý',
        ingredients: [
          { name: 'Bún tươi', amount: '150g', acquired: false },
          { name: 'Cua đồng xay lọc nước', amount: '200g', acquired: false },
          { name: 'Đậu phụ rán', amount: '50g', acquired: true },
          { name: 'Cà chua chín, giấm bỗng', amount: '100g', acquired: false },
        ],
        instructions: ['Nấu nước dùng riêu cua sôi nhẹ đóng tảng.', 'Thêm cà chua, đậu phụ rán giòn.', 'Trần bún tươi, chan canh nóng hổi.'],
      },
      {
        title: 'Cơm tấm sườn nướng kèm canh rau má',
        portionNote: '1 đĩa vừa',
        calories: 540,
        protein: 30,
        carbs: 68,
        fat: 16,
        prepTimeMinutes: 25,
        source: 'Thực đơn gợi ý',
        ingredients: [
          { name: 'Gạo tấm', amount: '150g', acquired: true },
          { name: 'Thịt nạc heo nướng sả', amount: '100g', acquired: false },
          { name: 'Rau má tươi nấu canh thịt nạc', amount: '150g', acquired: false },
        ],
        instructions: ['Nướng sườn chín vàng thơm.', 'Nấu canh rau má thanh nhiệt.', 'Thưởng thức với dưa leo cà chua.'],
      },
      {
        title: 'Cháo gà hạt sen nấm hương',
        portionNote: '1 tô vừa',
        calories: 360,
        protein: 25,
        carbs: 48,
        fat: 8,
        prepTimeMinutes: 30,
        source: 'Thực đơn gợi ý',
        ingredients: [
          { name: 'Gạo tẻ & nếp', amount: '70g', acquired: true },
          { name: 'Thịt ức gà xé', amount: '80g', acquired: false },
          { name: 'Hạt sen tươi & nấm hương', amount: '50g', acquired: false },
        ],
        instructions: ['Ninh nhừ cháo gà cùng hạt sen bùi béo.', 'Rắc hành hoa và tiêu xay.'],
      },
    ];

    const randomAlt = alternatives[Math.floor(Math.random() * alternatives.length)];
    updatePlanItem({
      ...plan,
      title: randomAlt.title,
      portionNote: randomAlt.portionNote,
      calories: randomAlt.calories,
      protein: randomAlt.protein,
      carbs: randomAlt.carbs,
      fat: randomAlt.fat,
      prepTimeMinutes: randomAlt.prepTimeMinutes,
      source: randomAlt.source,
      ingredients: randomAlt.ingredients,
      instructions: randomAlt.instructions,
      isConfirmedEaten: false,
    });

    showToast(`Đã đổi sang món "${randomAlt.title}".`);
  };

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Top Header & Tab Controls */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-600" />
            <span>Kế hoạch ăn uống & Mua sắm</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
            Thực đơn gia đình Việt Nam khoa học, nguyên liệu tươi ngon theo mùa
          </p>
        </div>

        {/* Segmented Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-slate-700 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'menu'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-stone-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Thực đơn tuần</span>
          </button>
          <button
            onClick={() => setActiveTab('shopping')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'shopping'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-stone-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Danh sách đi chợ ({shoppingItems.filter((i) => !i.checked).length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'menu' ? (
        <div className="space-y-6">
          {/* Day of Week Selector Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDay === day.id;
              return (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-white dark:bg-slate-800 text-stone-600 dark:text-slate-300 border border-stone-200/80 dark:border-slate-700 hover:border-emerald-500'
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>

          {/* Servings multiplier control */}
          <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-slate-800/60 rounded-2xl border border-stone-200/80 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-2 text-stone-600 dark:text-slate-300 font-medium">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Khẩu phần nấu:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { count: 1, label: '1 người' },
                { count: 2, label: '2 người' },
                { count: 4, label: '4 người (Gia đình)' },
              ].map((s) => (
                <button
                  key={s.count}
                  onClick={() => setServingsCount(s.count)}
                  className={`px-3 py-1 rounded-xl font-medium transition-colors ${
                    servingsCount === s.count
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-white dark:bg-slate-700 text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-600'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Meals in selected day */}
          <div className="space-y-4">
            {dayPlans.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center border border-stone-200/80 dark:border-slate-700 text-xs text-stone-400 dark:text-slate-500">
                Chưa có kế hoạch món ăn nào cho ngày này. Bạn có thể tự thêm hoặc đổi từ các món mẫu.
              </div>
            ) : (
              dayPlans.map((meal) => {
                const scaledCalories = Math.round(meal.calories * servingsCount);

                return (
                  <div
                    key={meal.id}
                    className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-stone-200/80 dark:border-slate-700 shadow-sm transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-100 dark:border-slate-700">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                            {meal.mealType === 'breakfast'
                              ? 'Bữa sáng'
                              : meal.mealType === 'lunch'
                              ? 'Bữa trưa'
                              : meal.mealType === 'dinner'
                              ? 'Bữa tối'
                              : 'Bữa phụ'}
                          </span>
                          <span className="text-stone-300 dark:text-slate-600">·</span>
                          <span className="text-xs text-stone-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-400" />
                            <span>{meal.prepTimeMinutes} phút</span>
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          {meal.title}
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-slate-400">
                          {meal.portionNote} ({scaledCalories} kcal {servingsCount > 1 ? `cho ${servingsCount} người` : ''})
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleSwapMeal(meal)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-stone-700 dark:text-slate-300 rounded-xl text-xs font-medium transition-colors"
                          title="Đổi sang món tương đương"
                        >
                          <Repeat className="w-3.5 h-3.5" />
                          <span>Đổi món</span>
                        </button>

                        <button
                          onClick={() => setSelectedRecipeDetail(meal)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-stone-700 dark:text-slate-300 rounded-xl text-xs font-medium transition-colors"
                          title="Xem cách làm"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Cách nấu</span>
                        </button>

                        {/* Transfer to Diary CTA */}
                        <button
                          onClick={() => confirmPlanMealEaten(meal)}
                          disabled={meal.isConfirmedEaten}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                            meal.isConfirmedEaten
                              ? 'bg-stone-100 dark:bg-slate-700 text-stone-400 dark:text-slate-500 cursor-default'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{meal.isConfirmedEaten ? 'Đã ăn' : 'Xác nhận đã ăn'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Ingredients list for this meal */}
                    <div className="pt-3">
                      <span className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-2">
                        Nguyên liệu chính (Chạm để đánh dấu đã có sẵn trong bếp):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {meal.ingredients.map((ing, i) => (
                          <button
                            key={i}
                            onClick={() => handleToggleIngredient(meal.id, i)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs transition-colors border ${
                              ing.acquired
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 line-through'
                                : 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-stone-200 dark:border-slate-700 hover:border-emerald-400'
                            }`}
                          >
                            {ing.acquired ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Circle className="w-3 h-3 text-stone-400" />
                            )}
                            <span>
                              {ing.name} ({ing.amount})
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Shopping List View */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-slate-700">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Danh sách mua sắm gộp nguyên liệu
              </h2>
              <p className="text-xs text-stone-500 dark:text-slate-400">
                Được tổng hợp tự động từ thực đơn trong tuần, tiện lợi khi đi chợ hoặc siêu thị
              </p>
            </div>

            <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Đã có: {shoppingItems.filter((i) => i.checked).length} / {shoppingItems.length}
            </div>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-slate-700/60">
            {shoppingItems.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50/60 dark:hover:bg-slate-850 px-2 rounded-xl transition-colors"
                onClick={() => {
                  const [planId, , ingIndexStr] = item.id.split('_');
                  handleToggleIngredient(planId, Number(ingIndexStr));
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                      item.checked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 dark:border-slate-600'
                    }`}
                  >
                    {item.checked && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span
                      className={`text-sm font-medium block truncate ${
                        item.checked
                          ? 'line-through text-stone-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="text-xs text-stone-400 dark:text-slate-400">
                      Cho món: {item.category}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-semibold text-stone-600 dark:text-slate-400 shrink-0">
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipeDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedRecipeDetail.title}
              </h3>
              <button
                onClick={() => setSelectedRecipeDetail(null)}
                className="p-1 text-stone-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-500 dark:text-slate-400">
              Thời gian nấu: {selectedRecipeDetail.prepTimeMinutes} phút · Khẩu phần tham khảo: {selectedRecipeDetail.portionNote}
            </p>

            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mb-2">
                Nguyên liệu:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-stone-700 dark:text-slate-300">
                {selectedRecipeDetail.ingredients.map((ing, i) => (
                  <li key={i}>
                    {ing.name}: {ing.amount}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mb-2">
                Các bước thực hiện:
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-stone-700 dark:text-slate-300 leading-relaxed">
                {selectedRecipeDetail.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            <button
              onClick={() => setSelectedRecipeDetail(null)}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors mt-2"
            >
              Đóng hướng dẫn
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
