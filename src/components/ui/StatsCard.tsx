import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  color?: "indigo" | "emerald" | "amber" | "rose" | "coral";
}

const colorMap = {
  indigo: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30",
  emerald: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  rose: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  coral: "bg-[#FF3366]/15 text-[#FF6B8B] border border-[#FF3366]/30",
};

export function StatsCard({
  icon,
  label,
  value,
  trend,
  color = "coral",
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0F1225]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5 shadow-lg shadow-black/20 hover:border-white/20 transition-all duration-300 relative overflow-hidden group"
    >
      {/* Background glow on hover */}
      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-[#FF3366]/5 rounded-full blur-xl group-hover:bg-[#FF3366]/15 transition-colors duration-500 pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>{icon}</div>
        {trend && (
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3 relative z-10">
        <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {value}
        </p>
        <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
          {label}
        </p>
      </div>
    </motion.div>
  );
}
