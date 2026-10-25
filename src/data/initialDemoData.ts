import { UserProfile, MealLogEntry, WaterLogEntry, SleepLogEntry, WorkoutLogEntry, HabitItem, PlanMealItem, WeightLogEntry } from '../types';

export const DEMO_USER_ID = 'demo_user_minh_anh';

export const DEMO_USER_PROFILE: UserProfile = {
  id: DEMO_USER_ID,
  email: 'minhanh.demo@khoemoingay.vn',
  displayName: 'Minh Anh',
  role: 'user',
  age: 28,
  biologicalSex: 'female',
  heightCm: 162,
  currentWeightKg: 64.5,
  targetWeightKg: 61.0,
  activityLevel: 'light',
  primaryGoal: 'manage_weight',
  healthConditions: ['none'],
  isGentleHabitsMode: false,
  workoutMinutesPerDay: 25,
  workoutLocations: ['home', 'outdoor'],
  availableEquipment: ['Thảm yoga', 'Dây kháng lực'],
  dietaryPreference: 'Thực đơn gia đình Việt Nam cân bằng',
  dislikedFoods: ['Thịt mỡ nhiều', 'Nội tạng'],
  dietaryRestrictions: [],
  allergies: [],
  budgetLevel: 'moderate',
  cookingTimePreference: 'quick',
  dailyWaterTargetMl: 2200,
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
  isDemoUser: true,
  createdAt: '2026-10-01T08:00:00.000Z',
  updatedAt: '2026-10-25T08:00:00.000Z',
};

// Formatted YYYY-MM-DD for today and recent days
export function getRelativeDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

export const INITIAL_DEMO_HABITS: HabitItem[] = [
  {
    id: 'habit_1',
    userId: DEMO_USER_ID,
    title: 'Uống 1 ly nước ấm khi vừa thức dậy',
    iconName: 'Droplets',
    category: 'hydration',
    categoryLabel: 'Uống nước',
    targetFrequency: 'daily',
    completedDates: [getRelativeDateString(-2), getRelativeDateString(-1), getRelativeDateString(0)],
  },
  {
    id: 'habit_2',
    userId: DEMO_USER_ID,
    title: 'Ăn thêm 1 phần rau xanh hoặc canh tươi',
    iconName: 'Salad',
    category: 'nutrition',
    categoryLabel: 'Dinh dưỡng',
    targetFrequency: 'daily',
    completedDates: [getRelativeDateString(-3), getRelativeDateString(-2), getRelativeDateString(-1), getRelativeDateString(0)],
  },
  {
    id: 'habit_3',
    userId: DEMO_USER_ID,
    title: 'Đi dạo nhẹ 15-20 phút thả lỏng',
    iconName: 'Footprints',
    category: 'movement',
    categoryLabel: 'Vận động',
    targetFrequency: 'daily',
    completedDates: [getRelativeDateString(-2), getRelativeDateString(0)],
  },
  {
    id: 'habit_4',
    userId: DEMO_USER_ID,
    title: 'Tắt màn hình điện thoại 30 phút trước khi ngủ',
    iconName: 'Moon',
    category: 'sleep',
    categoryLabel: 'Giấc ngủ',
    targetFrequency: 'daily',
    completedDates: [getRelativeDateString(-1)],
  },
];

