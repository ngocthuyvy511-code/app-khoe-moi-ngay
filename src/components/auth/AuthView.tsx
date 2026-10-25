import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const { allUsers, switchUser, loginAsDemo, registerNewUser, setActiveScreen, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const validateEmail = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateEmail(email)) {
      setAuthError('Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Mật khẩu cần tối thiểu 6 ký tự.');
      return;
    }

    const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      switchUser(found.id);
      setActiveScreen('home');
    } else {
      // Auto register or inform
      setAuthError('Không tìm thấy tài khoản với email này. Bạn có thể chọn "Đăng ký tài khoản mới".');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!displayName.trim()) {
      setAuthError('Vui lòng nhập tên hiển thị.');
      return;
    }

    if (!validateEmail(email)) {
      setAuthError('Địa chỉ email không hợp lệ.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Mật khẩu bảo vệ cần có từ 6 ký tự trở lên.');
      return;
    }

    const existing = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setAuthError('Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.');
      return;
    }

    registerNewUser(email.trim(), displayName.trim(), password);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setAuthError('Vui lòng nhập email hợp lệ để nhận liên kết đặt lại mật khẩu.');
      return;
    }
    showToast(`Đã gửi liên kết đặt lại mật khẩu đến "${email}". Vui lòng kiểm tra hộp thư.`);
    setMode('login');
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 pb-24">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-6">
        {/* Brand Lockup */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-sm shadow-emerald-600/30">
            KM
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {mode === 'login'
              ? 'Đăng nhập Khỏe Mỗi Ngày'
              : mode === 'register'
              ? 'Đăng ký tài khoản mới'
              : 'Khôi phục mật khẩu'}
          </h1>
          <p className="text-xs text-stone-500 dark:text-slate-400">
            Ứng dụng quản lý cân nặng và dinh dưỡng món Việt bền vững
          </p>
        </div>

        {/* Demo Mode Quick Access Button (Essential requirement) */}
        <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Trải nghiệm nhanh không cần đăng ký:</span>
          </div>
          <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
            Dùng thử ngay với dữ liệu minh họa phong phú (thực đơn phở bò, cơm gạo lứt, nhật ký nước và biểu đồ mẫu).
          </p>
          <button
            type="button"
            onClick={loginAsDemo}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            Vào ngay chế độ Dùng thử (Minh họa)
          </button>
        </div>

        {authError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Email:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="ten@vidu.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 text-xs sm:text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-600 dark:text-slate-400">
                  Mật khẩu:
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] font-semibold text-emerald-600 hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 text-xs sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm"
            >
              Đăng nhập tài khoản
            </button>

            <div className="text-center text-xs text-stone-500 pt-1">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-emerald-600 hover:underline"
              >
                Đăng ký ngay
              </button>
            </div>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Tên hiển thị:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Nam"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Email:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="ten@vidu.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Mật khẩu:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 text-xs sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm"
            >
              Tạo tài khoản & Bắt đầu thiết lập
            </button>

            <div className="text-center text-xs text-stone-500 pt-1">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-emerald-600 hover:underline"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Nhập email đã đăng ký của bạn. Chúng tôi sẽ gửi hướng dẫn thiết lập lại mật khẩu an toàn.
            </p>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Email:
              </label>
              <input
                type="email"
                required
                placeholder="ten@vidu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-850 rounded-xl border border-stone-200 dark:border-slate-700 text-xs sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Gửi liên kết đặt lại mật khẩu
            </button>

            <div className="text-center text-xs text-stone-500 pt-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-emerald-600 hover:underline"
              >
                Quay lại đăng nhập
              </button>
            </div>
          </form>
        )}

        {/* Existing Accounts Quick Switcher (for multi-account testing) */}
        {allUsers.length > 1 && (
          <div className="pt-4 border-t border-stone-100 dark:border-slate-700">
            <span className="text-[11px] font-semibold text-stone-400 dark:text-slate-500 uppercase block mb-2">
              Các tài khoản đã lưu trên trình duyệt này:
            </span>
            <div className="space-y-1.5">
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    setActiveScreen('home');
                  }}
                  className="w-full p-2 bg-stone-50 dark:bg-slate-850 hover:bg-stone-100 dark:hover:bg-slate-750 rounded-xl text-left flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {u.displayName} ({u.email})
                  </span>
                  <span className="text-[10px] text-stone-400 shrink-0">
                    {u.isDemoUser ? 'Mẫu' : 'Thật'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
