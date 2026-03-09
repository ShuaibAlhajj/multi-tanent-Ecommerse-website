import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || props.name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <label className="flex w-full flex-col gap-1.5 text-sm font-medium text-slate-700" htmlFor={inputId}>
      {label}
      <input
        id={inputId}
        className={clsx(
          'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-teal-100',
          error && 'border-coral focus:border-coral focus:ring-orange-100',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-coral">{error}</span> : null}
    </label>
  );
}
