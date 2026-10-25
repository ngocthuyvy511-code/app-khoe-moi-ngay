export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  category: 'mon_nuoc' | 'com_dia' | 'mon_chinh' | 'canh_rau' | 'trang_mieng' | 'do_uong' | 'an_vat';
  categoryLabel: string;
  servingSize: string;
  servingWeightGrams?: number;
  calories: number; // kcal
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
  fiber?: number;   // grams
  isVerified?: boolean;
  source: string; // e.g., "Viện Dinh Dưỡng Quốc Gia", "Phân tích món Việt", "Người dùng tạo"
  isCustom?: boolean;
  image?: string;
  ingredients?: string[];
  recipeNote?: string;
}

export interface MealLogEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  foodId?: string;
  foodName: string;
  portionMultiplier: number;
  portionLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  time: string; // HH:mm
  notes?: string;
  imageUrl?: string;
  source: string;
  isCustom?: boolean;
}

export interface WaterLogEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  amountMl: number;
}

export interface SleepLogEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD (the waking date)
  bedTime: string; // e.g. "23:15"
  wakeTime: string; // e.g. "06:45"
  durationHours: number; // calculated accurately past midnight
  quality: 'great' | 'good' | 'fair' | 'tired';
  notes?: string;
}

export interface WorkoutLogEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  activityType: 'walking' | 'running' | 'cycling' | 'swimming' | 'yoga' | 'strength' | 'custom';
  activityName: string;
  durationMinutes: number;
  intensity: 'light' | 'moderate' | 'vigorous';
  distanceKm?: number;
  steps?: number;
  isManualSteps?: boolean;
  caloriesBurned?: number;
  notes?: string;
  completedAt: string;
}

export interface ExerciseItem {
  id: string;
  title: string;
  category: 'strength' | 'cardio' | 'mobility' | 'recovery';
  categoryLabel: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  levelLabel: string;
  durationMinutes: number;
  equipment: string;
  instructions: string[];
  alternativeExercise?: string;
  safetyCaution: string;
  targetMuscles: string[];
}

export interface HabitItem {
  id: string;
  userId: string;
  title: string;
  iconName: string;
  category: 'nutrition' | 'movement' | 'hydration' | 'mindfulness' | 'sleep';
  categoryLabel: string;
  targetFrequency: 'daily' | 'weekdays' | 'custom';
  isPaused?: boolean;
  completedDates: string[]; // list of YYYY-MM-DD
}

export interface PlanMealItem {
  id: string;
  dayOfWeek: number; // 0: Sunday, 1: Monday, ... 6: Saturday
  mealType: MealType;
  title: string;
  portionNote: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: { name: string; amount: string; acquired?: boolean }[];
  instructions: string[];
  prepTimeMinutes: number;
  source: string;
  isConfirmedEaten?: boolean;
}

export interface WeightLogEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  waistCm?: number;
  chestCm?: number;
  hipCm?: number;
  mood?: 'happy' | 'peaceful' | 'neutral' | 'stressed' | 'tired';
  energyLevel?: number; // 1 to 5
  notes?: string;
  photoUrl?: string; // Private by default
}

export type HealthConditionFlag = 'under_18' | 'pregnant_or_nursing' | 'eating_disorder_history' | 'chronic_medical_condition' | 'none';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  birthYear?: number;
  age?: number;
  biologicalSex?: 'female' | 'male' | 'prefer_not_to_say';
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg?: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active';
  primaryGoal: 'manage_weight' | 'maintain_weight' | 'build_habits';
  healthConditions: HealthConditionFlag[];
  isGentleHabitsMode: boolean; // Activated automatically if healthConditions has flags, or if user opts in
  workoutMinutesPerDay: number;
  workoutLocations: ('home' | 'outdoor' | 'gym')[];
  availableEquipment: string[];
  dietaryPreference: string;
  dislikedFoods: string[];
  dietaryRestrictions: string[];
  allergies: string[];
  budgetLevel: 'economical' | 'moderate' | 'flexible';
  cookingTimePreference: 'quick' | 'moderate' | 'enjoy_cooking';
  dailyWaterTargetMl: number;
  enableCaloriesDisplay: boolean;
  enableWeightDisplay: boolean;
  preferredWeightUnit: 'kg' | 'lb';
  preferredHeightUnit: 'cm' | 'ft';
  preferredWaterUnit: 'ml' | 'oz';
  fontSizePreference: 'normal' | 'large';
  notifications: {
    mealReminders: boolean;
    workoutReminders: boolean;
    waterReminders: boolean;
    sleepReminders: boolean;
    progressReminders: boolean;
    weeklyDigest: boolean;
    quietHoursStart: string; // "22:00"
    quietHoursEnd: string;   // "07:00"
  };
  consentAiPhoto: boolean;
  isDemoUser?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount: string;
  category: string;
  checked: boolean;
}
