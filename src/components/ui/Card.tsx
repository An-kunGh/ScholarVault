import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover }: CardProps) {
  return (
    <div
      className={`bg-[#0F1224]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 text-slate-100 shadow-xl shadow-black/20 ${
        hover
          ? "hover:border-[#FF3366]/40 hover:shadow-2xl hover:shadow-[#FF3366]/5 hover:-translate-y-0.5 transition-all duration-300"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-base font-bold text-white tracking-tight ${className}`}>
      {children}
    </h3>
  );
}
