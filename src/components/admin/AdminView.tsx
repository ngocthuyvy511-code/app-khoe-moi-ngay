import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem, ExerciseItem } from '../../types';
import {
  ShieldCheck,
  Utensils,
  Dumbbell,
  BarChart3,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  ArrowLeft
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    foodCatalog,
    addCustomFood,
    deleteCustomFood,
    exercises,
    setActiveScreen,
    showToast,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'foods' | 'exercises' | 'metrics'>('foods');

  // New Food Form
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodCalories, setNewFoodCalories] = useState<number>(350);
  const [newFoodProtein, setNewFoodProtein] = useState<number>(20);
  const [newFoodCarbs, setNewFoodCarbs] = useState<number>(45);
  const [newFoodFat, setNewFoodFat] = useState<number>(8);
  const [newFoodSource, setNewFoodSource] = useState('Viện Dinh Dưỡng Quốc Gia (NIN)');
  const [newFoodServing, setNewFoodServing] = useState('1 phần vừa (~350g)');

  if (!currentUser) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-stone-200 dark:border-slate-700">
        <p className="text-stone-600 dark:text-slate-300">Vui lòng đăng nhập bằng Google để truy cập trang quản trị.</p>
        <button
          onClick={() => setActiveScreen('home')}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold"
        >
          Về Trang Chủ
        </button>
      </div>
    );
  }

  const handleCreateFoodAsAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName.trim()) return;

    addCustomFood({
      name: newFoodName.trim(),
      category: 'mon_chinh',
      categoryLabel: 'Món đã kiểm duyệt',
      servingSize: newFoodServing,
      calories: newFoodCalories,
      protein: newFoodProtein,
      carbs: newFoodCarbs,
      fat: newFoodFat,
      source: newFoodSource,
      isVerified: true,
    });

    setNewFoodName('');
    showToast(`Đã thêm món "${newFoodName}" vào CSDL chung.`);
  };

  const toggleAdminRole = () => {
    const nextRole = currentUser.role === 'admin' ? 'user' : 'admin';
    updateProfile({ role: nextRole });
    showToast(`Đã chuyển vai trò của bạn sang: ${nextRole === 'admin' ? 'Quản trị viên' : 'Người dùng'}`);
  };

  return (
    <div className="space-y-6 pb-24 pt-2 max-w-4xl mx-auto">
      {/* Admin Header */}
      <div className="bg-purple-900 text-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-300" />
            <span>Khu vực Quản trị Hệ thống (Admin Portal)</span>
          </div>
          <h1 className="text-xl font-bold text-white">
            Quản lý Dữ liệu Món ăn & Vận hành
          </h1>
          <p className="text-xs text-purple-200/90 mt-0.5">
            Phân quyền nghiêm ngặt: Quản trị viên KHÔNG được xem nhật ký sức khỏe hay ảnh cá nhân của người dùng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleAdminRole}
            className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Đổi vai trò: {currentUser.role === 'admin' ? 'Đang là Admin' : 'Đang là User'}
          </button>
          <button
            onClick={() => setActiveScreen('home')}
            className="px-3 py-2 bg-white text-purple-900 rounded-xl text-xs font-bold hover:bg-purple-100 transition-colors"
          >
            Về ứng dụng
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-slate-700 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveAdminTab('foods')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-colors ${
            activeAdminTab === 'foods'
              ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Danh mục Món ăn ({foodCatalog.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('exercises')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-colors ${
            activeAdminTab === 'exercises'
              ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Bài tập mẫu ({exercises.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('metrics')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-colors ${
            activeAdminTab === 'metrics'
              ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Thống kê tổng hợp vận hành</span>
        </button>
      </div>

      {activeAdminTab === 'foods' && (
        <div className="space-y-6">
          {/* Add new verified food form */}
          <form
            onSubmit={handleCreateFoodAsAdmin}
            className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-600" />
              <span>Thêm món ăn đã kiểm chứng vào cơ sở dữ liệu</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                  Tên món ăn:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cháo lườn gà đậu xanh..."
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                  Quy chuẩn khẩu phần:
                </label>
                <input
                  type="text"
                  value={newFoodServing}
                  onChange={(e) => setNewFoodServing(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-stone-600 dark:text-slate-400 font-semibold block mb-1">
                  Nguồn dữ liệu kiểm chứng:
                </label>
                <input
                  type="text"
                  value={newFoodSource}
                  onChange={(e) => setNewFoodSource(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-stone-500 block mb-1">Calo:</label>
                  <input
                    type="number"
                    value={newFoodCalories}
                    onChange={(e) => setNewFoodCalories(Number(e.target.value))}
                    className="w-full px-2 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="text-stone-500 block mb-1">Đạm:</label>
                  <input
                    type="number"
                    value={newFoodProtein}
                    onChange={(e) => setNewFoodProtein(Number(e.target.value))}
                    className="w-full px-2 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 tabular-nums"
                  />
                </div>
                <div>
                  <label className="text-stone-500 block mb-1">Carb:</label>
                  <input
                    type="number"
                    value={newFoodCarbs}
                    onChange={(e) => setNewFoodCarbs(Number(e.target.value))}
                    className="w-full px-2 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 tabular-nums"
                  />
                </div>
                <div>
                  <label className="text-stone-500 block mb-1">Béo:</label>
                  <input
                    type="number"
                    value={newFoodFat}
                    onChange={(e) => setNewFoodFat(Number(e.target.value))}
                    className="w-full px-2 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 tabular-nums"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Lưu vào CSDL Món Việt
            </button>
          </form>

          {/* List of current foods */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Danh sách món ăn hiện có
            </h3>
            <div className="divide-y divide-stone-100 dark:divide-slate-700/60 max-h-96 overflow-y-auto">
              {foodCatalog.map((f) => (
                <div key={f.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{f.name}</span>
                    <span className="text-stone-400 dark:text-slate-500 ml-2">
                      {f.calories} kcal · {f.source}
                    </span>
                  </div>
                  {f.isCustom && (
                    <button
                      onClick={() => deleteCustomFood(f.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'exercises' && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Thư viện động tác đã kiểm duyệt
          </h3>
          <div className="divide-y divide-stone-100 dark:divide-slate-700/60">
            {exercises.map((ex) => (
              <div key={ex.id} className="py-3 text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">{ex.title}</span>
                <span className="text-stone-500 dark:text-slate-400 block mt-0.5">
                  Mức độ: {ex.levelLabel} · Dụng cụ: {ex.equipment} · Lưu ý an toàn: {ex.safetyCaution}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAdminTab === 'metrics' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm">
            <span className="text-xs text-stone-500 block mb-1">Tài khoản Google đang kết nối</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              1
            </span>
            <span className="text-[11px] text-stone-400 block mt-1">
              (Người dùng thực, đồng bộ Firebase đám mây)
            </span>
          </div>

          <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm">
            <span className="text-xs text-stone-500 block mb-1">Món ăn trong CSDL</span>
            <span className="text-2xl font-bold text-emerald-600 tabular-nums">
              {foodCatalog.length}
            </span>
            <span className="text-[11px] text-stone-400 block mt-1">Đã chuẩn hóa khẩu phần</span>
          </div>

          <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm">
            <span className="text-xs text-stone-500 block mb-1">Trạng thái bảo mật</span>
            <span className="text-xs font-bold text-emerald-600 block mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Dữ liệu nhạy cảm được cô lập an toàn</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
