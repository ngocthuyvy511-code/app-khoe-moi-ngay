import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Loader2,
  HeartHandshake,
  Database
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const { signInWithGoogle, isAuthLoading } = useApp();

  return (
    <div className="max-w-md mx-auto py-12 px-4 pb-24">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-6">
        {/* Brand Lockup */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-sm shadow-emerald-600/30">
            KM
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Khỏe Mỗi Ngày
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400">
            Quản lý cân nặng bền vững & dinh dưỡng món ăn Việt Nam
          </p>
        </div>

        {/* Cloud Persistence Guarantee */}
        <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200">
            <Database className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Đồng bộ hóa dữ liệu thời gian thực trên Firebase</span>
          </div>
          <p className="text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
            Ứng dụng kết nối trực tiếp với Firebase Firestore. Dữ liệu bữa ăn, nước uống, bài tập và biểu đồ của bạn được bảo mật tuyệt đối theo tài khoản Google cá nhân, không tạo tài khoản ảo và không chia sẻ ra ngoài.
          </p>
        </div>

        {/* Primary Action: Sign in with Google */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={isAuthLoading}
            className="w-full py-3.5 px-4 bg-white dark:bg-slate-700 hover:bg-stone-50 dark:hover:bg-slate-650 text-slate-800 dark:text-slate-100 border border-stone-300 dark:border-slate-600 rounded-2xl font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-60"
          >
            {isAuthLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                <span>Đang kết nối Google...</span>
              </>
            ) : (
              <>
                {/* Official Google G Logo SVG */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Đăng nhập bằng tài khoản Google</span>
              </>
            )}
          </button>
        </div>

        {/* Privacy principles */}
        <div className="pt-2 border-t border-stone-100 dark:border-slate-700/80 text-[11px] text-stone-500 dark:text-slate-400 space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bảo vệ quyền riêng tư người dùng</span>
          </div>
          <p>
            • Không yêu cầu mật khẩu riêng: Quá trình xác thực do Google Auth quản lý bảo mật.
          </p>
          <p>
            • Toàn bộ nhật ký dinh dưỡng và sức khỏe chỉ có bạn mới có quyền xem và chỉnh sửa.
          </p>
        </div>
      </div>
    </div>
  );
};
