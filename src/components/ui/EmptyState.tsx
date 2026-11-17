import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center text-white"
    >
      <div className="mb-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-400 shadow-inner">
        {icon}
      </div>
      <h3 className="text-base font-bold text-white mb-1.5 tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-sm leading-relaxed">
        {description}
      </p>
      {action}
    </motion.div>
  );
}
