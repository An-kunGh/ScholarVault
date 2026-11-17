import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  FileText,
  StickyNote,
  Star,
  ExternalLink,
  Plus,
  ArrowRight,
  Sparkles,
  BookMarked,
  Layers,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { StatsCard } from "../components/ui/StatsCard";
import { Card, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import type { Course, Literature } from "../types/database";
import logoImg from "../assets/logo.png";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    semesters: 0,
    courses: 0,
    literatures: 0,
    notes: 0,
    favorites: 0,
  });
  const [recentLiteratures, setRecentLiteratures] = useState<Literature[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const [semRes, courseRes, litRes, notesRes, favRes, recentLitRes] =
        await Promise.all([
          supabase.from("semesters").select("id", { count: "exact", head: true }),
          supabase.from("courses").select("id, course_name, course_code, color"),
          supabase.from("literatures").select("id", { count: "exact", head: true }),
          supabase.from("notes").select("id", { count: "exact", head: true }),
          supabase
            .from("literatures")
            .select("id", { count: "exact", head: true })
            .eq("is_favorite", true),
          supabase
            .from("literatures")
            .select("*, courses(course_name, course_code, color)")
            .order("created_at", { ascending: false })
            .limit(6),
        ]);

      setStats({
        semesters: semRes.count ?? 0,
        courses: courseRes.data?.length ?? 0,
        literatures: litRes.count ?? 0,
        notes: notesRes.count ?? 0,
        favorites: favRes.count ?? 0,
      });

      setCourses((courseRes.data ?? []) as Course[]);
      setRecentLiteratures((recentLitRes.data ?? []) as Literature[]);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "journal":
        return "coral";
      case "book":
        return "success";
      case "paper":
        return "warning";
      case "thesis":
        return "danger";
      case "article":
        return "info";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-72">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#FF3366] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Hero Showcase Banner — Inspired by Reference Design */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-white/[0.09] bg-gradient-to-br from-[#12152B] via-[#0D1022] to-[#0A0C1A] overflow-hidden shadow-2xl shadow-black/40">
        {/* Glow orb behind banner content */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-br from-[#FF3366]/20 via-[#FFAA00]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-semibold text-slate-300">
              <Sparkles size={13} className="text-[#FF3366]" />
              Smart Academic Repository
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Organize Your Research <br />
              <span className="bg-gradient-to-r from-[#FF3366] via-[#FF5E82] to-[#FFAA00] bg-clip-text text-transparent">
                Super Fast & Easy.
              </span>
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
              Arsipkan paper, buku, jurnal ilmiah, dan catatan kuliah dalam satu
              perpustakaan digital terpadu yang terstruktur rapi per semester dan mata kuliah.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/literatures">
                <Button variant="coral" size="md">
                  <Plus size={16} /> Add Literature
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="secondary" size="md">
                  View All Courses <ArrowRight size={15} />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Logo Visual Display */}
          <div className="hidden md:flex flex-col items-center justify-center relative flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#FF3366]/30 via-[#FFAA00]/20 to-[#6366F1]/20 blur-xl opacity-70 group-hover:opacity-100 transition duration-500" />
              <div className="relative w-36 h-36 rounded-2xl bg-[#0F1225]/90 border border-white/15 p-4 flex items-center justify-center shadow-2xl backdrop-blur-xl">
                <img
                  src={logoImg}
                  alt="ScholarVault Logo"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Overview Metrics
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          <StatsCard
            icon={<GraduationCap size={19} />}
            label="Semesters"
            value={stats.semesters}
            color="indigo"
          />
          <StatsCard
            icon={<BookOpen size={19} />}
            label="Courses"
            value={stats.courses}
            color="emerald"
          />
          <StatsCard
            icon={<FileText size={19} />}
            label="Literatures"
            value={stats.literatures}
            color="coral"
          />
          <StatsCard
            icon={<StickyNote size={19} />}
            label="Study Notes"
            value={stats.notes}
            color="amber"
          />
          <StatsCard
            icon={<Star size={19} />}
            label="Favorites"
            value={stats.favorites}
            color="rose"
          />
        </div>
      </div>

      {/* Main Grid: Recent Literatures & Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Literatures */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF3366] shadow-xs shadow-[#FF3366]" />
                  Recent Literature Entries
                </div>
              </CardTitle>
              <Link
                to="/literatures"
                className="text-xs font-semibold text-[#FF6B8B] hover:text-[#FF3366] flex items-center gap-1 transition-colors"
              >
                Explore Vault <ArrowRight size={13} />
              </Link>
            </CardHeader>

            {recentLiteratures.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={36} className="mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-slate-300">
                  No literatures recorded yet
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Start collecting research papers, lecture slides, and reference books.
                </p>
                <Link to="/literatures" className="inline-block mt-4">
                  <Button size="sm" variant="coral">
                    <Plus size={15} /> Add First Literature
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {recentLiteratures.map((lit) => (
                  <motion.div
                    key={lit.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-3.5 flex items-start justify-between gap-4 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <Badge variant={getTypeBadgeVariant(lit.literature_type)}>
                          {lit.literature_type}
                        </Badge>

                        {lit.courses && (
                          <span
                            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border"
                            style={{
                              backgroundColor: `${lit.courses.color}18`,
                              borderColor: `${lit.courses.color}35`,
                              color: lit.courses.color,
                            }}
                          >
                            {lit.courses.course_code || lit.courses.course_name}
                          </span>
                        )}

                        {lit.is_favorite && (
                          <Star size={13} className="fill-[#FFAA00] text-[#FFAA00]" />
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors truncate">
                        {lit.title}
                      </h4>

                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {lit.author ? `By ${lit.author}` : "Unknown author"}
                        {lit.publication_year ? ` • (${lit.publication_year})` : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {lit.external_url && (
                        <a
                          href={lit.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-[#FF6B8B] hover:border-[#FF3366]/40 transition-all"
                          title="Open Link"
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Courses */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Layers size={17} className="text-indigo-400" />
                  Enrolled Courses
                </div>
              </CardTitle>
              <Link
                to="/courses"
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Manage
              </Link>
            </CardHeader>

            {courses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen size={30} className="mx-auto text-slate-600 mb-2" />
                <p className="text-xs text-slate-400">Belum ada mata kuliah</p>
                <Link to="/courses" className="inline-block mt-3">
                  <Button size="sm" variant="secondary">
                    Add Course
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {courses.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0 shadow-xs"
                        style={{ backgroundColor: c.color || "#FF3366" }}
                      />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-white truncate">
                          {c.course_name}
                        </p>
                        {c.course_code && (
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            {c.course_code}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
