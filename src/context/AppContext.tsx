import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
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
  ExerciseItem,
} from '../types';
import {
  syncUserProfileToFirestore,
  fetchUserProfileFromFirestore,
  subscribeUserMeals,
  saveMealToFirestore,
  deleteMealFromFirestore,
  subscribeUserWater,
  saveWaterToFirestore,
  deleteWaterFromFirestore,
  subscribeUserSleep,
  saveSleepToFirestore,
  subscribeUserWorkouts,
  saveWorkoutToFirestore,
  deleteWorkoutFromFirestore,
  subscribeUserHabits,
  saveHabitToFirestore,
  deleteHabitFromFirestore,
  subscribeUserWeights,
  saveWeightToFirestore,
  deleteWeightFromFirestore,
  subscribeUserPlans,
  savePlanToFirestore,
} from '../services/firestoreService';
import { INITIAL_VIETNAMESE_FOODS } from '../data/vietnameseFoods';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { getRelativeDateString } from '../data/initialDemoData';

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

const DEFAULT_BLANK_PROFILE: UserProfile = {
  id: '',
  email: '',
  displayName: '',
  role: 'user',
  age: 28,
  biologicalSex: 'prefer_not_to_say',
  heightCm: 165,
  currentWeightKg: 60,
  targetWeightKg: 58,
  activityLevel: 'light',
  primaryGoal: 'manage_weight',
  healthConditions: ['none'],
  isGentleHabitsMode: false,
  workoutMinutesPerDay: 25,
  workoutLocations: ['home'],
  availableEquipment: ['Thảm tập'],
  dietaryPreference: 'Thực đơn gia đình Việt Nam cân bằng',
  dislikedFoods: [],
  dietaryRestrictions: [],
  allergies: [],
  budgetLevel: 'moderate',
  cookingTimePreference: 'quick',
  dailyWaterTargetMl: 2000,
  enableCaloriesDisplay: true,
  enableWeightDisplay: true,
  preferredWeightUnit: 'kg',
  preferredHeightUnit: 'cm',
  preferredWaterUnit: 'ml',
  fontSizePreference: 'normal',
  notifications: {
    mealReminders: true,
    workoutReminders: true,
    waterReminders: true,
    sleepReminders: true,
    progressReminders: true,
    weeklyDigest: true,
    quietHoursStart: '22:30',
    quietHoursEnd: '06:30',
  },
  consentAiPhoto: true,
  isDemoUser: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

interface AppContextValue {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;

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

  // Real-time Cloud Data
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
  addMeal: (entry: Omit<MealLogEntry, 'id' | 'userId'>) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  updateMeal: (entry: MealLogEntry) => Promise<void>;
  copyMealsToDate: (sourceDate: string, targetDate: string) => Promise<void>;

  addWater: (amountMl: number) => Promise<void>;
  deleteWater: (id: string) => Promise<void>;
  resetDayWater: () => Promise<void>;

  logSleep: (entry: Omit<SleepLogEntry, 'id' | 'userId'>) => Promise<void>;
  logWorkout: (entry: Omit<WorkoutLogEntry, 'id' | 'userId'>) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;

  toggleHabit: (habitId: string, date?: string) => Promise<void>;
  addHabit: (title: string, category: HabitItem['category'], iconName: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;

  logWeight: (entry: Omit<WeightLogEntry, 'id' | 'userId'>) => Promise<void>;
  deleteWeight: (id: string) => Promise<void>;

  addCustomFood: (food: Omit<FoodItem, 'id'>) => void;
  deleteCustomFood: (id: string) => void;
  confirmPlanMealEaten: (planItem: PlanMealItem) => Promise<void>;
  updatePlanItem: (item: PlanMealItem) => Promise<void>;

  // Profile
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;

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

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Cloud synced datasets
  const [meals, setMeals] = useState<MealLogEntry[]>([]);
  const [water, setWater] = useState<WaterLogEntry[]>([]);
  const [sleep, setSleep] = useState<SleepLogEntry[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutLogEntry[]>([]);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [plans, setPlans] = useState<PlanMealItem[]>([]);
  const [weights, setWeights] = useState<WeightLogEntry[]>([]);

  const [foodCatalog, setFoodCatalog] = useState<FoodItem[]>(INITIAL_VIETNAMESE_FOODS);
  const [exercises] = useState<ExerciseItem[]>(EXERCISE_LIBRARY);

  // Toast handler
  const showToast = (text: string, type: ToastMessage['type'] = 'success', undo?: () => void, undoLabel: string = 'Hoàn tác') => {
    const id = Date.now().toString();
    setToast({ id, text, type, undoAction: undo, undoLabel });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4500);
  };

  const hideToast = () => setToast(null);

  // Monitor Firebase Authentication State
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          // Fetch real profile from Firestore
          let profile = await fetchUserProfileFromFirestore(user.uid);
          if (!profile) {
            // First time Google sign-in: create real profile from Google info
            profile = {
              ...DEFAULT_BLANK_PROFILE,
              id: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'Người dùng',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await syncUserProfileToFirestore(profile);
            // Prompt onboarding for first time
            setActiveScreen('onboarding');
          }
          setCurrentUser(profile);
          showToast(`Chào mừng ${profile.displayName} đã đăng nhập!`);
        } catch (e) {
          console.error('Error loading user profile:', e);
        }
      } else {
        setCurrentUser(null);
        setMeals([]);
        setWater([]);
        setSleep([]);
        setWorkouts([]);
        setHabits([]);
        setPlans([]);
        setWeights([]);
        setActiveScreen('auth');
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen to Firestore real-time collections when user is authenticated
  useEffect(() => {
    if (!firebaseUser?.uid) return;

    const uid = firebaseUser.uid;
    const unsubMeals = subscribeUserMeals(uid, setMeals);
    const unsubWater = subscribeUserWater(uid, setWater);
    const unsubSleep = subscribeUserSleep(uid, setSleep);
    const unsubWorkouts = subscribeUserWorkouts(uid, setWorkouts);
    const unsubHabits = subscribeUserHabits(uid, setHabits);
    const unsubWeights = subscribeUserWeights(uid, setWeights);
    const unsubPlans = subscribeUserPlans(uid, setPlans);

    return () => {
      unsubMeals();
      unsubWater();
      unsubSleep();
      unsubWorkouts();
      unsubHabits();
      unsubWeights();
      unsubPlans();
    };
  }, [firebaseUser]);

  // Google Sign-In Action
  const signInWithGoogle = async () => {
    try {
      setIsAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      showToast(error.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.', 'error');
      setIsAuthLoading(false);
    }
  };

  // Sign-Out Action
  const signOutUser = async () => {
    try {
      await signOut(auth);
      showToast('Đã đăng xuất an toàn.');
      setActiveScreen('auth');
    } catch (error: any) {
      console.error('Sign out error:', error);
    }
  };

  // Filtered for currentDate
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
  const addMeal = async (entry: Omit<MealLogEntry, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newEntry: MealLogEntry = {
      ...entry,
      id: `meal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser.id,
    };
    await saveMealToFirestore(currentUser.id, newEntry);
    showToast(`Đã lưu "${entry.foodName}" vào nhật ký đám mây.`);
  };

  const deleteMeal = async (id: string) => {
    if (!currentUser) return;
    const target = meals.find((m) => m.id === id);
    if (!target) return;
    await deleteMealFromFirestore(currentUser.id, id);
    showToast(`Đã xóa món "${target.foodName}".`, 'info', async () => {
      await saveMealToFirestore(currentUser.id, target);
      showToast(`Đã hoàn tác khôi phục "${target.foodName}".`);
    });
  };

  const updateMeal = async (entry: MealLogEntry) => {
    if (!currentUser) return;
    await saveMealToFirestore(currentUser.id, entry);
    showToast(`Đã cập nhật món "${entry.foodName}".`);
  };

  const copyMealsToDate = async (sourceDate: string, targetDate: string) => {
    if (!currentUser) return;
    const sourceMeals = meals.filter((m) => m.date === sourceDate);
    if (sourceMeals.length === 0) {
      showToast('Không có món nào trong ngày được chọn để sao chép.', 'info');
      return;
    }
    for (const m of sourceMeals) {
      const cloned: MealLogEntry = {
        ...m,
        id: `meal_copy_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        date: targetDate,
      };
      await saveMealToFirestore(currentUser.id, cloned);
    }
    showToast(`Đã sao chép ${sourceMeals.length} món sang ngày ${targetDate}.`);
  };

  const addWater = async (amountMl: number) => {
    if (!currentUser) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newEntry: WaterLogEntry = {
      id: `water_${Date.now()}`,
      userId: currentUser.id,
      date: currentDate,
      time,
      amountMl,
    };
    await saveWaterToFirestore(currentUser.id, newEntry);
    showToast(`Đã ghi nhận +${amountMl}ml nước.`);
  };

  const deleteWater = async (id: string) => {
    if (!currentUser) return;
    const target = water.find((w) => w.id === id);
    if (!target) return;
    await deleteWaterFromFirestore(currentUser.id, id);
    showToast(`Đã xóa lần uống ${target.amountMl}ml.`, 'info');
  };

  const logSleep = async (entry: Omit<SleepLogEntry, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const existing = sleep.find((s) => s.date === entry.date);
    const newEntry: SleepLogEntry = {
      ...entry,
      id: existing ? existing.id : `sleep_${Date.now()}`,
      userId: currentUser.id,
    };
    await saveSleepToFirestore(currentUser.id, newEntry);
    showToast(`Đã lưu giấc ngủ: ${entry.durationHours} giờ vào Firebase.`);
  };

  const logWorkout = async (entry: Omit<WorkoutLogEntry, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newEntry: WorkoutLogEntry = {
      ...entry,
      id: `workout_${Date.now()}`,
      userId: currentUser.id,
    };
    await saveWorkoutToFirestore(currentUser.id, newEntry);
    showToast(`Đã lưu bài tập "${entry.activityName}".`);
  };

  const deleteWorkout = async (id: string) => {
    if (!currentUser) return;
    await deleteWorkoutFromFirestore(currentUser.id, id);
    showToast('Đã xóa buổi tập.', 'info');
  };

  const toggleHabit = async (habitId: string, date: string = currentDate) => {
    if (!currentUser) return;
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const hasCompleted = habit.completedDates.includes(date);
    const newDates = hasCompleted
      ? habit.completedDates.filter((d) => d !== date)
      : [...habit.completedDates, date];

    const updated: HabitItem = { ...habit, completedDates: newDates };
    await saveHabitToFirestore(currentUser.id, updated);
  };

  const addHabit = async (title: string, category: HabitItem['category'], iconName: string) => {
    if (!currentUser) return;
    const newHabit: HabitItem = {
      id: `habit_${Date.now()}`,
      userId: currentUser.id,
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
    await saveHabitToFirestore(currentUser.id, newHabit);
    showToast(`Đã tạo thói quen "${title}".`);
  };

  const deleteHabit = async (id: string) => {
    if (!currentUser) return;
    await deleteHabitFromFirestore(currentUser.id, id);
    showToast('Đã xóa thói quen.', 'info');
  };

  const logWeight = async (entry: Omit<WeightLogEntry, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const existing = weights.find((w) => w.date === entry.date);
    const newEntry: WeightLogEntry = {
      ...entry,
      id: existing ? existing.id : `weight_${Date.now()}`,
      userId: currentUser.id,
    };
    await saveWeightToFirestore(currentUser.id, newEntry);
    await updateProfile({ currentWeightKg: entry.weightKg });
    showToast(`Đã lưu cân nặng ${entry.weightKg}kg lên Firebase.`);
  };

  const deleteWeight = async (id: string) => {
    if (!currentUser) return;
    await deleteWeightFromFirestore(currentUser.id, id);
    showToast('Đã xóa bản ghi cân nặng.', 'info');
  };

  const resetDayWater = async () => {
    if (!currentUser) return;
    const todayEntries = water.filter((w) => w.date === currentDate);
    for (const entry of todayEntries) {
      await deleteWaterFromFirestore(currentUser.id, entry.id);
    }
    showToast('Đã đặt lại dữ liệu nước trong ngày.', 'info');
  };

  const addCustomFood = (food: Omit<FoodItem, 'id'>) => {
    const newFood: FoodItem = {
      ...food,
      id: `custom_food_${Date.now()}`,
      isCustom: true,
      source: food.source || 'Người dùng tạo',
    };
    setFoodCatalog([newFood, ...foodCatalog]);
    showToast(`Đã thêm món "${food.name}".`);
  };

  const deleteCustomFood = (id: string) => {
    setFoodCatalog((prev) => prev.filter((f) => f.id !== id));
    showToast('Đã xóa món ăn khỏi danh mục.', 'info');
  };

  const confirmPlanMealEaten = async (planItem: PlanMealItem) => {
    if (!currentUser) return;
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
    await addMeal(newMeal);

    const updatedPlan = { ...planItem, isConfirmedEaten: true };
    await savePlanToFirestore(currentUser.id, updatedPlan);
    showToast(`Đã xác nhận ăn "${planItem.title}" và lưu vào nhật ký.`);
  };

  const updatePlanItem = async (item: PlanMealItem) => {
    if (!currentUser) return;
    await savePlanToFirestore(currentUser.id, item);
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const nextUser: UserProfile = {
      ...currentUser,
      ...updated,
      updatedAt: new Date().toISOString(),
    };
    setCurrentUser(nextUser);
    await syncUserProfileToFirestore(nextUser);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isAuthLoading,
        signInWithGoogle,
        signOutUser,

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
        deleteCustomFood,
        confirmPlanMealEaten,
        updatePlanItem,

        updateProfile,

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
