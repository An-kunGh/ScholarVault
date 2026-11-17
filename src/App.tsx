import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { Layout } from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SemestersPage from "./pages/SemestersPage";
import CoursesPage from "./pages/CoursesPage";
import LiteraturesPage from "./pages/LiteraturesPage";
import NotesPage from "./pages/NotesPage";
import TagsPage from "./pages/TagsPage";
import SettingsPage from "./pages/SettingsPage";

function ProtectedLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080913] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#FF3366] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 mt-4 font-semibold uppercase tracking-widest">
            Memuat ScholarVault...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Layout />;
}

function LoginRoute() {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (session) return <Navigate to="/" replace />;
  return <LoginPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />

        {/* Protected routes wrapped in main Layout */}
        <Route element={<ProtectedLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="semesters" element={<SemestersPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="literatures" element={<LiteraturesPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="tags" element={<TagsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
