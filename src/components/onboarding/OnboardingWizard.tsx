import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HealthConditionFlag, UserProfile } from '../../types';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ShieldCheck,
  HeartHandshake,
  AlertTriangle,
  Sparkles,
  HelpCircle
} from 'lucide-react';

const TOTAL_STEPS = 5;

export const OnboardingWizard: React.FC = () => {
  const { currentUser, updateProfile, setActiveScreen, showToast } = useApp();

  const [step, setStep] = useState(1);

  // Step 1: Basic Bio & Biological context
  const [displayName, setDisplayName] = useState(currentUser.displayName || '');
  const [age, setAge] = useState<number | ''>(currentUser.age || 28);
  const [biologicalSex, setBiologicalSex] = useState<UserProfile['biologicalSex']>(currentUser.biologicalSex || 'prefer_not_to_say');
  const [heightCm, setHeightCm] = useState<number | ''>(currentUser.heightCm || 165);
  const [currentWeightKg, setCurrentWeightKg] = useState<number | ''>(currentUser.currentWeightKg || 65);
  const [targetWeightKg, setTargetWeightKg] = useState<number | ''>(currentUser.targetWeightKg || '');

  // Step 2: Health Screening & Eligibility (Critical ethical requirement)
  const [healthConditions, setHealthConditions] = useState<HealthConditionFlag[]>(
    currentUser.healthConditions || ['none']
  );

  // Step 3: Movement & Lifestyle
  const [activityLevel, setActivityLevel] = useState<UserProfile['activityLevel']>(currentUser.activityLevel || 'light');
  const [workoutMinutes, setWorkoutMinutes] = useState(currentUser.workoutMinutesPerDay || 25);
  const [workoutLocations, setWorkoutLocations] = useState<('home' | 'outdoor' | 'gym')[]>(
    currentUser.workoutLocations || ['home']
  );
  const [availableEquipment, setAvailableEquipment] = useState<string[]>(
    currentUser.availableEquipment || ['Thảm tập']
  );

  // Step 4: Vietnamese Diet & Preferences
  const [primaryGoal, setPrimaryGoal] = useState<UserProfile['primaryGoal']>(currentUser.primaryGoal || 'manage_weight');
  const [dietaryPreference, setDietaryPreference] = useState(
    currentUser.dietaryPreference || 'Thực đơn gia đình Việt cân bằng'
  );
  const [allergiesInput, setAllergiesInput] = useState(currentUser.allergies.join(', ') || '');
  const [budgetLevel, setBudgetLevel] = useState<UserProfile['budgetLevel']>(currentUser.budgetLevel || 'moderate');
  const [cookingTimePreference, setCookingTimePreference] = useState<UserProfile['cookingTimePreference']>(
    currentUser.cookingTimePreference || 'quick'
  );

  // Step 5: Notifications & Commitments
  const [waterTarget, setWaterTarget] = useState(currentUser.dailyWaterTargetMl || 2000);

  const toggleHealthCondition = (flag: HealthConditionFlag) => {
    if (flag === 'none') {
      setHealthConditions(['none']);
      return;
    }
    const filtered = healthConditions.filter((c) => c !== 'none');
    if (filtered.includes(flag)) {
      const next = filtered.filter((c) => c !== flag);
      setHealthConditions(next.length === 0 ? ['none'] : next);
    } else {
      setHealthConditions([...filtered, flag]);
    }
  };

  const isSpecialConditionTriggered =
    healthConditions.length > 0 && !healthConditions.includes('none');

  const handleFinishWizard = () => {
    const allergyList = allergiesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateProfile({
      displayName: displayName.trim() || 'Bạn',
      age: age ? Number(age) : 28,
      biologicalSex,
      heightCm: Number(heightCm) || 165,
      currentWeightKg: Number(currentWeightKg) || 65,
      targetWeightKg: targetWeightKg ? Number(targetWeightKg) : undefined,
      healthConditions,
      isGentleHabitsMode: isSpecialConditionTriggered,
      activityLevel,
      workoutMinutesPerDay: Number(workoutMinutes) || 20,
      workoutLocations,
      availableEquipment,
      primaryGoal: isSpecialConditionTriggered ? 'build_habits' : primaryGoal,
      dietaryPreference,
      allergies: allergyList,
      budgetLevel,
      cookingTimePreference,
      dailyWaterTargetMl: Number(waterTarget) || 2000,
    });

    showToast('Hồ sơ của bạn đã được thiết lập thành công!');
    setActiveScreen('home');
  };

  return (
    <div className="max-w-xl mx-auto py-6 px-4 pb-24">
      {/* Progress Bar */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-slate-400">
          <span>Bước {step} / {TOTAL_STEPS}</span>
          <span>
            {step === 1
              ? 'Thông tin cơ bản'
              : step === 2
              ? 'An toàn sức khỏe'
              : step === 3
              ? 'Vận động & Thể lực'
              : step === 4
              ? 'Ẩm thực & Thói quen'
              : 'Xác nhận & Bắt đầu'}
          </span>
        </div>
        <div className="w-full bg-stone-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Container Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-6">
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Chào bạn, hãy giới thiệu đôi nét nhé!
              </h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                Các thông tin này giúp ứng dụng ước tính nhu cầu năng lượng nền (BMR) khoa học nhất.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Tên hiển thị hoặc biệt danh thân thuộc:
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Minh Anh, Hà My, Tuấn Anh..."
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                  Tuổi:
                </label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 text-sm font-semibold tabular-nums"
                />
              </div>

              <div>
                <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                  Giới tính sinh học (Tùy chọn):
                </label>
                <select
                  value={biologicalSex}
                  onChange={(e) => setBiologicalSex(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 text-xs font-medium"
                >
                  <option value="female">Nữ</option>
                  <option value="male">Nam</option>
                  <option value="prefer_not_to_say">Bỏ qua / Không cung cấp</option>
                </select>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 dark:text-slate-500 italic">
              * Giới tính sinh học chỉ dùng cho công thức ước tính chuyển hóa cơ sở BMR. Nếu bỏ qua, ứng dụng sẽ dùng trung vị cân bằng an toàn.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                  Chiều cao (cm):
                </label>
                <input
                  type="number"
                  required
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 text-sm font-semibold tabular-nums"
                />
              </div>

              <div>
                <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                  Cân nặng hiện tại (kg):
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={currentWeightKg}
                  onChange={(e) => setCurrentWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 text-sm font-semibold tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-600 dark:text-slate-400 font-semibold text-xs block mb-1">
                Cân nặng mục tiêu (kg, tùy chọn và không bắt buộc):
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="Ví dụ: 62 (để trống nếu chỉ muốn duy trì hoặc xây dựng thói quen)"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 text-sm tabular-nums"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Ethical Health Screening */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Kiểm tra điều kiện an toàn sức khỏe</span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-1 leading-relaxed">
                Khỏe Mỗi Ngày cam kết chăm sóc sức khỏe có đạo đức. Với các trường hợp đặc biệt, ứng dụng sẽ <strong>không tự tạo thâm hụt năng lượng hay mục tiêu giảm cân</strong> mà chuyển sang theo dõi thói quen lành mạnh.
              </p>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              {[
                { id: 'under_18', label: 'Dưới 18 tuổi (Giai đoạn cơ thể đang phát triển)' },
                { id: 'pregnant_or_nursing', label: 'Đang mang thai hoặc đang trong thời kỳ cho con bú' },
                { id: 'eating_disorder_history', label: 'Có tiền sử rối loạn ăn uống (chán ăn, cuồng ăn)' },
                { id: 'chronic_medical_condition', label: 'Có bệnh lý đặc thù hoặc đang điều trị cần chế độ dinh dưỡng riêng' },
                { id: 'none', label: 'Không có các trường hợp trên (Sức khỏe ổn định)' },
              ].map((cond) => {
                const isSelected = healthConditions.includes(cond.id as HealthConditionFlag);
                return (
                  <button
                    key={cond.id}
                    type="button"
                    onClick={() => toggleHealthCondition(cond.id as HealthConditionFlag)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-900 dark:text-emerald-200'
                        : 'bg-stone-50 dark:bg-slate-850 border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="font-medium pr-2">{cond.label}</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {isSpecialConditionTriggered && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  <span>Ứng dụng sẽ đồng hành cùng bạn ở Chế độ Thói quen Tự nhiên</span>
                </div>
                <p className="leading-relaxed">
                  Chúng tôi sẽ ưu tiên nhắc nhở bạn uống đủ nước, nghỉ ngơi, ăn đủ chất và vận động thư thái, không đếm calo hay đặt mục tiêu giảm cân ép buộc.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Movement & Activity */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Thói quen vận động thường ngày
              </h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                Chọn mức độ phù hợp với thực tế cuộc sống, không cần cố gắng quá sức.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { id: 'sedentary', label: 'Ít vận động', desc: 'Chủ yếu ngồi bàn làm việc, lái xe, ít khi đi bộ nhiều' },
                { id: 'light', label: 'Vận động nhẹ', desc: 'Đi bộ dạo mát 1-3 ngày/tuần, làm việc nhà nhẹ nhàng' },
                { id: 'moderate', label: 'Vừa phải', desc: 'Chạy bộ, đạp xe, yoga hoặc bơi 3-5 buổi/tuần' },
                { id: 'very_active', label: 'Năng động', desc: 'Vận động cường độ cao mỗi ngày hoặc công việc nặng' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setActivityLevel(lvl.id as any)}
                  className={`w-full p-3 rounded-2xl border text-left transition-colors ${
                    activityLevel === lvl.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600'
                      : 'bg-stone-50 dark:bg-slate-850 border-stone-200 dark:border-slate-700'
                  }`}
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">
                    {lvl.label}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-slate-400 mt-0.5 block">
                    {lvl.desc}
                  </span>
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Thời gian bạn có thể dành cho vận động mỗi ngày:
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
                {[15, 25, 40, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setWorkoutMinutes(mins)}
                    className={`py-2 rounded-xl transition-colors ${
                      workoutMinutes === mins
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-stone-100 dark:bg-slate-700 text-stone-700 dark:text-slate-300'
                    }`}
                  >
                    {mins} phút
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Vietnamese Diet & Nutrition Goals */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Khẩu vị & Dinh dưỡng món Việt
              </h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                Cơm nhà, bún phở hay các món cuốn đều có thể thưởng thức lành mạnh.
              </p>
            </div>

            {!isSpecialConditionTriggered && (
              <div>
                <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                  Mục tiêu dinh dưỡng cốt lõi:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'manage_weight', label: 'Quản lý cân nặng bền vững' },
                    { id: 'maintain_weight', label: 'Duy trì cân nặng hiện tại' },
                    { id: 'build_habits', label: 'Chăm sóc thói quen sống khỏe' },
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setPrimaryGoal(goal.id as any)}
                      className={`p-3 rounded-2xl border text-center font-medium transition-colors ${
                        primaryGoal === goal.id
                          ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                          : 'bg-stone-50 dark:bg-slate-850 border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300'
                      }`}
                    >
                      {goal.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Dị ứng thực phẩm (nếu có, cách nhau bởi dấu phẩy):
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Hải sản, đậu phộng, sữa bò, trứng..."
                value={allergiesInput}
                onChange={(e) => setAllergiesInput(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                  Ngân sách đi chợ:
                </label>
                <select
                  value={budgetLevel}
                  onChange={(e) => setBudgetLevel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 font-medium"
                >
                  <option value="economical">Tiết kiệm, bình dân</option>
                  <option value="moderate">Vừa phải, đa dạng</option>
                  <option value="flexible">Thoải mái</option>
                </select>
              </div>

              <div>
                <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                  Thời gian chuẩn bị nấu nướng:
                </label>
                <select
                  value={cookingTimePreference}
                  onChange={(e) => setCookingTimePreference(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 font-medium"
                >
                  <option value="quick">Nấu nhanh dưới 20 phút</option>
                  <option value="moderate">20 - 40 phút</option>
                  <option value="enjoy_cooking">Thích nấu nướng cầu kỳ</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Final Review & Commitments */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>Bạn đã sẵn sàng cho hành trình mới!</span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                Tất cả thông tin đã được ghi nhận. Bạn có thể thay đổi bất kỳ lúc nào tại mục Cá nhân.
              </p>
            </div>

            <div className="p-4 bg-stone-50 dark:bg-slate-850 rounded-2xl border border-stone-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Tên:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{displayName || 'Bạn'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Chiều cao / Cân nặng:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                  {heightCm}cm · {currentWeightKg}kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Chế độ vận hành:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {isSpecialConditionTriggered ? 'Chăm sóc thói quen lành mạnh' : 'Quản lý cân nặng tích cực'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Mục tiêu nước mỗi ngày:</span>
                <span className="font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                  {waterTarget} ml
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed text-center">
              Khỏe Mỗi Ngày đồng hành cùng bạn bằng sự tôn trọng, kiên nhẫn và khoa học.
            </p>
          </div>
        )}

        {/* Navigation Step Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-slate-700">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveScreen('home')}
              className="text-xs font-semibold text-stone-400 hover:text-stone-600"
            >
              Để sau
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm ml-auto"
            >
              <span>Tiếp theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishWizard}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm ml-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Bắt đầu dùng ứng dụng</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
