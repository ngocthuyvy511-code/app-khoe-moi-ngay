import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, HeartHandshake } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  const hasSpecialCondition =
    currentUser.healthConditions &&
    currentUser.healthConditions.length > 0 &&
    !currentUser.healthConditions.includes('none');

  if (!hasSpecialCondition && !currentUser.isGentleHabitsMode) return null;

  return (
    <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl p-4 mb-5 text-sm text-emerald-950 dark:text-emerald-100 flex items-start gap-3">
      <HeartHandshake className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm">
          Chế độ Đồng hành Chăm sóc Lối sống Tự nhiên
        </h4>
        <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 mt-1 leading-relaxed">
          Ứng dụng đang đặt sự an toàn và sức khỏe tổng thể của bạn lên hàng đầu. Khỏe Mỗi Ngày tập trung vào việc bổ sung rau quả, vận động nhẹ nhàng, uống đủ nước và giấc ngủ chất lượng; không áp đặt bất kỳ chế độ thâm hụt năng lượng hay mục tiêu ép cân nào. Vui lòng tham vấn bác sĩ chuyên khoa để có hướng dẫn dinh dưỡng cá nhân hóa.
        </p>
      </div>
    </div>
  );
};
