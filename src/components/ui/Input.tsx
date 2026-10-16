import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: string;
  actionRight?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  actionRight,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs sm:text-sm font-semibold text-text-primary"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 text-text-secondary text-[18px]">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full py-2.5 rounded-[10px] bg-surface-subtle text-sm text-text-primary placeholder:text-text-secondary focus:bg-white focus:outline-none transition-all border ${
            error
              ? 'border-red-400 focus:border-red-500'
              : 'border-border-default focus:border-primary'
          } ${icon ? 'pl-9' : 'pl-3.5'} ${actionRight ? 'pr-11' : 'pr-3.5'} ${className}`}
          {...props}
        />
        {actionRight && (
          <div className="absolute right-2.5 flex items-center">
            {actionRight}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-status-error-text flex items-center gap-1 mt-0.5">
          <span className="material-symbols-outlined text-[14px]">error</span>
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-text-secondary mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};
