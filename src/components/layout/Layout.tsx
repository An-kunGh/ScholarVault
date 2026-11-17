import { useState, type ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/semesters": "Semesters",
  "/courses": "Courses",
  "/literatures": "Literature Vault",
  "/notes": "Study Notes",
  "/tags": "Tags & Categories",
  "/settings": "Settings",
};

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = titles[location.pathname] || "ScholarVault";

  return (
    <div className="min-h-screen bg-[#080912] text-slate-100 relative overflow-hidden selection:bg-[#FF3366] selection:text-white">
      {/* Ambient background glows inspired by reference design */}
      <div className="fixed -top-40 right-[-100px] w-[550px] h-[550px] bg-gradient-to-bl from-[#FF3366]/12 via-[#FFAA00]/8 to-transparent rounded-full blur-[110px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -left-48 w-[500px] h-[500px] bg-gradient-to-tr from-[#6366F1]/12 to-transparent rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 right-1/4 w-[600px] h-[500px] bg-gradient-to-t from-[#7C3AED]/10 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 relative z-10 flex flex-col min-h-screen">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