export const INITIAL_DEMO_MEALS: MealLogEntry[] = [
  {
    id: 'meal_demo_1',
    userId: DEMO_USER_ID,
    date: getRelativeDateString(0),
    mealType: 'breakfast',
    foodId: 'food_pho_bo',
    foodName: 'Phở bò tái truyền thống',
    portionMultiplier: 1,
    portionLabel: '1 tô vừa',
    calories: 430,
    protein: 26,
    carbs: 58,
    fat: 10,
    fiber: 3.5,
    time: '07:30',
    notes: 'Thêm nhiều giá đỗ và ngò gai',
    source: 'Viện Dinh Dưỡng Quốc Gia',
  },
  {
    id: 'meal_demo_2',
    userId: DEMO_USER_ID,
    date: getRelativeDateString(0),
    mealType: 'lunch',
    foodId: 'food_com_gao_lut',
    foodName: 'Cơm gạo lứt + Đậu phụ sốt cà chua + Rau luộc',
    portionMultiplier: 1,
    portionLabel: '1 phần trưa văn phòng',
    calories: 460,
    protein: 22,
    carbs: 65,
    fat: 12,
    fiber: 8.5,
    time: '12:15',
    notes: 'Mang cơm từ nhà, ăn no vừa đủ',
    source: 'Công thức tự nấu',
  },
  {
    id: 'meal_demo_3',
    userId: DEMO_USER_ID,
    date: getRelativeDateString(0),
    mealType: 'snack',
    foodId: 'food_trai_cay_chuoi',
    foodName: 'Chuối tiêu chín tự nhiên',
    portionMultiplier: 1,
    portionLabel: '1 quả vừa',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    time: '16:00',
    notes: 'Ăn nhẹ trước khi tan làm',
    source: 'Viện Dinh Dưỡng Quốc Gia',
  },
];

export const INITIAL_DEMO_WATER: WaterLogEntry[] = [
  { id: 'w_1', userId: DEMO_USER_ID, date: getRelativeDateString(0), time: '07:00', amountMl: 300 },
  { id: 'w_2', userId: DEMO_USER_ID, date: getRelativeDateString(0), time: '09:30', amountMl: 350 },
  { id: 'w_3', userId: DEMO_USER_ID, date: getRelativeDateString(0), time: '11:45', amountMl: 250 },
  { id: 'w_4', userId: DEMO_USER_ID, date: getRelativeDateString(0), time: '14:20', amountMl: 350 },
  { id: 'w_5', userId: DEMO_USER_ID, date: getRelativeDateString(0), time: '16:40', amountMl: 250 },
];

export const INITIAL_DEMO_SLEEP: SleepLogEntry[] = [
  {
    id: 's_0',
    userId: DEMO_USER_ID,
    date: getRelativeDateString(0),
    bedTime: '23:15',
    wakeTime: '06:45',
    durationHours: 7.5,
    quality: 'good',
    notes: 'Ngủ sâu giấc, tỉnh dậy thấy nhẹ nhõm',
  },
  {
    id: 's_1',
    userId: DEMO_USER_ID,
    date: getRelativeDateString(-1),
    bedTime: '23:30',
    wakeTime: '06:30',
    durationHours: 7.0,
    quality: 'good',
    notes: 'Khá êm ái',
  },
  {
    id: 's_2',
    userId: DEMO_USER_ID,
    date: getRelativeDateString(-2),
    bedTime: '23:45',
    wakeTime: '06:30',
    durationHours: 6.8,
    quality: 'fair',
    notes: 'Hơi trằn trọc lúc đầu',
  },
];

export const INITIAL_DEMO_WORKOUTS: WorkoutLogEntry[] = [
  {
    id: 'wo_1',
    userId: DEMO_USER_ID,
    date: getRelativeDateString(0),
    activityType: 'walking',
    activityName: 'Đi bộ công viên buổi sáng',
    durationMinutes: 25,
    intensity: 'light',
    distanceKm: 1.8,
    steps: 3200,
    isManualSteps: true,
    caloriesBurned: 110,
    notes: 'Thời tiết mát mẻ, không khí trong lành',
    completedAt: '07:00',
  },
];

