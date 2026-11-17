import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`block w-full rounded-xl border bg-[#141830] px-3.5 py-2.5 text-sm text-white shadow-inner shadow-black/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF3366]/30 focus:border-[#FF3366] ${
          error
            ? "border-rose-500"
            : "border-white/10 hover:border-white/20"
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#101326] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  )
);

Select.displayName = "Select";
