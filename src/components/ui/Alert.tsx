import React from 'react';

interface AlertProps {
  variant?: 'error' | 'warning' | 'success' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const styles = {
    error: {
      container: 'bg-status-error-bg border-red-200 text-status-error-text',
      icon: 'error',
    },
    warning: {
      container: 'bg-status-warning-bg border-amber-200 text-status-warning-text',
      icon: 'warning',
    },
    success: {
      container: 'bg-status-success-bg border-emerald-200 text-status-success-text',
      icon: 'check_circle',
    },
    info: {
      container: 'bg-status-info-bg border-indigo-200 text-status-info-text',
      icon: 'info',
    },
  };

  const current = styles[variant];

  return (
    <div
      className={`p-3 rounded-[10px] border flex items-start justify-between gap-2.5 text-xs transition-all ${current.container} ${className}`}
    >
      <div className="flex items-start gap-2 min-w-0">
        <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
          {current.icon}
        </span>
        <div className="flex flex-col gap-0.5">
          {title && <span className="font-bold">{title}</span>}
          <p className="leading-relaxed">{message}</p>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          aria-label="Tutup"
          className="opacity-70 hover:opacity-100 p-0.5 shrink-0 transition-opacity"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      )}
    </div>
  );
};