export const INITIAL_DEMO_WEIGHT_HISTORY: WeightLogEntry[] = [
  { id: 'wh_1', userId: DEMO_USER_ID, date: getRelativeDateString(-21), weightKg: 66.2, waistCm: 76, mood: 'neutral', notes: 'Bắt đầu hành trình' },
  { id: 'wh_2', userId: DEMO_USER_ID, date: getRelativeDateString(-14), weightKg: 65.7, waistCm: 75.5, mood: 'peaceful', notes: 'Cảm thấy người nhẹ hơn' },
  { id: 'wh_3', userId: DEMO_USER_ID, date: getRelativeDateString(-7), weightKg: 65.1, waistCm: 75.0, mood: 'happy', notes: 'Thói quen ăn rau đều đặn' },
  { id: 'wh_4', userId: DEMO_USER_ID, date: getRelativeDateString(-3), weightKg: 64.8, waistCm: 74.5, mood: 'happy', notes: 'Không hề thấy đói hay mệt' },
  { id: 'wh_5', userId: DEMO_USER_ID, date: getRelativeDateString(0), weightKg: 64.5, waistCm: 74.0, mood: 'happy', notes: 'Cân vào sáng sớm sau vệ sinh' },
];

export const INITIAL_DEMO_PLAN_MEALS: PlanMealItem[] = [
  {
    id: 'pm_1',
    dayOfWeek: 1, // Thứ 2
    mealType: 'breakfast',
    title: 'Phở gà ta xé sợi thanh đạm',
    portionNote: '1 tô vừa',
    calories: 395,
    protein: 28,
    carbs: 54,
    fat: 7.5,
    prepTimeMinutes: 15,
    source: 'Thực đơn mẫu Khỏe Mỗi Ngày',
    ingredients: [
      { name: 'Bánh phở tươi', amount: '140g', acquired: true },
      { name: 'Ức gà ta nạc', amount: '100g', acquired: true },
      { name: 'Hành hoa, rau mùi, chanh', amount: '1 mớ', acquired: false },
    ],
    instructions: [
      'Trần bánh phở qua nước sôi để ráo.',
      'Ức gà luộc chín tới với gừng hành, xé sợi mỏng.',
      'Chan nước dùng thanh ngọt, rắc hành ngò thái nhỏ và thưởng thức nóng.'
    ],
  },
  {
    id: 'pm_2',
    dayOfWeek: 1,
    mealType: 'lunch',
    title: 'Cơm gạo lứt + Cá kho tộ + Canh chua cá',
    portionNote: '1 chén cơm + 1 khúc cá + 1 tô canh',
    calories: 520,
    protein: 34,
    carbs: 62,
    fat: 14,
    prepTimeMinutes: 25,
    source: 'Mâm cơm truyền thống lành mạnh',
    ingredients: [
      { name: 'Gạo lứt đỏ', amount: '80g khô', acquired: true },
      { name: 'Cá hồi hoặc cá lóc', amount: '180g', acquired: false },
      { name: 'Dọc mùng, đậu bắp, cà chua', amount: '200g', acquired: false },
      { name: 'Nước mắm, ớt, tiêu', amount: 'Gia vị vừa đủ', acquired: true },
    ],
    instructions: [
      'Nấu cơm gạo lứt mềm thơm.',
      'Kho cá liu riu với tiêu ớt đến khi keo lại.',
      'Nấu nhanh canh chua thanh mát với me chín và rau quả tươi.'
    ],
  },
  {
    id: 'pm_3',
    dayOfWeek: 1,
    mealType: 'dinner',
    title: 'Gỏi cuốn tôm thịt + Canh rau ngót băm nạc',
    portionNote: '4 cuốn + 1 bát canh',
    calories: 380,
    protein: 26,
    carbs: 45,
    fat: 9,
    prepTimeMinutes: 20,
    source: 'Bữa tối nhẹ bụng',
    ingredients: [
      { name: 'Tôm sú tươi', amount: '8 con', acquired: false },
      { name: 'Thịt nạc vai heo', amount: '80g', acquired: true },
      { name: 'Rau thơm, xà lách, hẹ', amount: '1 rổ nhỏ', acquired: false },
      { name: 'Bánh tráng gạo', amount: '1 xấp', acquired: true },
    ],
    instructions: [
      'Luộc chín tôm và thịt nạc, thái lát mỏng.',
      'Nhúng bánh tráng ướt nhẹ, xếp rau, bún, thịt tôm cuộn tròn chặt tay.',
      'Ăn kèm nước chấm chua ngọt tỏi ớt nhẹ vị.'
    ],
  },
];
