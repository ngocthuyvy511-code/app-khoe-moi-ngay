import { UserProfile, MealLogEntry, WaterLogEntry, SleepLogEntry, WorkoutLogEntry, HabitItem, PlanMealItem, WeightLogEntry, FoodItem, ExerciseItem } from '../types';
import { DEMO_USER_PROFILE, DEMO_USER_ID, INITIAL_DEMO_HABITS, INITIAL_DEMO_MEALS, INITIAL_DEMO_WATER, INITIAL_DEMO_SLEEP, INITIAL_DEMO_WORKOUTS, INITIAL_DEMO_WEIGHT_HISTORY, INITIAL_DEMO_PLAN_MEALS } from '../data/initialDemoData';
import { INITIAL_VIETNAMESE_FOODS } from '../data/vietnameseFoods';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';

const USERS_LIST_KEY = 'kmn_all_users_v1';
const CURRENT_USER_KEY = 'kmn_current_user_id_v1';
const FOOD_CATALOG_KEY = 'kmn_custom_foods_catalog_v1';
const EXERCISE_CATALOG_KEY = 'kmn_exercise_catalog_v1';

export function getAllRegisteredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_LIST_KEY);
    if (!raw) {
      // Seed with demo user
      const initial = [DEMO_USER_PROFILE];
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [DEMO_USER_PROFILE];
  }
}

