import { useEffect } from 'react';

export const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const typeStyles = {
    success: 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20',
    error: 'bg-red-600 text-white border-red-500 shadow-red-500/20',
    info: 'bg-gray-900 text-white border-gray-700 shadow-gray-900/30',
  };

  const icons = {
    success: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm" role="status" aria-live="polite">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 ${
          typeStyles[type] || typeStyles.info
        }`}
      >
        {icons[type]}
        <p className="text-sm font-medium tracking-wide leading-snug">{message}</p>
        <button
          onClick={onClose}
          className="ml-auto p-1 rounded-full hover:bg-white/20 active:scale-95 transition-all text-white/80 hover:text-white"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
