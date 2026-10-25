import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Settings,
  ShieldCheck,
  Download,
  Trash2,
  LogOut,
  Bell,
  Eye,
  Type,
  CheckCircle2,
  Sparkles,
  Sliders,
  Database
} from 'lucide-react';
import { exportUserDataAsJSON } from '../../utils/storage';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    signOutUser,
    clearMyData,
    setActiveScreen,
    showToast,
  } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-4">
        <p className="text-sm text-stone-600 dark:text-slate-300">
          Bạn chưa đăng nhập. Vui lòng đăng nhập bằng tài khoản Google để xem hồ sơ và đồng bộ dữ liệu.
        </p>
        <button
          onClick={() => setActiveScreen('auth')}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          Đến trang Đăng nhập Google
        </button>
      </div>
    );
  }

  // Profile edit form state
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [age, setAge] = useState<number | ''>(currentUser.age || 28);
  const [heightCm, setHeightCm] = useState<number | ''>(currentUser.heightCm || 165);
  const [targetWeightKg, setTargetWeightKg] = useState<number | ''>(currentUser.targetWeightKg || '');
  const [activityLevel, setActivityLevel] = useState(currentUser.activityLevel);
  const [primaryGoal, setPrimaryGoal] = useState(currentUser.primaryGoal);

  // Settings
  const [preferredWeightUnit, setPreferredWeightUnit] = useState(currentUser.preferredWeightUnit);
  const [preferredHeightUnit, setPreferredHeightUnit] = useState(currentUser.preferredHeightUnit);
  const [preferredWaterUnit, setPreferredWaterUnit] = useState(currentUser.preferredWaterUnit);
  const [fontSizePreference, setFontSizePreference] = useState(currentUser.fontSizePreference);
  const [enableCaloriesDisplay, setEnableCaloriesDisplay] = useState(currentUser.enableCaloriesDisplay);
  const [enableWeightDisplay, setEnableWeightDisplay] = useState(currentUser.enableWeightDisplay);

  // Notifications
  const [mealReminders, setMealReminders] = useState(currentUser.notifications.mealReminders);
  const [waterReminders, setWaterReminders] = useState(currentUser.notifications.waterReminders);
  const [workoutReminders, setWorkoutReminders] = useState(currentUser.notifications.workoutReminders);
  const [sleepReminders, setSleepReminders] = useState(currentUser.notifications.sleepReminders);
  const [quietHoursStart, setQuietHoursStart] = useState(currentUser.notifications.quietHoursStart);
  const [quietHoursEnd, setQuietHoursEnd] = useState(currentUser.notifications.quietHoursEnd);

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      displayName: displayName.trim() || 'Người dùng',
      age: age ? Number(age) : undefined,
      heightCm: Number(heightCm) || 165,
      targetWeightKg: targetWeightKg ? Number(targetWeightKg) : undefined,
      activityLevel,
      primaryGoal,
      preferredWeightUnit,
      preferredHeightUnit,
      preferredWaterUnit,
      fontSizePreference,
      enableCaloriesDisplay,
      enableWeightDisplay,
      notifications: {
        ...currentUser.notifications,
        mealReminders,
        waterReminders,
        workoutReminders,
        sleepReminders,
        quietHoursStart,
        quietHoursEnd,
      },
    });
    showToast('Đã lưu các thay đổi hồ sơ & cài đặt.');
  };

  const handleExportData = () => {
    const jsonStr = exportUserDataAsJSON(currentUser.id);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `khoe_moi_ngay_data_${currentUser.id}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Đã tải xuống toàn bộ dữ liệu cá nhân của bạn.');
  };

  return (
    <div className="space-y-6 pb-24 pt-2 max-w-3xl mx-auto">
      {/* User Header Profile Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-bold text-xl flex items-center justify-center shadow-sm shadow-emerald-600/30 shrink-0">
              {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}

          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              {currentUser.displayName}
            </h1>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              {currentUser.email}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-lg font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Tài khoản Google đã kết nối · Không có tài khoản ảo</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveScreen('onboarding')}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-xl transition-colors"
          >
            Làm lại bảng hỏi
          </button>

          <button
            onClick={signOutUser}
            className="px-3 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* 1. Basic Health Info */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-stone-100 dark:border-slate-700 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Thông tin cá nhân & Thể chất</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                Tên hiển thị:
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 font-medium"
              />
            </div>

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
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 font-medium tabular-nums"
              />
            </div>

            <div>
              <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                Chiều cao (cm):
              </label>
              <input
                type="number"
                min="50"
                max="250"
                required
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 font-medium tabular-nums"
              />
            </div>

            <div>
              <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                Cân nặng mục tiêu (kg, tuỳ chọn):
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="Ví dụ: 58"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 font-medium tabular-nums"
              />
            </div>

            <div>
              <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                Mức độ vận động thường ngày:
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 font-medium"
              >
                <option value="sedentary">Ít vận động (chủ yếu ngồi bàn làm việc)</option>
                <option value="light">Vận động nhẹ (đi bộ 1-3 ngày/tuần)</option>
                <option value="moderate">Vừa phải (tập thể thao 3-5 ngày/tuần)</option>
                <option value="very_active">Năng động (vận động hàng ngày hoặc lao động thể lực)</option>
              </select>
            </div>

            <div>
              <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                Mục tiêu trọng tâm:
              </label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 font-medium"
              >
                <option value="manage_weight">Quản lý cân nặng bền vững</option>
                <option value="maintain_weight">Duy trì cân nặng hiện có</option>
                <option value="build_habits">Xây dựng thói quen ăn uống & vận động khỏe</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Units & Display Preferences */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-stone-100 dark:border-slate-700 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>Tùy chọn hiển thị & Đơn vị đo</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                Đơn vị cân nặng:
              </label>
              <select
                value={preferredWeightUnit}
                onChange={(e) => setPreferredWeightUnit(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 font-medium"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="lb">Pounds (lb)</option>
              </select>
            </div>

            <div>
              <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                Đơn vị chiều cao:
              </label>
              <select
                value={preferredHeightUnit}
                onChange={(e) => setPreferredHeightUnit(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 font-medium"
              >
                <option value="cm">Centimet (cm)</option>
                <option value="ft">Feet & Inches (ft/in)</option>
              </select>
            </div>

            <div>
              <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                Đơn vị nước uống:
              </label>
              <select
                value={preferredWaterUnit}
                onChange={(e) => setPreferredWaterUnit(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 font-medium"
              >
                <option value="ml">Mililit (ml)</option>
                <option value="oz">Fluid Ounce (fl oz)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <label className="flex items-center justify-between p-3 bg-stone-50 dark:bg-slate-800/80 rounded-2xl cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  Hiển thị thông tin Calo trong nhật ký & trang chủ
                </span>
                <span className="text-[11px] text-stone-500 dark:text-slate-400 block">
                  Tắt tính năng này nếu bạn muốn dùng Chế độ tập trung vào thói quen (không đếm calo)
                </span>
              </div>
              <input
                type="checkbox"
                checked={enableCaloriesDisplay}
                onChange={(e) => setEnableCaloriesDisplay(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-stone-50 dark:bg-slate-800/80 rounded-2xl cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  Cỡ chữ lớn (Tiếp cận dễ đọc cho người lớn tuổi)
                </span>
                <span className="text-[11px] text-stone-500 dark:text-slate-400 block">
                  Tăng kích thước chữ để mắt thư giãn và đọc rõ ràng hơn
                </span>
              </div>
              <input
                type="checkbox"
                checked={fontSizePreference === 'large'}
                onChange={(e) => setFontSizePreference(e.target.checked ? 'large' : 'normal')}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>

        {/* 3. Notifications & Quiet Hours */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-stone-100 dark:border-slate-700 flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            <span>Nhắc nhở & Giờ yên lặng</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-2 p-2.5 bg-stone-50 dark:bg-slate-800 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={waterReminders}
                onChange={(e) => setWaterReminders(e.target.checked)}
                className="text-emerald-600 rounded"
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">Nhắc uống nước theo giờ</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 bg-stone-50 dark:bg-slate-800 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={mealReminders}
                onChange={(e) => setMealReminders(e.target.checked)}
                className="text-emerald-600 rounded"
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">Nhắc ghi nhận bữa ăn</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 bg-stone-50 dark:bg-slate-800 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={workoutReminders}
                onChange={(e) => setWorkoutReminders(e.target.checked)}
                className="text-emerald-600 rounded"
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">Nhắc vận động nhẹ nhàng</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 bg-stone-50 dark:bg-slate-800 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={sleepReminders}
                onChange={(e) => setSleepReminders(e.target.checked)}
                className="text-emerald-600 rounded"
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">Nhắc thư giãn chuẩn bị ngủ</span>
            </label>
          </div>

          <div className="pt-2 text-xs">
            <span className="font-semibold text-stone-600 dark:text-slate-400 block mb-1">
              Khung giờ yên lặng (Không gửi thông báo làm phiền):
            </span>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={quietHoursStart}
                onChange={(e) => setQuietHoursStart(e.target.value)}
                className="px-3 py-1.5 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 font-medium"
              />
              <span className="text-stone-400">đến</span>
              <input
                type="time"
                value={quietHoursEnd}
                onChange={(e) => setQuietHoursEnd(e.target.value)}
                className="px-3 py-1.5 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-bold transition-colors shadow-sm"
        >
          Lưu cài đặt vào Firebase
        </button>
      </form>

      {/* 4. Privacy, Data Export */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-stone-100 dark:border-slate-700 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Quyền riêng tư & Quản lý dữ liệu</span>
        </h2>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-stone-50 dark:bg-slate-850 rounded-2xl">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Xuất toàn bộ dữ liệu cá nhân (JSON)
              </span>
              <span className="text-[11px] text-stone-500 dark:text-slate-400">
                Tải về nhật ký bữa ăn, nước, vận động, cân nặng và thói quen của bạn
              </span>
            </div>
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất dữ liệu</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/40">
            <div>
              <span className="text-xs font-bold text-rose-900 dark:text-rose-200 block">
                Xóa sạch dữ liệu tài khoản
              </span>
              <span className="text-[11px] text-rose-700/80 dark:text-rose-300/80">
                Xóa toàn bộ nhật ký ăn uống, cân nặng và đăng xuất khỏi thiết bị này
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu trên thiết bị này không?')) {
                  clearMyData();
                }
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors self-start sm:self-auto flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa dữ liệu</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-stone-50 dark:bg-slate-850 rounded-2xl">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Chính sách bảo vệ dữ liệu & AI
              </span>
              <span className="text-[11px] text-stone-500 dark:text-slate-400">
                Cam kết không bán dữ liệu, toàn bộ dữ liệu thuộc sở hữu của bạn
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors self-start sm:self-auto"
            >
              Xem chính sách
            </button>
          </div>
        </div>
      </div>

      {/* Privacy modal */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Chính sách Quyền riêng tư & Bảo vệ Dữ liệu
              </h3>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="p-1 text-stone-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <p>
              Ứng dụng <strong>Khỏe Mỗi Ngày</strong> tuân thủ tiêu chuẩn bảo vệ quyền riêng tư người dùng:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1">
              <li>Xác thực trực tiếp bằng tài khoản Google thực. Tuyệt đối không tạo tài khoản ảo.</li>
              <li>Dữ liệu dinh dưỡng, cân nặng, bài tập được lưu trữ an toàn riêng biệt cho tài khoản của bạn.</li>
              <li>Không bán, chia sẻ hoặc rò rỉ dữ liệu cá nhân ra bên ngoài.</li>
            </ul>

            <button
              onClick={() => setIsPrivacyModalOpen(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors mt-2"
            >
              Tôi đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