export function saveUserToDirectory(user: UserProfile) {
  const users = getAllRegisteredUsers();
  const index = users.findIndex((u) => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
}

export function getStoredCurrentUserId(): string {
  try {
    return localStorage.getItem(CURRENT_USER_KEY) || DEMO_USER_ID;
  } catch {
    return DEMO_USER_ID;
  }
}

export function setStoredCurrentUserId(id: string) {
  try {
    localStorage.setItem(CURRENT_USER_KEY, id);
  } catch (e) {
    console.error('Cannot set current user:', e);
  }
}

// User-scoped getters and setters
export function getUserDataKey(userId: string, prefix: string): string {
  return `kmn_${prefix}_${userId}`;
}

export function loadUserMeals(userId: string): MealLogEntry[] {
  try {
    const raw = localStorage.getItem(getUserDataKey(userId, 'meals'));
    if (!raw) {
      if (userId === DEMO_USER_ID) {
        localStorage.setItem(getUserDataKey(userId, 'meals'), JSON.stringify(INITIAL_DEMO_MEALS));
        return INITIAL_DEMO_MEALS;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserMeals(userId: string, meals: MealLogEntry[]) {
  localStorage.setItem(getUserDataKey(userId, 'meals'), JSON.stringify(meals));
}

export function loadUserWater(userId: string): WaterLogEntry[] {
  try {
    const raw = localStorage.getItem(getUserDataKey(userId, 'water'));
    if (!raw) {
      if (userId === DEMO_USER_ID) {
        localStorage.setItem(getUserDataKey(userId, 'water'), JSON.stringify(INITIAL_DEMO_WATER));
        return INITIAL_DEMO_WATER;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserWater(userId: string, water: WaterLogEntry[]) {
  localStorage.setItem(getUserDataKey(userId, 'water'), JSON.stringify(water));
}

export function loadUserSleep(userId: string): SleepLogEntry[] {
  try {
    const raw = localStorage.getItem(getUserDataKey(userId, 'sleep'));
    if (!raw) {
      if (userId === DEMO_USER_ID) {
        localStorage.setItem(getUserDataKey(userId, 'sleep'), JSON.stringify(INITIAL_DEMO_SLEEP));
        return INITIAL_DEMO_SLEEP;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserSleep(userId: string, sleep: SleepLogEntry[]) {
  localStorage.setItem(getUserDataKey(userId, 'sleep'), JSON.stringify(sleep));
}

export function loadUserWorkouts(userId: string): WorkoutLogEntry[] {
  try {
    const raw = localStorage.getItem(getUserDataKey(userId, 'workouts'));
    if (!raw) {
      if (userId === DEMO_USER_ID) {
        localStorage.setItem(getUserDataKey(userId, 'workouts'), JSON.stringify(INITIAL_DEMO_WORKOUTS));
        return INITIAL_DEMO_WORKOUTS;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserWorkouts(userId: string, workouts: WorkoutLogEntry[]) {
  localStorage.setItem(getUserDataKey(userId, 'workouts'), JSON.stringify(workouts));
}

export function loadUserHabits(userId: string): HabitItem[] {
  try {
    const raw = localStorage.getItem(getUserDataKey(userId, 'habits'));
    if (!raw) {
      if (userId === DEMO_USER_ID) {
        localStorage.setItem(getUserDataKey(userId, 'habits'), JSON.stringify(INITIAL_DEMO_HABITS));
        return INITIAL_DEMO_HABITS;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserHabits(userId: string, habits: HabitItem[]) {
  localStorage.setItem(getUserDataKey(userId, 'habits'), JSON.stringify(habits));
}

export function loadUserPlans(userId: string): PlanMealItem[] {
  try {
    const raw = localStorage.getItem(getUserDataKey(userId, 'plans'));
    if (!raw) {
      if (userId === DEMO_USER_ID) {
        localStorage.setItem(getUserDataKey(userId, 'plans'), JSON.stringify(INITIAL_DEMO_PLAN_MEALS));
        return INITIAL_DEMO_PLAN_MEALS;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserPlans(userId: string, plans: PlanMealItem[]) {
  localStorage.setItem(getUserDataKey(userId, 'plans'), JSON.stringify(plans));
}

export function loadUserWeights(userId: string): WeightLogEntry[] {
  try {
    const raw = localStorage.getItem(getUserDataKey(userId, 'weights'));
    if (!raw) {
      if (userId === DEMO_USER_ID) {
        localStorage.setItem(getUserDataKey(userId, 'weights'), JSON.stringify(INITIAL_DEMO_WEIGHT_HISTORY));
        return INITIAL_DEMO_WEIGHT_HISTORY;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserWeights(userId: string, weights: WeightLogEntry[]) {
  localStorage.setItem(getUserDataKey(userId, 'weights'), JSON.stringify(weights));
}

export function loadCustomFoods(): FoodItem[] {
  try {
    const raw = localStorage.getItem(FOOD_CATALOG_KEY);
    if (!raw) {
      localStorage.setItem(FOOD_CATALOG_KEY, JSON.stringify(INITIAL_VIETNAMESE_FOODS));
      return INITIAL_VIETNAMESE_FOODS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_VIETNAMESE_FOODS;
  }
}

export function saveCustomFoods(foods: FoodItem[]) {
  localStorage.setItem(FOOD_CATALOG_KEY, JSON.stringify(foods));
}

export function loadExercises(): ExerciseItem[] {
  try {
    const raw = localStorage.getItem(EXERCISE_CATALOG_KEY);
    if (!raw) {
      localStorage.setItem(EXERCISE_CATALOG_KEY, JSON.stringify(EXERCISE_LIBRARY));
      return EXERCISE_LIBRARY;
    }
    return JSON.parse(raw);
  } catch {
    return EXERCISE_LIBRARY;
  }
}

export function saveExercises(exercises: ExerciseItem[]) {
  localStorage.setItem(EXERCISE_CATALOG_KEY, JSON.stringify(exercises));
}

/**
 * Export all user data as JSON file for privacy compliance.
 */
export function exportUserDataAsJSON(userId: string): string {
  const users = getAllRegisteredUsers();
  const profile = users.find((u) => u.id === userId) || null;
  const meals = loadUserMeals(userId);
  const water = loadUserWater(userId);
  const sleep = loadUserSleep(userId);
  const workouts = loadUserWorkouts(userId);
  const habits = loadUserHabits(userId);
  const weights = loadUserWeights(userId);
  const plans = loadUserPlans(userId);

  const payload = {
    exportedAt: new Date().toISOString(),
    appName: 'Khỏe Mỗi Ngày',
    version: '1.0.0',
    profile,
    meals,
    water,
    sleep,
    workouts,
    habits,
    weights,
    plans,
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Permanently delete all data of a user.
 */
export function deleteUserDataCompletely(userId: string) {
  const keys = ['meals', 'water', 'sleep', 'workouts', 'habits', 'weights', 'plans'];
  keys.forEach((k) => localStorage.removeItem(getUserDataKey(userId, k)));

  const users = getAllRegisteredUsers().filter((u) => u.id !== userId);
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));

  if (getStoredCurrentUserId() === userId) {
    setStoredCurrentUserId(DEMO_USER_ID);
  }
}
