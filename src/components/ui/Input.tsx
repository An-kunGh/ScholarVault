import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`block w-full rounded-xl border bg-[#141830]/90 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 shadow-inner shadow-black/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF3366]/30 focus:border-[#FF3366] ${
          error
            ? "border-rose-500 focus:ring-rose-500/20"
            : "border-white/10 hover:border-white/20"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";
