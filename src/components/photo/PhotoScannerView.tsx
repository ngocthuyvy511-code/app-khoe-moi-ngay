import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MealType } from '../../types';
import {
  Camera,
  UploadCloud,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  ArrowLeft,
  Info,
  Loader2,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const PhotoScannerView: React.FC = () => {
  const { setActiveScreen, addMeal, currentDate } = useApp();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isSimulatedResponse, setIsSimulatedResponse] = useState(false);

  // Analysis result for user review and manual edits
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [dishName, setDishName] = useState('');
  const [portion, setPortion] = useState('');
  const [calories, setCalories] = useState<number>(450);
  const [protein, setProtein] = useState<number>(25);
  const [carbs, setCarbs] = useState<number>(55);
  const [fat, setFat] = useState<number>(12);
  const [fiber, setFiber] = useState<number>(3);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [hasResult, setHasResult] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAnalysisError('Vui lòng chọn tệp định dạng hình ảnh hợp lệ (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      setAnalysisError(null);
      setHasResult(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzePhoto = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/gemini/analyze-meal-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: 'image/jpeg',
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Phân tích ảnh không thành công.');
      }

      setDishName(data.dishName || 'Món ăn tự chọn');
      setPortion(data.portion || '1 phần vừa');
      setCalories(Number(data.calories) || 400);
      setProtein(Number(data.protein) || 20);
      setCarbs(Number(data.carbs) || 50);
      setFat(Number(data.fat) || 10);
      setFiber(Number(data.fiber) || 3);
      setIngredients(Array.isArray(data.ingredients) ? data.ingredients : []);
      setNotes(data.notes || '');
      setIsSimulatedResponse(Boolean(data.isSimulated));
      setHasResult(true);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(
        err.message || 'Không thể kết nối đến máy chủ nhận diện. Bạn có thể tự điền thông tin bên dưới.'
      );
      // Fallback prefill for effortless manual entry
      setDishName('Bữa ăn gia đình');
      setPortion('1 phần');
      setCalories(400);
      setHasResult(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToDiary = () => {
    if (!dishName.trim()) return;

    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    addMeal({
      date: currentDate,
      mealType,
      foodName: dishName.trim(),
      portionMultiplier: 1,
      portionLabel: portion || '1 phần',
      calories,
      protein,
      carbs,
      fat,
      fiber,
      time,
      notes: notes ? `Ảnh phân tích: ${notes}` : 'Ghi nhận qua phân tích ảnh',
      source: isSimulatedResponse
        ? 'Ước tính AI (Dữ liệu mô phỏng)'
        : 'Ước tính AI Gemini + Người dùng xác nhận',
      imageUrl: selectedImage || undefined,
    });

    setActiveScreen('diary');
  };

  return (
    <div className="space-y-6 pb-24 pt-2 max-w-2xl mx-auto">
      {/* Top back button */}
      <button
        onClick={() => setActiveScreen('diary')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-slate-300 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại nhật ký ăn uống</span>
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" />
            <span>Nhận diện món ăn bằng ảnh</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            Công cụ hỗ trợ gợi ý nhanh tên món và dinh dưỡng ước tính. Bạn luôn có toàn quyền chỉnh sửa và xác nhận trước khi lưu.
          </p>
        </div>

        {/* Mandatory Transparency & Allergy Disclaimer */}
        <div className="p-4 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-950 dark:text-amber-200 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-100">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Lưu ý quan trọng về tính năng nhận diện ảnh</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-amber-900/90 dark:text-amber-200/90 pl-1 leading-relaxed">
            <li>Hình ảnh chỉ cho phép ước tính tương đối và KHÔNG THỂ đo lường chính xác khối lượng hoặc gia vị nêm nếm ẩn (đường, muối, dầu mỡ).</li>
            <li><strong>Tuyệt đối không dùng tính năng này</strong> để khẳng định món ăn an toàn với người có dị ứng thực phẩm nặng.</li>
            <li>Hình ảnh chỉ được xử lý tạm thời để trích xuất món ăn và không bao giờ được chia sẻ công khai.</li>
          </ul>
        </div>

        {/* Upload Dropzone */}
        {!selectedImage ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-200 dark:border-slate-700 hover:border-emerald-500 rounded-3xl p-8 text-center cursor-pointer transition-colors bg-stone-50/60 dark:bg-slate-850 space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Chạm để chọn hoặc chụp ảnh bữa ăn
              </p>
              <p className="text-xs text-stone-400 dark:text-slate-500 mt-0.5">
                Hỗ trợ ảnh tô phở, đĩa cơm, món gỏi cuốn, bánh mì hoặc mâm cơm gia đình
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-slate-700 max-h-72 bg-black flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Bữa ăn đã chọn"
                className="max-h-72 w-full object-contain"
              />
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setHasResult(false);
                }}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors text-xs flex items-center gap-1 backdrop-blur-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Chọn ảnh khác</span>
              </button>
            </div>

            {!hasResult && (
              <button
                onClick={handleAnalyzePhoto}
                disabled={isAnalyzing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang phân tích món ăn...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Phân tích hình ảnh với AI</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {analysisError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{analysisError}</span>
          </div>
        )}

        {/* Verification & Editable Form (User must confirm before saving) */}
        {hasResult && (
          <div className="p-5 bg-stone-50 dark:bg-slate-850 rounded-2xl border border-stone-200 dark:border-slate-700 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kết quả gợi ý (Vui lòng kiểm tra và sửa nếu cần)</span>
              </div>
              <span className="text-[11px] text-stone-500 dark:text-slate-400">
                {isSimulatedResponse ? 'Dữ liệu minh họa' : 'Được hỗ trợ bởi AI'}
              </span>
            </div>

            {/* Meal Type Selector */}
            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                Lưu vào bữa:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'breakfast', label: 'Bữa sáng' },
                  { id: 'lunch', label: 'Bữa trưa' },
                  { id: 'dinner', label: 'Bữa tối' },
                  { id: 'snack', label: 'Bữa phụ' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setMealType(type.id as MealType)}
                    className={`py-1.5 px-2 text-xs font-medium rounded-xl transition-colors ${
                      mealType === type.id
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-white dark:bg-slate-800 text-stone-600 dark:text-slate-300 border border-stone-200 dark:border-slate-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                  Tên món ăn:
                </label>
                <input
                  type="text"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-600 dark:text-slate-400 block mb-1">
                  Kích cỡ khẩu phần:
                </label>
                <input
                  type="text"
                  value={portion}
                  onChange={(e) => setPortion(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div>
                <label className="text-stone-500 block mb-1">Calo (kcal):</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 font-bold tabular-nums"
                />
              </div>
              <div>
                <label className="text-stone-500 block mb-1">Đạm (g):</label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 tabular-nums"
                />
              </div>
              <div>
                <label className="text-stone-500 block mb-1">Carb (g):</label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 tabular-nums"
                />
              </div>
              <div>
                <label className="text-stone-500 block mb-1">Béo (g):</label>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 tabular-nums"
                />
              </div>
            </div>

            {ingredients.length > 0 && (
              <div>
                <label className="text-stone-500 text-xs block mb-1">Thành phần nhận biết được:</label>
                <p className="text-xs text-stone-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-stone-200 dark:border-slate-700">
                  {ingredients.join(', ')}
                </p>
              </div>
            )}

            <div>
              <label className="text-stone-500 text-xs block mb-1">Ghi chú cá nhân:</label>
              <input
                type="text"
                placeholder="Thêm cảm nhận hoặc vị nêm nếm..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 text-xs"
              />
            </div>

            {/* Confirm button */}
            <div className="pt-2">
              <button
                onClick={handleSaveToDiary}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tôi xác nhận thông tin này & Lưu vào Nhật ký</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
