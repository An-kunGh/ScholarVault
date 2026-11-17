import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "coral";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-[#FF3366] to-[#FF5E82] text-white hover:brightness-110 shadow-lg shadow-[#FF3366]/25 border border-white/10 active:scale-[0.98]",
  coral:
    "bg-gradient-to-r from-[#FF3366] via-[#FF5376] to-[#FF758C] text-white hover:brightness-110 shadow-lg shadow-[#FF3366]/30 active:scale-[0.98]",
  secondary:
    "bg-white/[0.06] text-slate-200 border border-white/10 hover:bg-white/[0.12] hover:text-white backdrop-blur-md active:scale-[0.98]",
  ghost:
    "text-slate-400 hover:text-white hover:bg-white/[0.06]",
  danger:
    "bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3.5 py-1.5 text-xs font-semibold rounded-lg",
  md: "px-4 py-2 text-sm font-semibold rounded-xl",
  lg: "px-6 py-3 text-base font-semibold rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF3366]/50 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  )
);

Button.displayName = "Button";
