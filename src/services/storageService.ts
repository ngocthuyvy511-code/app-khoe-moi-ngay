import {
  UserProfile,
  MealLogEntry,
  WaterLogEntry,
  SleepLogEntry,
  WorkoutLogEntry,
  HabitItem,
  WeightLogEntry,
  PlanMealItem,
} from '../types';

const PREFIX = 'kmn_v2_';

function getKey(userId: string, collection: string): string {
  return `${PREFIX}${userId}_${collection}`;
}

function getStoredArray<T>(userId: string, collection: string): T[] {
  try {
    const raw = localStorage.getItem(getKey(userId, collection));
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch (e) {
    console.error(`Error reading ${collection} from storage:`, e);
    return [];
  }
}

function setStoredArray<T>(userId: string, collection: string, items: T[]): void {
  try {
    localStorage.setItem(getKey(userId, collection), JSON.stringify(items));
  } catch (e) {
    console.error(`Error writing ${collection} to storage:`, e);
  }
}

// User Profile
export function syncUserProfileToStorage(profile: UserProfile): void {
  try {
    localStorage.setItem(getKey(profile.id, 'profile'), JSON.stringify(profile));
    // Also save as active session
    localStorage.setItem(`${PREFIX}active_user_id`, profile.id);
  } catch (e) {
    console.error('Error saving user profile to storage:', e);
  }
}

export function fetchUserProfileFromStorage(userId: string): UserProfile | null {
  try {
    const raw = localStorage.getItem(getKey(userId, 'profile'));
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch (e) {
    console.error('Error fetching user profile from storage:', e);
    return null;
  }
}

export function getActiveUserId(): string | null {
  try {
    return localStorage.getItem(`${PREFIX}active_user_id`);
  } catch {
    return null;
  }
}

export function clearActiveSession(): void {
  try {
    localStorage.removeItem(`${PREFIX}active_user_id`);
  } catch {
    // ignore
  }
}

// Meals
export function getUserMeals(userId: string): MealLogEntry[] {
  return getStoredArray<MealLogEntry>(userId, 'meals');
}

export function saveUserMeal(userId: string, meal: MealLogEntry): MealLogEntry[] {
  const current = getUserMeals(userId);
  const index = current.findIndex((m) => m.id === meal.id);
  let updated: MealLogEntry[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = meal;
  } else {
    updated = [meal, ...current];
  }
  setStoredArray(userId, 'meals', updated);
  return updated;
}

export function deleteUserMeal(userId: string, mealId: string): MealLogEntry[] {
  const current = getUserMeals(userId);
  const updated = current.filter((m) => m.id !== mealId);
  setStoredArray(userId, 'meals', updated);
  return updated;
}

// Water
export function getUserWater(userId: string): WaterLogEntry[] {
  return getStoredArray<WaterLogEntry>(userId, 'water');
}

export function saveUserWater(userId: string, entry: WaterLogEntry): WaterLogEntry[] {
  const current = getUserWater(userId);
  const updated = [entry, ...current];
  setStoredArray(userId, 'water', updated);
  return updated;
}

export function deleteUserWater(userId: string, waterId: string): WaterLogEntry[] {
  const current = getUserWater(userId);
  const updated = current.filter((w) => w.id !== waterId);
  setStoredArray(userId, 'water', updated);
  return updated;
}

export function resetUserDayWater(userId: string, date: string): WaterLogEntry[] {
  const current = getUserWater(userId);
  const updated = current.filter((w) => w.date !== date);
  setStoredArray(userId, 'water', updated);
  return updated;
}

// Sleep
export function getUserSleep(userId: string): SleepLogEntry[] {
  return getStoredArray<SleepLogEntry>(userId, 'sleep');
}

export function saveUserSleep(userId: string, entry: SleepLogEntry): SleepLogEntry[] {
  const current = getUserSleep(userId);
  const index = current.findIndex((s) => s.date === entry.date);
  let updated: SleepLogEntry[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = entry;
  } else {
    updated = [entry, ...current];
  }
  setStoredArray(userId, 'sleep', updated);
  return updated;
}

// Workouts
export function getUserWorkouts(userId: string): WorkoutLogEntry[] {
  return getStoredArray<WorkoutLogEntry>(userId, 'workouts');
}

export function saveUserWorkout(userId: string, entry: WorkoutLogEntry): WorkoutLogEntry[] {
  const current = getUserWorkouts(userId);
  const updated = [entry, ...current];
  setStoredArray(userId, 'workouts', updated);
  return updated;
}

export function deleteUserWorkout(userId: string, workoutId: string): WorkoutLogEntry[] {
  const current = getUserWorkouts(userId);
  const updated = current.filter((w) => w.id !== workoutId);
  setStoredArray(userId, 'workouts', updated);
  return updated;
}

// Habits
export function getUserHabits(userId: string): HabitItem[] {
  const list = getStoredArray<HabitItem>(userId, 'habits');
  if (list.length === 0) {
    // Default initial habits for newly created real profile
    const defaults: HabitItem[] = [
      {
        id: `h_water_${userId}`,
        userId,
        title: 'Uống đủ 2L nước lọc',
        category: 'hydration',
        categoryLabel: 'Nước uống',
        iconName: 'Droplets',
        targetFrequency: 'daily',
        completedDates: [],
      },
      {
        id: `h_veg_${userId}`,
        userId,
        title: 'Ăn thêm 1 chén rau củ mỗi bữa',
        category: 'nutrition',
        categoryLabel: 'Dinh dưỡng',
        iconName: 'Salad',
        targetFrequency: 'daily',
        completedDates: [],
      },
      {
        id: `h_walk_${userId}`,
        userId,
        title: 'Đi bộ nhẹ nhàng 20 phút',
        category: 'movement',
        categoryLabel: 'Vận động',
        iconName: 'Footprints',
        targetFrequency: 'daily',
        completedDates: [],
      },
      {
        id: `h_sleep_${userId}`,
        userId,
        title: 'Đi ngủ trước 23h30',
        category: 'sleep',
        categoryLabel: 'Giấc ngủ',
        iconName: 'Moon',
        targetFrequency: 'daily',
        completedDates: [],
      },
    ];
    setStoredArray(userId, 'habits', defaults);
    return defaults;
  }
  return list;
}

export function saveUserHabit(userId: string, habit: HabitItem): HabitItem[] {
  const current = getUserHabits(userId);
  const index = current.findIndex((h) => h.id === habit.id);
  let updated: HabitItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = habit;
  } else {
    updated = [habit, ...current];
  }
  setStoredArray(userId, 'habits', updated);
  return updated;
}

export function deleteUserHabit(userId: string, habitId: string): HabitItem[] {
  const current = getUserHabits(userId);
  const updated = current.filter((h) => h.id !== habitId);
  setStoredArray(userId, 'habits', updated);
  return updated;
}

// Weights
export function getUserWeights(userId: string): WeightLogEntry[] {
  return getStoredArray<WeightLogEntry>(userId, 'weights');
}

export function saveUserWeight(userId: string, entry: WeightLogEntry): WeightLogEntry[] {
  const current = getUserWeights(userId);
  const index = current.findIndex((w) => w.date === entry.date);
  let updated: WeightLogEntry[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = entry;
  } else {
    updated = [...current, entry].sort((a, b) => a.date.localeCompare(b.date));
  }
  setStoredArray(userId, 'weights', updated);
  return updated;
}

export function deleteUserWeight(userId: string, weightId: string): WeightLogEntry[] {
  const current = getUserWeights(userId);
  const updated = current.filter((w) => w.id !== weightId);
  setStoredArray(userId, 'weights', updated);
  return updated;
}

// Plans
export function getUserPlans(userId: string): PlanMealItem[] {
  return getStoredArray<PlanMealItem>(userId, 'plans');
}

export function saveUserPlan(userId: string, plan: PlanMealItem): PlanMealItem[] {
  const current = getUserPlans(userId);
  const index = current.findIndex((p) => p.id === plan.id);
  let updated: PlanMealItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = plan;
  } else {
    updated = [plan, ...current];
  }
  setStoredArray(userId, 'plans', updated);
  return updated;
}

// Clear all user data
export function clearAllUserData(userId: string): void {
  const collections = ['profile', 'meals', 'water', 'sleep', 'workouts', 'habits', 'weights', 'plans'];
  collections.forEach((col) => {
    try {
      localStorage.removeItem(getKey(userId, col));
    } catch {
      // ignore
    }
  });
  clearActiveSession();
}
