import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ExerciseItem, WorkoutLogEntry } from '../../types';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
  Footprints,
  Plus,
  Trash2,
  Dumbbell,
  Compass,
  ArrowRight
} from 'lucide-react';

export const WorkoutView: React.FC = () => {
  const { exercises, todayWorkouts, logWorkout, deleteWorkout, currentDate } = useApp();

  // Active workout timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [activeExerciseForTimer, setActiveExerciseForTimer] = useState<ExerciseItem | null>(null);

  // Manual workout log modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [activityType, setActivityType] = useState<WorkoutLogEntry['activityType']>('walking');
  const [activityName, setActivityName] = useState('Đi bộ nhẹ nhàng');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [intensity, setIntensity] = useState<WorkoutLogEntry['intensity']>('light');
  const [distanceKm, setDistanceKm] = useState<number | ''>('');
  const [manualSteps, setManualSteps] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  // Selected exercise detail for instructions & safety warnings
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState<ExerciseItem | null>(null);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTimerDisplay = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartTimerWithExercise = (ex: ExerciseItem) => {
    setActiveExerciseForTimer(ex);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  const handleFinishTimer = () => {
    if (timerSeconds < 30) {
      setIsTimerRunning(false);
      setActiveExerciseForTimer(null);
      setTimerSeconds(0);
      return;
    }

    const minutes = Math.max(1, Math.round(timerSeconds / 60));
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Estimated burn rate ~ 4-6 kcal/min depending on light movement
    const estCalories = Math.round(minutes * 4.5);

    logWorkout({
      date: currentDate,
      activityType: activeExerciseForTimer?.category === 'cardio' ? 'walking' : 'strength',
      activityName: activeExerciseForTimer?.title || 'Buổi tập tự do',
      durationMinutes: minutes,
      intensity: 'light',
      caloriesBurned: estCalories,
      completedAt: time,
      notes: 'Ghi nhận qua bộ bấm giờ tập luyện thực tế',
    });

    setIsTimerRunning(false);
    setActiveExerciseForTimer(null);
    setTimerSeconds(0);
  };

  const handleSaveManualWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Respectful transparent calculation
    const mult = intensity === 'light' ? 4 : intensity === 'moderate' ? 6 : 8;
    const estCalories = Math.round(durationMinutes * mult);

    logWorkout({
      date: currentDate,
      activityType,
      activityName: activityName || 'Hoạt động thể lực',
      durationMinutes,
      intensity,
      distanceKm: distanceKm ? Number(distanceKm) : undefined,
      steps: manualSteps ? Number(manualSteps) : undefined,
      isManualSteps: Boolean(manualSteps),
      caloriesBurned: estCalories,
      notes,
      completedAt: time,
    });

    setIsManualModalOpen(false);
    setNotes('');
    setDistanceKm('');
    setManualSteps('');
  };

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <span>Vận động & Bài tập an toàn</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
            Lắng nghe cơ thể, duy trì sự dẻo dai và không tập luyện để trừng phạt bản thân
          </p>
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ghi buổi tập tay</span>
        </button>
      </div>

      {/* Safety Guideline Banner */}
      <div className="p-4 bg-amber-50/70 dark:bg-amber-950/40 rounded-2xl border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-3 text-xs text-amber-950 dark:text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>QUY TẮC AN TOÀN KHI VẬN ĐỘNG:</strong> Luôn khởi động kỹ 3-5 phút trước khi tập. Hãy dừng tập ngay lập tức và nghỉ ngơi nếu bạn cảm thấy chóng mặt, buồn nôn, đau nhói ngực hoặc đau khớp bất thường. Vận động để thấy khỏe khoắn, không vì ép cân quá sức.
        </div>
      </div>

      {/* Active Workout Timer Bar */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <span className="text-xs text-emerald-200 font-medium block mb-1">
            Bộ bấm giờ tập luyện thực tế
          </span>
          <h3 className="text-lg font-bold text-white">
            {activeExerciseForTimer ? activeExerciseForTimer.title : 'Bấm giờ vận động tự do'}
          </h3>
          <p className="text-xs text-emerald-100/80 mt-0.5">
            Đo thời gian thực, tạm dừng khi uống nước hoặc nghỉ giải lao
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-3xl sm:text-4xl font-mono font-bold tracking-wider tabular-nums text-emerald-300">
            {formatTimerDisplay(timerSeconds)}
          </div>

          <div className="flex items-center gap-2">
            {!isTimerRunning ? (
              <button
                onClick={() => setIsTimerRunning(true)}
                className="p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl transition-colors shadow-sm"
                title="Bắt đầu / Tiếp tục"
              >
                <Play className="w-5 h-5 fill-current" />
              </button>
            ) : (
              <button
                onClick={() => setIsTimerRunning(false)}
                className="p-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl transition-colors shadow-sm"
                title="Tạm dừng"
              >
                <Pause className="w-5 h-5 fill-current" />
              </button>
            )}

            <button
              onClick={handleFinishTimer}
              className="px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs font-bold transition-colors"
            >
              Hoàn thành
            </button>
          </div>
        </div>
      </div>

      {/* Today Workouts Logged */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Hoạt động thể lực hôm nay ({todayWorkouts.length})
        </h3>

        {todayWorkouts.length === 0 ? (
          <div className="py-6 text-center text-xs text-stone-400 dark:text-slate-500">
            Hôm nay chưa có buổi vận động nào. Bạn có thể chọn một bài tập nhẹ bên dưới để khởi động.
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-slate-700/60">
            {todayWorkouts.map((w) => (
              <div key={w.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {w.activityName}
                    </span>
                    <span className="text-xs text-stone-400 dark:text-slate-500 tabular-nums">
                      {w.completedAt}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                    <span className="tabular-nums">{w.durationMinutes} phút</span>
                    <span aria-hidden="true">·</span>
                    <span>Cường độ {w.intensity === 'light' ? 'nhẹ' : w.intensity === 'moderate' ? 'vừa' : 'mạnh'}</span>
                    {w.steps && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{w.steps} bước (Nhập tay)</span>
                      </>
                    )}
                    {w.caloriesBurned && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums text-emerald-600 font-medium">
                          ~{w.caloriesBurned} kcal tiêu hao
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteWorkout(w.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                  title="Xóa buổi tập"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exercise Library */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Thư viện bài tập được khuyến nghị
          </h3>
          <p className="text-xs text-stone-500 dark:text-slate-400">
            Các bài tập tự thân, cardio nhẹ và yoga giãn cơ phù hợp cho người Việt
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400 mb-1">
                  <span>{ex.categoryLabel}</span>
                  <span className="font-medium text-emerald-700 dark:text-emerald-400">
                    {ex.levelLabel}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ex.title}</h4>
                <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                  Dụng cụ: {ex.equipment} · Thời lượng: {ex.durationMinutes} phút
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-slate-700">
                <button
                  onClick={() => setSelectedExerciseDetail(ex)}
                  className="flex-1 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-stone-700 dark:text-slate-200 rounded-xl transition-colors"
                >
                  Xem hướng dẫn
                </button>

                <button
                  onClick={() => handleStartTimerWithExercise(ex)}
                  className="flex-1 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Bắt đầu tập</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Detail Instructions Modal */}
      {selectedExerciseDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedExerciseDetail.title}
              </h3>
              <button
                onClick={() => setSelectedExerciseDetail(null)}
                className="p-1 text-stone-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-rose-50/80 dark:bg-rose-950/40 rounded-xl text-xs text-rose-950 dark:text-rose-200 border border-rose-200 dark:border-rose-900">
              {selectedExerciseDetail.safetyCaution}
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mb-2">
                Hướng dẫn thực hiện từng bước:
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-stone-700 dark:text-slate-300 leading-relaxed">
                {selectedExerciseDetail.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            {selectedExerciseDetail.alternativeExercise && (
              <div>
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase mb-1">
                  Động tác thay thế nhẹ nhàng hơn:
                </h4>
                <p className="text-xs text-stone-600 dark:text-slate-400">
                  {selectedExerciseDetail.alternativeExercise}
                </p>
              </div>
            )}

            <button
              onClick={() => {
                handleStartTimerWithExercise(selectedExerciseDetail);
                setSelectedExerciseDetail(null);
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Chọn bài tập này & Bắt đầu tính giờ
            </button>
          </div>
        </div>
      )}

      {/* Manual Workout Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveManualWorkout}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ghi nhận buổi vận động
              </h3>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="p-1 text-stone-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Tên hoạt động:
              </label>
              <input
                type="text"
                required
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-xs sm:text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-stone-500 block mb-1">Thời gian (phút):</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 font-bold tabular-nums"
                />
              </div>

              <div>
                <label className="text-stone-500 block mb-1">Cường độ:</label>
                <select
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 font-medium"
                >
                  <option value="light">Nhẹ nhàng (nói chuyện thoải mái)</option>
                  <option value="moderate">Vừa phải (hơi thở sâu)</option>
                  <option value="vigorous">Tích cực (thử thách tim mạch)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-stone-500 block mb-1">Số bước chân (nhập tay):</label>
                <input
                  type="number"
                  placeholder="3000"
                  value={manualSteps}
                  onChange={(e) => setManualSteps(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 tabular-nums"
                />
              </div>
              <div>
                <label className="text-stone-500 block mb-1">Quãng đường (km):</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="2.5"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-500 text-xs block mb-1">Ghi chú:</label>
              <input
                type="text"
                placeholder="Cảm giác cơ thể sau tập..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-stone-600 dark:text-slate-400 bg-stone-100 dark:bg-slate-800 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors"
              >
                Lưu vận động
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
