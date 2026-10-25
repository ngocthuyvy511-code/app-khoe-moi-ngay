import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { WeightLogEntry } from '../../types';
import {
  TrendingUp,
  Scale,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  Sparkles,
  Info,
  CheckCircle2,
  Smile,
  Meh,
  Frown,
  ArrowDownRight,
  ArrowUpRight,
  Minus
} from 'lucide-react';
import { calculateBMI, formatWeight } from '../../utils/nutritionCalculations';

export const ProgressView: React.FC = () => {
  const { weights, logWeight, deleteWeight, currentUser, currentDate } = useApp();

  const [timeFilter, setTimeFilter] = useState<'all' | '30d' | '7d'>('30d');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form states
  const [newWeight, setNewWeight] = useState<number | ''>(currentUser?.currentWeightKg || 65);
  const [newWaist, setNewWaist] = useState<number | ''>('');
  const [newMood, setNewMood] = useState<WeightLogEntry['mood']>('peaceful');
  const [newEnergy, setNewEnergy] = useState<number>(4);
  const [newNotes, setNewNotes] = useState('');

  // Filtered and chronological weights
  const sortedWeights = useMemo(() => {
    const list = [...weights].sort((a, b) => a.date.localeCompare(b.date));
    if (timeFilter === '7d') return list.slice(-7);
    if (timeFilter === '30d') return list.slice(-30);
    return list;
  }, [weights, timeFilter]);

  const latestWeight = sortedWeights[sortedWeights.length - 1];
  const firstWeight = sortedWeights[0];

  const weightDelta =
    latestWeight && firstWeight && sortedWeights.length > 1
      ? Number((latestWeight.weightKg - firstWeight.weightKg).toFixed(1))
      : 0;

  // Scientific BMI evaluation with disclaimer
  const bmiResult = calculateBMI(currentUser?.currentWeightKg || 60, currentUser?.heightCm || 165);

  // SVG Chart calculation
  const chartPoints = useMemo(() => {
    if (sortedWeights.length === 0) return { path: '', points: [], minW: 0, maxW: 0 };

    const minW = Math.min(...sortedWeights.map((w) => w.weightKg)) - 1;
    const maxW = Math.max(...sortedWeights.map((w) => w.weightKg)) + 1;
    const range = maxW - minW || 1;

    const width = 600;
    const height = 180;
    const paddingX = 40;
    const paddingY = 25;

    const pts = sortedWeights.map((item, idx) => {
      const x =
        sortedWeights.length === 1
          ? width / 2
          : paddingX + (idx / (sortedWeights.length - 1)) * (width - 2 * paddingX);
      const y = height - paddingY - ((item.weightKg - minW) / range) * (height - 2 * paddingY);
      return { x, y, ...item };
    });

    const d = pts.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

    return { path: d, points: pts, minW, maxW };
  }, [sortedWeights]);

  const handleSaveWeightEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight || Number(newWeight) <= 0) return;

    logWeight({
      date: currentDate,
      weightKg: Number(newWeight),
      waistCm: newWaist ? Number(newWaist) : undefined,
      mood: newMood,
      energyLevel: newEnergy,
      notes: newNotes,
    });

    setIsLogModalOpen(false);
    setNewNotes('');
  };

  if (!currentUser) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-stone-200 dark:border-slate-700 my-8">
        <p className="text-stone-600 dark:text-slate-300">Vui lòng đăng nhập bằng Google để xem tiến trình và lịch sử cân nặng của bạn.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Tiến trình & Báo cáo sức khỏe</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
            Theo dõi xu hướng lâu dài, trân trọng từng chuyển biến tích cực của cơ thể
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ghi số cân mới</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm">
          <span className="text-xs text-stone-500 dark:text-slate-400 block mb-1">
            Cân nặng hiện tại
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {formatWeight(currentUser.currentWeightKg, currentUser.preferredWeightUnit)}
            </span>
            {currentUser.targetWeightKg && (
              <span className="text-xs text-stone-400 dark:text-slate-500">
                (Mục tiêu: {formatWeight(currentUser.targetWeightKg, currentUser.preferredWeightUnit)})
              </span>
            )}
          </div>
          <div className="mt-2 text-xs text-stone-500 dark:text-slate-400 flex items-center gap-1">
            {weightDelta < 0 ? (
              <>
                <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold tabular-nums">
                  {Math.abs(weightDelta)} kg
                </span>
                <span>trong chu kỳ xem</span>
              </>
            ) : weightDelta > 0 ? (
              <>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-amber-700 dark:text-amber-400 font-semibold tabular-nums">
                  +{weightDelta} kg
                </span>
                <span>trong chu kỳ xem</span>
              </>
            ) : (
              <>
                <Minus className="w-3.5 h-3.5 text-stone-400" />
                <span>Ổn định vững vàng</span>
              </>
            )}
          </div>
        </div>

        {/* BMI Card with Medical Caveat */}
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-stone-500 dark:text-slate-400">Chỉ số BMI tham khảo</span>
            <span className={`text-xs font-bold ${bmiResult.colorClass}`}>
              {bmiResult.category}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {bmiResult.bmi}
            </span>
            <span className="text-xs text-stone-400">kg/m²</span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-slate-500 mt-2 line-clamp-2">
            Chỉ số dịch tễ học chung, không đo lượng cơ bắp hay độ săn chắc.
          </p>
        </div>

        {/* Weekly Habit Consistency */}
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm">
          <span className="text-xs text-stone-500 dark:text-slate-400 block mb-1">
            Mức độ đều đặn thói quen
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              88%
            </span>
            <span className="text-xs text-stone-400">tuần này</span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-2">
            Duy trì đều đặn uống đủ nước và bổ sung thêm rau xanh.
          </p>
        </div>
      </div>

      {/* Visual Weight Trend Chart (SVG) */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-slate-700">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Biểu đồ xu hướng cân nặng
            </h3>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Các mốc đo thực tế (dữ liệu không có không bị coi là 0)
            </p>
          </div>

          <div className="flex items-center gap-1 bg-stone-100 dark:bg-slate-700 p-1 rounded-xl text-xs font-semibold">
            {[
              { id: '7d', label: '7 ngày' },
              { id: '30d', label: '30 ngày' },
              { id: 'all', label: 'Toàn bộ' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTimeFilter(f.id as any)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  timeFilter === f.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-stone-600 dark:text-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Curve */}
        {chartPoints.points.length < 2 ? (
          <div className="py-12 text-center text-xs text-stone-400 dark:text-slate-500">
            Cần ít nhất 2 lần ghi nhận cân nặng để dựng biểu đồ xu hướng.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 600 200" className="w-full h-48 select-none">
              {/* Grid lines */}
              <line x1="30" y1="30" x2="570" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="90" x2="570" y2="90" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="150" x2="570" y2="150" stroke="#f1f5f9" strokeWidth="1" />

              {/* Stroke path */}
              <path
                d={chartPoints.path}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {chartPoints.points.map((pt, i) => (
                <g key={pt.id || i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="hover:r-7 transition-all cursor-pointer"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-slate-700 dark:fill-slate-200"
                  >
                    {pt.weightKg}kg
                  </text>
                  <text
                    x={pt.x}
                    y={185}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-400"
                  >
                    {pt.date.slice(5)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </div>

      {/* Weekly Retrospective (Objective, Positive, Non-judgmental) */}
      <div className="bg-emerald-50/70 dark:bg-emerald-950/40 rounded-3xl p-6 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Tổng kết & Đánh giá tuần (Khách quan, thân thiện)</span>
        </div>
        <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
          Bạn đang đi đúng hướng với một nhịp điệu bình an và bền vững.
        </h4>
        <p className="text-xs text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed">
          Số đo cân nặng luôn dao động 0.5 - 1kg mỗi ngày do lượng nước uống, muối khoáng và tiêu hóa tự nhiên — điều này hoàn toàn bình thường. Điều tuyệt vời nhất là bạn đã duy trì uống trung bình 1.8L nước/ngày và hoàn thành các bài đi bộ sáng.
        </p>
      </div>

      {/* Weight History Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Nhật ký các lần ghi nhận ({weights.length})
        </h3>

        <div className="divide-y divide-stone-100 dark:divide-slate-700/60">
          {weights.map((w) => (
            <div key={w.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatWeight(w.weightKg, currentUser.preferredWeightUnit)}
                  </span>
                  {w.waistCm && (
                    <span className="text-xs text-stone-500 dark:text-slate-400">
                      · Eo: {w.waistCm} cm
                    </span>
                  )}
                  <span className="text-stone-300 dark:text-slate-600">·</span>
                  <span className="text-xs text-stone-400 dark:text-slate-500 tabular-nums">
                    {w.date}
                  </span>
                </div>
                {w.notes && (
                  <p className="text-xs text-stone-600 dark:text-slate-300 italic mt-0.5">
                    "{w.notes}"
                  </p>
                )}
              </div>

              <button
                onClick={() => deleteWeight(w.id)}
                className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                title="Xóa bản ghi"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Log Weight Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveWeightEntry}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ghi nhận số đo hôm nay
              </h3>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="p-1 text-stone-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Cân nặng (kg):
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-lg font-bold tabular-nums"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Vòng eo (cm, tùy chọn):
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="Ví dụ: 74"
                value={newWaist}
                onChange={(e) => setNewWaist(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-sm tabular-nums"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Cảm xúc / Tâm trạng:
              </label>
              <select
                value={newMood}
                onChange={(e) => setNewMood(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-xs"
              >
                <option value="happy">Tươi vui, tràn đầy năng lượng</option>
                <option value="peaceful">Bình an, nhẹ nhõm</option>
                <option value="neutral">Bình thường</option>
                <option value="stressed">Hơi căng thẳng</option>
                <option value="tired">Hơi mệt</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Ghi chú:
              </label>
              <input
                type="text"
                placeholder="Cân sáng sớm trước khi ăn..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-stone-600 dark:text-slate-400 bg-stone-100 dark:bg-slate-800 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors"
              >
                Lưu kết quả
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
