import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, X, Undo2 } from 'lucide-react';

export const ToastUndo: React.FC = () => {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="pointer-events-auto bg-slate-900/95 dark:bg-stone-100/95 text-white dark:text-slate-900 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/10 dark:border-black/10 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          {toast.type === 'info' ? (
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="truncate text-xs sm:text-sm font-medium">{toast.text}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {toast.undoAction && (
            <button
              onClick={() => {
                toast.undoAction?.();
                hideToast();
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>{toast.undoLabel || 'Hoàn tác'}</span>
            </button>
          )}
          <button
            onClick={hideToast}
            className="p-1 text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-900 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
