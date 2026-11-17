import type { ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "coral"
  | "purple";

const variants: Record<BadgeVariant, string> = {
  default: "bg-white/[0.08] text-slate-300 border border-white/10",
  success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  danger: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
  info: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
  coral: "bg-[#FF3366]/15 text-[#FF6B8B] border border-[#FF3366]/30",
  purple: "bg-violet-500/15 text-violet-300 border border-violet-500/30",
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold tracking-wide backdrop-blur-xs ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
