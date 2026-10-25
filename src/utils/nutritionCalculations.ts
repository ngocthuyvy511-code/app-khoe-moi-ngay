import { UserProfile } from '../types';

/**
 * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation.
 * If biological sex is not specified, uses a balanced neutral midpoint.
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, biologicalSex?: 'female' | 'male' | 'prefer_not_to_say'): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 1500;

  const base = (10 * weightKg) + (6.25 * heightCm) - (5 * age);

  if (biologicalSex === 'male') {
    return Math.round(base + 5);
  } else if (biologicalSex === 'female') {
    return Math.round(base - 161);
  } else {
    // Balanced neutral approximation
    return Math.round(base - 78);
  }
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE).
 */
export function calculateTDEE(bmr: number, activityLevel: UserProfile['activityLevel']): number {
  const multipliers: Record<UserProfile['activityLevel'], number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
  };
  const factor = multipliers[activityLevel] || 1.2;
  return Math.round(bmr * factor);
}

/**
 * Calculates Body Mass Index (BMI) and contextual disclaimer.
 */
export function calculateBMI(weightKg: number, heightCm: number): {
  bmi: number;
  category: string;
  colorClass: string;
  disclaimer: string;
} {
  if (weightKg <= 0 || heightCm <= 0) {
    return {
      bmi: 0,
      category: 'Chưa đủ dữ liệu',
      colorClass: 'text-slate-500',
      disclaimer: 'Vui lòng cập nhật đầy đủ chiều cao và cân nặng để tính toán.',
    };
  }

  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  let category = 'Bình thường';
  let colorClass = 'text-emerald-700';

  // Asian-specific BMI cutoffs (WHO/IDI & WPRO reference)
  if (bmi < 18.5) {
    category = 'Cân nặng thấp';
    colorClass = 'text-amber-700';
  } else if (bmi < 23) {
    category = 'Cân nặng hợp lý';
    colorClass = 'text-emerald-700';
  } else if (bmi < 25) {
    category = 'Tiền thừa cân';
    colorClass = 'text-amber-700';
  } else {
    category = 'Thừa cân / Cần chú ý';
    colorClass = 'text-orange-700';
  }

  const disclaimer = 'Lưu ý y khoa: Chỉ số BMI chỉ phản ánh tương quan cân nặng - chiều cao nói chung và KHÔNG phân biệt được tỷ lệ cơ bắp, mỡ nội tạng, nước hay mật độ xương. Sức khỏe thực sự nằm ở năng lượng sống, thói quen ăn uống lành mạnh và tinh thần thoải mái.';

  return { bmi, category, colorClass, disclaimer };
}

/**
 * Calculates recommended daily water in ml.
 */
export function calculateDailyWaterTarget(weightKg: number, activityLevel: UserProfile['activityLevel']): number {
  if (weightKg <= 0) return 2000;
  const baseMl = weightKg * 33; // 33ml per kg
  const bonus = activityLevel === 'sedentary' ? 0 : activityLevel === 'light' ? 250 : activityLevel === 'moderate' ? 500 : 750;
  return Math.round((baseMl + bonus) / 100) * 100; // round to nearest 100ml
}

/**
 * Unit conversion helpers (preserving raw SI storage)
 */
export function formatWeight(weightKg: number, unit: 'kg' | 'lb'): string {
  if (!weightKg) return '—';
  if (unit === 'lb') {
    return `${(weightKg * 2.20462).toFixed(1)} lb`;
  }
  return `${weightKg.toFixed(1)} kg`;
}

export function formatHeight(heightCm: number, unit: 'cm' | 'ft'): string {
  if (!heightCm) return '—';
  if (unit === 'ft') {
    const totalInches = heightCm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}ft ${inches}in`;
  }
  return `${heightCm} cm`;
}

export function formatWater(ml: number, unit: 'ml' | 'oz'): string {
  if (unit === 'oz') {
    return `${(ml / 29.5735).toFixed(0)} fl oz`;
  }
  return `${ml} ml`;
}

/**
 * Accurately calculate sleep duration across midnight.
 */
export function calculateSleepDuration(bedTime: string, wakeTime: string): number {
  if (!bedTime || !wakeTime) return 0;
  const [bedH, bedM] = bedTime.split(':').map(Number);
  const [wakeH, wakeM] = wakeTime.split(':').map(Number);

  let bedMinutes = bedH * 60 + bedM;
  let wakeMinutes = wakeH * 60 + wakeM;

  if (wakeMinutes < bedMinutes) {
    wakeMinutes += 24 * 60; // Slept past midnight
  }

  const durationMinutes = wakeMinutes - bedMinutes;
  return Number((durationMinutes / 60).toFixed(1));
}

/**
 * Strip Vietnamese diacritics for flexible fuzzy searching.
 */
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}
