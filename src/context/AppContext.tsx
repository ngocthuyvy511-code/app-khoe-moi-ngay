import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  UserProfile,
  MealLogEntry,
  WaterLogEntry,
  SleepLogEntry,
  WorkoutLogEntry,
  HabitItem,
  PlanMealItem,
  WeightLogEntry,
  FoodItem,
  MealType,
  ExerciseItem,
} from '../types';
import {
  getAllRegisteredUsers,
  getStoredCurrentUserId,
  setStoredCurrentUserId,
  saveUserToDirectory,
  loadUserMeals,
  saveUserMeals,
  loadUserWater,
  saveUserWater,
  loadUserSleep,
  saveUserSleep,
  loadUserWorkouts,
  saveUserWorkouts,
  loadUserHabits,
  saveUserHabits,
  loadUserPlans,
  saveUserPlans,
  loadUserWeights,
  saveUserWeights,
  loadCustomFoods,
  saveCustomFoods,
  loadExercises,
  saveExercises,
  deleteUserDataCompletely,
} from '../utils/storage';
import { DEMO_USER_ID, DEMO_USER_PROFILE, getRelativeDateString } from '../data/initialDemoData';

export type ScreenType =
  | 'home'
  | 'diary'
  | 'plans'
  | 'progress'
  | 'profile'
  | 'workout'
  | 'habits'
  | 'ai'
  | 'admin'
  | 'onboarding'
  | 'auth'
  | 'photo_scanner';

export type DeviceViewMode = 'responsive' | 'mobile_preview';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'error';
  undoAction?: () => void;
  undoLabel?: string;
}

interface AppContextValue {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  currentDate: string; // YYYY-MM-DD
  setCurrentDate: (date: string) => void;
  activeScreen: ScreenType;
  setActiveScreen: (screen: ScreenType) => void;
  deviceViewMode: DeviceViewMode;
  setDeviceViewMode: (mode: DeviceViewMode) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  isLargeFont: boolean;
  setIsLargeFont: (b: boolean) => void;

  // Data
  meals: MealLogEntry[];
  water: WaterLogEntry[];
  sleep: SleepLogEntry[];
  workouts: WorkoutLogEntry[];
  habits: HabitItem[];
  plans: PlanMealItem[];
  weights: WeightLogEntry[];
  foodCatalog: FoodItem[];
  exercises: ExerciseItem[];

  // Filtered for currentDate
  todayMeals: MealLogEntry[];
  todayWaterTotalMl: number;
  todaySleepEntry?: SleepLogEntry;
  todayWorkouts: WorkoutLogEntry[];
  todayCaloriesConsumed: number;
  todayCaloriesBurned: number;

  // Actions
  addMeal: (entry: Omit<MealLogEntry, 'id' | 'userId'>) => void;
  deleteMeal: (id: string) => void;
  updateMeal: (entry: MealLogEntry) => void;
  copyMealsToDate: (sourceDate: string, targetDate: string) => void;

  addWater: (amountMl: number) => void;
  deleteWater: (id: string) => void;
  resetDayWater: () => void;

  logSleep: (entry: Omit<SleepLogEntry, 'id' | 'userId'>) => void;
  logWorkout: (entry: Omit<WorkoutLogEntry, 'id' | 'userId'>) => void;
  deleteWorkout: (id: string) => void;

  toggleHabit: (habitId: string, date?: string) => void;
  addHabit: (title: string, category: HabitItem['category'], iconName: string) => void;
  deleteHabit: (id: string) => void;

  logWeight: (entry: Omit<WeightLogEntry, 'id' | 'userId'>) => void;
  deleteWeight: (id: string) => void;

  addCustomFood: (food: Omit<FoodItem, 'id'>) => void;
  updateCustomFood: (food: FoodItem) => void;
  deleteCustomFood: (id: string) => void;

  confirmPlanMealEaten: (planItem: PlanMealItem) => void;
  updatePlanItem: (item: PlanMealItem) => void;

