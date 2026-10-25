import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  ShieldAlert,
  HelpCircle,
  Refrigerator,
  Repeat,
  HeartPulse
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isSimulated?: boolean;
}

export const AIAssistantView: React.FC = () => {
  const { currentUser, setActiveScreen } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Xin chào ${currentUser?.displayName || 'bạn'}! Tôi là Trợ lý Sống Khỏe của ứng dụng "Khỏe Mỗi Ngày".\n\nTôi ở đây để đồng hành cùng bạn gợi ý món ăn dinh dưỡng từ nguyên liệu có sẵn, đề xuất món ăn thay thế thanh nhẹ hoặc giải đáp thắc mắc về cách xây dựng lối sống lành mạnh bền vững.\n\nLưu ý y khoa: Tôi không thay thế bác sĩ, không kê đơn thuốc hay tư vấn sản phẩm giảm cân. Hãy cho tôi biết bạn đang cần hỗ trợ gì hôm nay nhé!`,
      timestamp: 'Hôm nay',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          userContext: {
            displayName: currentUser?.displayName || 'Bạn',
            goal:
              currentUser?.primaryGoal === 'manage_weight'
                ? 'Quản lý cân nặng bền vững'
                : currentUser?.primaryGoal === 'maintain_weight'
                ? 'Duy trì cân nặng'
                : 'Xây dựng thói quen',
            dietaryRestrictions: currentUser?.dietaryRestrictions?.join(', ') || 'Không',
            allergies: currentUser?.allergies?.join(', ') || 'Không',
          },
        }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Cảm ơn bạn! Hãy tiếp tục chia sẻ cùng tôi.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isSimulated: Boolean(data.isSimulated),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: 'Không thể kết nối trợ lý lúc này. Hãy kiểm tra kết nối mạng hoặc thử lại sau vài giây nhé.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-2 max-w-3xl mx-auto flex flex-col h-[calc(100vh-130px)]">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border border-stone-200/80 dark:border-slate-700 shadow-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Trợ lý Sống Khỏe AI</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                Gemini 3.8 Flash
              </span>
            </h1>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Đồng hành tích cực, không phán xét, không ép cân cấp tốc
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveScreen('home')}
          className="text-xs font-semibold text-stone-500 hover:text-slate-900 dark:hover:text-white"
        >
          Trang chủ
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs shrink-0">
        {[
          { label: 'Tủ lạnh có trứng, cà chua, đậu phụ thì nấu gì?', icon: Refrigerator },
          { label: 'Gợi ý món ăn ít dầu mỡ thay cho đồ chiên rán', icon: Repeat },
          { label: 'Cách uống nước đúng cách trong ngày làm việc', icon: HeartPulse },
          { label: 'Mẹo vượt qua cảm giác thèm ăn đêm lành mạnh', icon: HelpCircle },
        ].map((q, idx) => {
          const Icon = q.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.label)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl whitespace-nowrap transition-colors"
            >
              <Icon className="w-3.5 h-3.5 text-emerald-600" />
              <span>{q.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto bg-stone-50/60 dark:bg-slate-850 p-4 rounded-3xl border border-stone-200/80 dark:border-slate-700 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                  KM
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-stone-200/80 dark:border-slate-700 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.content}
                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    isUser ? 'text-emerald-100' : 'text-stone-400 dark:text-slate-500'
                  }`}
                >
                  {msg.timestamp} {msg.isSimulated && '· Minh họa'}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-stone-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 text-xs font-bold">
                  {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 text-xs text-stone-500 dark:text-slate-400 flex items-center gap-2">
              <span>Trợ lý đang soạn câu trả lời chu đáo...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-stone-200/80 dark:border-slate-700 shadow-sm shrink-0"
      >
        <input
          type="text"
          placeholder="Hỏi về món ăn, nguyên liệu, bài tập hoặc thói quen lành mạnh..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          className="flex-1 px-3 py-2 bg-transparent text-xs sm:text-sm focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 dark:disabled:bg-slate-700 text-white rounded-xl transition-colors shadow-sm"
          title="Gửi câu hỏi"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
