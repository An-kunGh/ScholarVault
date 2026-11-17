import { Menu, Bell } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const { session } = useAuth();
  const userInitial = session?.user?.email?.[0]?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-20 bg-[#080912]/80 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification icon */}
          <button className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors relative cursor-pointer">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF3366] ring-2 ring-[#080912]" />
          </button>

          {/* User profile capsule */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
            <div className="relative group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF3366] to-[#6366F1] p-[1.5px] shadow-xs">
                <div className="w-full h-full rounded-full bg-[#0E1020] flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {userInitial}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">
                {session?.user?.email?.split("@")[0] || "Scholar"}
              </p>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