  // Profile & Auth
  updateProfile: (updated: Partial<UserProfile>) => void;
  switchUser: (userId: string) => void;
  loginAsDemo: () => void;
  registerNewUser: (email: string, displayName: string, password?: string) => UserProfile;
  logout: () => void;
  deleteCurrentAccount: () => void;

  // Notification Toast
  toast: ToastMessage | null;
  showToast: (text: string, type?: ToastMessage['type'], undo?: () => void, undoLabel?: string) => void;
  hideToast: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState<string>(getRelativeDateString(0));
  const [activeScreen, setActiveScreen] = useState<ScreenType>('home');
  const [deviceViewMode, setDeviceViewMode] = useState<DeviceViewMode>('responsive');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLargeFont, setIsLargeFont] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Users
  const [allUsers, setAllUsers] = useState<UserProfile[]>(getAllRegisteredUsers);
  const [currentUserId, setCurrentUserId] = useState<string>(getStoredCurrentUserId);

  const currentUser = useMemo(() => {
    return allUsers.find((u) => u.id === currentUserId) || DEMO_USER_PROFILE;
  }, [allUsers, currentUserId]);

  // Synchronize font size preference from user
  useEffect(() => {
    if (currentUser?.fontSizePreference === 'large') {
      setIsLargeFont(true);
    } else {
      setIsLargeFont(false);
    }
  }, [currentUser]);

  // Scoped Data states
  const [meals, setMeals] = useState<MealLogEntry[]>(() => loadUserMeals(currentUserId));
  const [water, setWater] = useState<WaterLogEntry[]>(() => loadUserWater(currentUserId));
  const [sleep, setSleep] = useState<SleepLogEntry[]>(() => loadUserSleep(currentUserId));
  const [workouts, setWorkouts] = useState<WorkoutLogEntry[]>(() => loadUserWorkouts(currentUserId));
  const [habits, setHabits] = useState<HabitItem[]>(() => loadUserHabits(currentUserId));
  const [plans, setPlans] = useState<PlanMealItem[]>(() => loadUserPlans(currentUserId));
  const [weights, setWeights] = useState<WeightLogEntry[]>(() => loadUserWeights(currentUserId));

  const [foodCatalog, setFoodCatalog] = useState<FoodItem[]>(loadCustomFoods);
  const [exercises, setExercises] = useState<ExerciseItem[]>(loadExercises);

  // Reload data when user changes
  useEffect(() => {
    setMeals(loadUserMeals(currentUserId));
    setWater(loadUserWater(currentUserId));
    setSleep(loadUserSleep(currentUserId));
    setWorkouts(loadUserWorkouts(currentUserId));
    setHabits(loadUserHabits(currentUserId));
    setPlans(loadUserPlans(currentUserId));
    setWeights(loadUserWeights(currentUserId));
  }, [currentUserId]);

  // Toast handler
  const showToast = (text: string, type: ToastMessage['type'] = 'success', undo?: () => void, undoLabel: string = 'Hoàn tác') => {
    const id = Date.now().toString();
    setToast({ id, text, type, undoAction: undo, undoLabel });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4500);
  };

  const hideToast = () => setToast(null);

  // Calculations for current selected date
  const todayMeals = useMemo(() => {
    return meals.filter((m) => m.date === currentDate);
  }, [meals, currentDate]);

  const todayWaterTotalMl = useMemo(() => {
    return water
      .filter((w) => w.date === currentDate)
      .reduce((sum, item) => sum + item.amountMl, 0);
  }, [water, currentDate]);

  const todaySleepEntry = useMemo(() => {
    return sleep.find((s) => s.date === currentDate);
  }, [sleep, currentDate]);

  const todayWorkouts = useMemo(() => {
    return workouts.filter((w) => w.date === currentDate);
  }, [workouts, currentDate]);

  const todayCaloriesConsumed = useMemo(() => {
    return todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  }, [todayMeals]);

  const todayCaloriesBurned = useMemo(() => {
    return todayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  }, [todayWorkouts]);

  // Actions
  const addMeal = (entry: Omit<MealLogEntry, 'id' | 'userId'>) => {
    const newEntry: MealLogEntry = {
      ...entry,
      id: `meal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUserId,
    };
    const next = [newEntry, ...meals];
    setMeals(next);
    saveUserMeals(currentUserId, next);
    showToast(`Đã thêm món "${entry.foodName}" vào nhật ký.`);
  };

  const deleteMeal = (id: string) => {
    const target = meals.find((m) => m.id === id);
    if (!target) return;
    const next = meals.filter((m) => m.id !== id);
    setMeals(next);
    saveUserMeals(currentUserId, next);

    showToast(`Đã xóa món "${target.foodName}".`, 'info', () => {
      const restored = [target, ...next];
      setMeals(restored);
      saveUserMeals(currentUserId, restored);
      showToast(`Đã hoàn tác khôi phục "${target.foodName}".`);
    });
  };

  const updateMeal = (entry: MealLogEntry) => {
    const next = meals.map((m) => (m.id === entry.id ? entry : m));
    setMeals(next);
    saveUserMeals(currentUserId, next);
    showToast(`Đã cập nhật món "${entry.foodName}".`);
  };

  const copyMealsToDate = (sourceDate: string, targetDate: string) => {
    const sourceMeals = meals.filter((m) => m.date === sourceDate);
    if (sourceMeals.length === 0) {
      showToast('Không có món nào trong ngày được chọn để sao chép.', 'info');
      return;
    }
    const cloned: MealLogEntry[] = sourceMeals.map((m) => ({
      ...m,
      id: `meal_copy_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      date: targetDate,
    }));
    const next = [...cloned, ...meals];
    setMeals(next);
    saveUserMeals(currentUserId, next);
    showToast(`Đã sao chép ${cloned.length} món sang ngày ${targetDate}.`);
  };

  const addWater = (amountMl: number) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newEntry: WaterLogEntry = {
      id: `water_${Date.now()}`,
      userId: currentUserId,
      date: currentDate,
      time,
      amountMl,
    };
    const next = [...water, newEntry];
    setWater(next);
    saveUserWater(currentUserId, next);
    showToast(`Đã ghi nhận +${amountMl}ml nước.`);
  };

  const deleteWater = (id: string) => {
    const target = water.find((w) => w.id === id);
    if (!target) return;
    const next = water.filter((w) => w.id !== id);
    setWater(next);
    saveUserWater(currentUserId, next);
    showToast(`Đã xóa lần uống ${target.amountMl}ml.`, 'info');
  };

  const resetDayWater = () => {
    const next = water.filter((w) => w.date !== currentDate);
    setWater(next);
    saveUserWater(currentUserId, next);
    showToast('Đã đặt lại lượng nước ngày hôm nay.');
  };

  const logSleep = (entry: Omit<SleepLogEntry, 'id' | 'userId'>) => {
    const existingIndex = sleep.findIndex((s) => s.date === entry.date);
    let next: SleepLogEntry[];
    if (existingIndex >= 0) {
      next = [...sleep];
      next[existingIndex] = { ...entry, id: sleep[existingIndex].id, userId: currentUserId };
    } else {
      const newEntry: SleepLogEntry = {
        ...entry,
        id: `sleep_${Date.now()}`,
        userId: currentUserId,
      };
      next = [newEntry, ...sleep];
    }
    setSleep(next);
    saveUserSleep(currentUserId, next);
    showToast(`Đã lưu giấc ngủ: ${entry.durationHours} giờ.`);
  };

  const logWorkout = (entry: Omit<WorkoutLogEntry, 'id' | 'userId'>) => {
    const newEntry: WorkoutLogEntry = {
      ...entry,
      id: `workout_${Date.now()}`,
      userId: currentUserId,
    };
    const next = [newEntry, ...workouts];
    setWorkouts(next);
    saveUserWorkouts(currentUserId, next);
    showToast(`Đã lưu vận động: "${entry.activityName}".`);
  };

  const deleteWorkout = (id: string) => {
    const next = workouts.filter((w) => w.id !== id);
    setWorkouts(next);
    saveUserWorkouts(currentUserId, next);
    showToast('Đã xóa buổi tập.', 'info');
  };

  const toggleHabit = (habitId: string, date: string = currentDate) => {
    const next = habits.map((h) => {
      if (h.id === habitId) {
        const hasCompleted = h.completedDates.includes(date);
        const newDates = hasCompleted
          ? h.completedDates.filter((d) => d !== date)
          : [...h.completedDates, date];
        return { ...h, completedDates: newDates };
      }
      return h;
    });
    setHabits(next);
    saveUserHabits(currentUserId, next);
  };

  const addHabit = (title: string, category: HabitItem['category'], iconName: string) => {
    const newHabit: HabitItem = {
      id: `habit_${Date.now()}`,
      userId: currentUserId,
      title,
      category,
      categoryLabel:
        category === 'nutrition'
          ? 'Dinh dưỡng'
          : category === 'movement'
          ? 'Vận động'
          : category === 'hydration'
          ? 'Nước uống'
          : category === 'sleep'
          ? 'Giấc ngủ'
          : 'Tâm trí',
      iconName,
      targetFrequency: 'daily',
      completedDates: [],
    };
    const next = [...habits, newHabit];
    setHabits(next);
    saveUserHabits(currentUserId, next);
    showToast(`Đã tạo thói quen "${title}".`);
  };

  const deleteHabit = (id: string) => {
    const next = habits.filter((h) => h.id !== id);
    setHabits(next);
    saveUserHabits(currentUserId, next);
    showToast('Đã xóa thói quen.', 'info');
  };

  const logWeight = (entry: Omit<WeightLogEntry, 'id' | 'userId'>) => {
    const existingIndex = weights.findIndex((w) => w.date === entry.date);
    let next: WeightLogEntry[];
    if (existingIndex >= 0) {
      next = [...weights];
      next[existingIndex] = { ...entry, id: weights[existingIndex].id, userId: currentUserId };
    } else {
      const newEntry: WeightLogEntry = {
        ...entry,
        id: `weight_${Date.now()}`,
        userId: currentUserId,
      };
      next = [newEntry, ...weights];
    }
    // Sort descending by date
    next.sort((a, b) => b.date.localeCompare(a.date));
    setWeights(next);
    saveUserWeights(currentUserId, next);

    // Update current weight in user profile
    updateProfile({ currentWeightKg: entry.weightKg });
    showToast(`Đã ghi nhận cân nặng: ${entry.weightKg} kg.`);
  };

  const deleteWeight = (id: string) => {
    const next = weights.filter((w) => w.id !== id);
    setWeights(next);
    saveUserWeights(currentUserId, next);
    showToast('Đã xóa bản ghi cân nặng.', 'info');
  };

  const addCustomFood = (food: Omit<FoodItem, 'id'>) => {
    const newFood: FoodItem = {
      ...food,
      id: `custom_food_${Date.now()}`,
      isCustom: true,
      source: food.source || 'Người dùng tạo',
    };
    const next = [newFood, ...foodCatalog];
    setFoodCatalog(next);
    saveCustomFoods(next);
    showToast(`Đã thêm món "${food.name}" vào danh mục.`);
  };

  const updateCustomFood = (food: FoodItem) => {
    const next = foodCatalog.map((f) => (f.id === food.id ? food : f));
    setFoodCatalog(next);
    saveCustomFoods(next);
    showToast(`Đã cập nhật món "${food.name}".`);
  };

  const deleteCustomFood = (id: string) => {
    const next = foodCatalog.filter((f) => f.id !== id);
    setFoodCatalog(next);
    saveCustomFoods(next);
    showToast('Đã xóa món khỏi danh mục.', 'info');
  };

  const confirmPlanMealEaten = (planItem: PlanMealItem) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newMeal: Omit<MealLogEntry, 'id' | 'userId'> = {
      date: currentDate,
      mealType: planItem.mealType,
      foodName: planItem.title,
      portionMultiplier: 1,
      portionLabel: planItem.portionNote,
      calories: planItem.calories,
      protein: planItem.protein,
      carbs: planItem.carbs,
      fat: planItem.fat,
      fiber: 4,
      time,
      notes: `Chuyển từ kế hoạch ăn uống (${planItem.title})`,
      source: planItem.source,
    };
    addMeal(newMeal);

    // Mark plan item as confirmed
    const nextPlans = plans.map((p) => (p.id === planItem.id ? { ...p, isConfirmedEaten: true } : p));
    setPlans(nextPlans);
    saveUserPlans(currentUserId, nextPlans);
    showToast(`Đã xác nhận ăn và thêm "${planItem.title}" vào nhật ký hôm nay.`);
  };

  const updatePlanItem = (item: PlanMealItem) => {
    const next = plans.map((p) => (p.id === item.id ? item : p));
    setPlans(next);
    saveUserPlans(currentUserId, next);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    const nextUser: UserProfile = {
      ...currentUser,
      ...updated,
      updatedAt: new Date().toISOString(),
    };
    saveUserToDirectory(nextUser);
    setAllUsers((prev) => prev.map((u) => (u.id === nextUser.id ? nextUser : u)));
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    setStoredCurrentUserId(userId);
    const target = allUsers.find((u) => u.id === userId);
    showToast(`Đã chuyển sang tài khoản "${target?.displayName || 'Người dùng'}".`);
  };

  const loginAsDemo = () => {
    switchUser(DEMO_USER_ID);
    setActiveScreen('home');
  };

  const registerNewUser = (email: string, displayName: string): UserProfile => {
    const newId = `user_${Date.now()}`;
    const newUser: UserProfile = {
      ...DEMO_USER_PROFILE,
      id: newId,
      email,
      displayName,
      role: 'user',
      isDemoUser: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const nextUsers = [...allUsers, newUser];
    setAllUsers(nextUsers);
    localStorage.setItem('kmn_all_users_v1', JSON.stringify(nextUsers));
    setCurrentUserId(newId);
    setStoredCurrentUserId(newId);
    showToast(`Chào mừng bạn, ${displayName}! Tài khoản đã sẵn sàng.`);
    setActiveScreen('onboarding');
    return newUser;
  };

  const logout = () => {
    loginAsDemo();
    showToast('Đã đăng xuất. Bạn đang ở chế độ dùng thử với dữ liệu minh họa.');
  };

  const deleteCurrentAccount = () => {
    if (currentUser.id === DEMO_USER_ID) {
      showToast('Tài khoản mẫu không thể bị xóa hoàn toàn. Dữ liệu đã được đặt lại ban đầu.', 'info');
      return;
    }
    const oldName = currentUser.displayName;
    deleteUserDataCompletely(currentUser.id);
    const remaining = getAllRegisteredUsers();
    setAllUsers(remaining);
    setCurrentUserId(DEMO_USER_ID);
    setStoredCurrentUserId(DEMO_USER_ID);
    showToast(`Đã xóa vĩnh viễn tài khoản "${oldName}" và toàn bộ dữ liệu.`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        currentDate,
        setCurrentDate,
        activeScreen,
        setActiveScreen,
        deviceViewMode,
        setDeviceViewMode,
        theme,
        setTheme,
        isLargeFont,
        setIsLargeFont,

        meals,
        water,
        sleep,
        workouts,
        habits,
        plans,
        weights,
        foodCatalog,
        exercises,

        todayMeals,
        todayWaterTotalMl,
        todaySleepEntry,
        todayWorkouts,
        todayCaloriesConsumed,
        todayCaloriesBurned,

        addMeal,
        deleteMeal,
        updateMeal,
        copyMealsToDate,

        addWater,
        deleteWater,
        resetDayWater,

        logSleep,
        logWorkout,
        deleteWorkout,

        toggleHabit,
        addHabit,
        deleteHabit,

        logWeight,
        deleteWeight,

        addCustomFood,
        updateCustomFood,
        deleteCustomFood,

        confirmPlanMealEaten,
        updatePlanItem,

        updateProfile,
        switchUser,
        loginAsDemo,
        registerNewUser,
        logout,
        deleteCurrentAccount,

        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
