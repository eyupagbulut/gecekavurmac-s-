import React from 'react';
import { useMenu } from '../context/MenuContext';
import { Bell, Info, CheckCircle2, AlertTriangle, XCircle, X, Flame, Bike, Utensils, Sparkles } from 'lucide-react';

export const ToastOverlay: React.FC = () => {
  const { toasts, removeToast, requestNotificationPermission } = useMenu();

  const isNativeSupported = 'Notification' in window;
  const isPermissionGranted = isNativeSupported && Notification.permission === 'granted';

  const getIcon = (toast: any) => {
    if (toast.type === 'status_update') {
      switch (toast.status) {
        case 'Alındı':
          return <Utensils className="text-orange-600 dark:text-orange-400 animate-pulse" size={20} />;
        case 'Hazırlanıyor':
          return <Flame className="text-red-500 animate-bounce" style={{ animationDuration: '2s' }} size={20} />;
        case 'Yolda':
          return <Bike className="text-blue-500 animate-bounce" size={20} />;
        case 'Teslim Edildi':
          return <Sparkles className="text-emerald-500 animate-pulse" size={20} />;
        default:
          return <Bell className="text-brand-500" size={20} />;
      }
    }

    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="text-emerald-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-amber-500" size={20} />;
      case 'error':
        return <XCircle className="text-rose-500" size={20} />;
      case 'info':
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const getBorderColor = (toast: any) => {
    if (toast.type === 'status_update') {
      switch (toast.status) {
        case 'Alındı': return 'border-l-4 border-l-orange-500';
        case 'Hazırlanıyor': return 'border-l-4 border-l-red-500';
        case 'Yolda': return 'border-l-4 border-l-blue-500';
        case 'Teslim Edildi': return 'border-l-4 border-l-emerald-500';
        default: return 'border-l-4 border-l-brand-600';
      }
    }

    switch (toast.type) {
      case 'success': return 'border-l-4 border-l-emerald-500';
      case 'warning': return 'border-l-4 border-l-amber-500';
      case 'error': return 'border-l-4 border-l-rose-500';
      case 'info':
      default: return 'border-l-4 border-l-blue-500';
    }
  };

  if (toasts.length === 0 && (!isNativeSupported || isPermissionGranted)) return null;

  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          0% {
            opacity: 0;
            transform: translateY(1.5rem) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-toast {
          animation: toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="fixed bottom-6 right-6 z-[60] max-w-sm w-full space-y-3 pointer-events-none md:max-w-md">
        {/* Permission Request Hub */}
        {isNativeSupported && !isPermissionGranted && (
          <div className="pointer-events-auto mx-4 md:mx-0 p-3.5 bg-yellow-50/95 dark:bg-zinc-900/95 border border-yellow-100 dark:border-zinc-800 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-toast backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Bell className="text-amber-600 dark:text-amber-400 shrink-0" size={16} />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 tracking-wider uppercase font-mono">ANLIK BİLDİRİMLER</span>
                <span className="text-xs text-gray-700 dark:text-zinc-300 font-medium">
                  Siparişinizi canlı takip etmek için bildirim izni verin.
                </span>
              </div>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="text-xs shrink-0 font-bold px-3 py-1.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-brand-500/10"
            >
              Bildirimleri Aç 🔔
            </button>
          </div>
        )}

        {/* List of active toasts */}
        {toasts.length > 0 && (
          <div className="flex flex-col gap-2.5 px-4 md:px-0">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`pointer-events-auto flex items-start gap-3.5 p-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl dark:shadow-zinc-950/40 transition-all duration-300 transform translate-y-0 scale-100 ${getBorderColor(toast)} animate-toast`}
              >
                <div className="shrink-0 p-1.5 bg-gray-50 dark:bg-zinc-800/80 rounded-xl">{getIcon(toast)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-gray-950 dark:text-zinc-50 leading-snug">
                    {toast.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-450 mt-1 font-semibold leading-relaxed">
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 p-1 text-gray-400 dark:text-zinc-600 hover:text-gray-700 dark:hover:text-zinc-400 transition-colors rounded-lg cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
