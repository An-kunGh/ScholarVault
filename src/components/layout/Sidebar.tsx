import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileText,
  StickyNote,
  Tag,
  Settings,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import logoImg from "../../assets/logo.png";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/semesters", icon: GraduationCap, label: "Semesters" },
  { to: "/courses", icon: BookOpen, label: "Courses" },
  { to: "/literatures", icon: FileText, label: "Literature Vault" },
  { to: "/notes", icon: StickyNote, label: "Study Notes" },
  { to: "/tags", icon: Tag, label: "Tags" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { signOut } = useAuth();

  const nav = (
    <nav className="flex flex-col h-full bg-[#0A0C1A]/95 backdrop-blur-2xl border-r border-white/[0.08]">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#FF3366] to-[#FFAA00] opacity-40 blur-xs group-hover:opacity-75 transition duration-300" />
            <img
              src={logoImg}
              alt="ScholarVault Logo"
              className="relative w-9 h-9 object-contain rounded-xl bg-[#0E1020] p-1 border border-white/10"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-white tracking-tight">
                Scholar<span className="text-[#FF3366]">Vault</span>
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">
              Academic Library
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Navigation
        </p>

        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-[#FF3366]/20 via-[#FF3366]/10 to-transparent text-white border-l-2 border-[#FF3366] shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "text-[#FF3366]"
                      : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span className="truncate">{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF3366] shadow-xs shadow-[#FF3366]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom User & Sign Out */}
      <div className="p-4 border-t border-white/[0.07]">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200 cursor-pointer"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-30">
        {nav}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-64 shadow-2xl lg:hidden"
          >
            {nav}
          </motion.aside>
        </>
      )}
    </>
  );
}
