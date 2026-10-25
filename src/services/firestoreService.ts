import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
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

// User Profile
export async function syncUserProfileToFirestore(profile: UserProfile): Promise<void> {
  const path = `users/${profile.id}`;
  try {
    await setDoc(doc(db, 'users', profile.id), profile, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

// Meals
export function subscribeUserMeals(userId: string, onUpdate: (meals: MealLogEntry[]) => void) {
  const path = `users/${userId}/meals`;
  const q = collection(db, 'users', userId, 'meals');

  return onSnapshot(
    q,
    (snapshot) => {
      const items: MealLogEntry[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...docSnap.data(), id: docSnap.id } as MealLogEntry);
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveMealToFirestore(userId: string, meal: MealLogEntry): Promise<void> {
  const path = `users/${userId}/meals/${meal.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'meals', meal.id), meal);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteMealFromFirestore(userId: string, mealId: string): Promise<void> {
  const path = `users/${userId}/meals/${mealId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'meals', mealId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Water
export function subscribeUserWater(userId: string, onUpdate: (water: WaterLogEntry[]) => void) {
  const path = `users/${userId}/water`;
  const q = collection(db, 'users', userId, 'water');

  return onSnapshot(
    q,
    (snapshot) => {
      const items: WaterLogEntry[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...docSnap.data(), id: docSnap.id } as WaterLogEntry);
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveWaterToFirestore(userId: string, water: WaterLogEntry): Promise<void> {
  const path = `users/${userId}/water/${water.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'water', water.id), water);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteWaterFromFirestore(userId: string, waterId: string): Promise<void> {
  const path = `users/${userId}/water/${waterId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'water', waterId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Sleep
export function subscribeUserSleep(userId: string, onUpdate: (sleep: SleepLogEntry[]) => void) {
  const path = `users/${userId}/sleep`;
  const q = collection(db, 'users', userId, 'sleep');

  return onSnapshot(
    q,
    (snapshot) => {
      const items: SleepLogEntry[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...docSnap.data(), id: docSnap.id } as SleepLogEntry);
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveSleepToFirestore(userId: string, sleep: SleepLogEntry): Promise<void> {
  const path = `users/${userId}/sleep/${sleep.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'sleep', sleep.id), sleep);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Workouts
export function subscribeUserWorkouts(userId: string, onUpdate: (workouts: WorkoutLogEntry[]) => void) {
  const path = `users/${userId}/workouts`;
  const q = collection(db, 'users', userId, 'workouts');

  return onSnapshot(
    q,
    (snapshot) => {
      const items: WorkoutLogEntry[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...docSnap.data(), id: docSnap.id } as WorkoutLogEntry);
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveWorkoutToFirestore(userId: string, workout: WorkoutLogEntry): Promise<void> {
  const path = `users/${userId}/workouts/${workout.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'workouts', workout.id), workout);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteWorkoutFromFirestore(userId: string, workoutId: string): Promise<void> {
  const path = `users/${userId}/workouts/${workoutId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'workouts', workoutId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Habits
export function subscribeUserHabits(userId: string, onUpdate: (habits: HabitItem[]) => void) {
  const path = `users/${userId}/habits`;
  const q = collection(db, 'users', userId, 'habits');

  return onSnapshot(
    q,
    (snapshot) => {
      const items: HabitItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...docSnap.data(), id: docSnap.id } as HabitItem);
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveHabitToFirestore(userId: string, habit: HabitItem): Promise<void> {
  const path = `users/${userId}/habits/${habit.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'habits', habit.id), habit);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteHabitFromFirestore(userId: string, habitId: string): Promise<void> {
  const path = `users/${userId}/habits/${habitId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'habits', habitId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Weights
export function subscribeUserWeights(userId: string, onUpdate: (weights: WeightLogEntry[]) => void) {
  const path = `users/${userId}/weights`;
  const q = collection(db, 'users', userId, 'weights');

  return onSnapshot(
    q,
    (snapshot) => {
      const items: WeightLogEntry[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...docSnap.data(), id: docSnap.id } as WeightLogEntry);
      });
      items.sort((a, b) => b.date.localeCompare(a.date));
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveWeightToFirestore(userId: string, weight: WeightLogEntry): Promise<void> {
  const path = `users/${userId}/weights/${weight.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'weights', weight.id), weight);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteWeightFromFirestore(userId: string, weightId: string): Promise<void> {
  const path = `users/${userId}/weights/${weightId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'weights', weightId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Plans
export function subscribeUserPlans(userId: string, onUpdate: (plans: PlanMealItem[]) => void) {
  const path = `users/${userId}/plans`;
  const q = collection(db, 'users', userId, 'plans');

  return onSnapshot(
    q,
    (snapshot) => {
      const items: PlanMealItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...docSnap.data(), id: docSnap.id } as PlanMealItem);
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function savePlanToFirestore(userId: string, plan: PlanMealItem): Promise<void> {
  const path = `users/${userId}/plans/${plan.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'plans', plan.id), plan);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
