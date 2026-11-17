import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { BookOpen, Plus, Trash2, Hash } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import type { Course, Semester } from "../types/database";

const PALETTE = [
  "#FF3366", // Coral Pink
  "#FF8C42", // Warm Orange
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#EC4899", // Magenta
  "#3B82F6", // Blue
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [filterSemester, setFilterSemester] = useState("");

  // Form
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#FF3366");
  const [semesterId, setSemesterId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [courseRes, semRes] = await Promise.all([
      supabase
        .from("courses")
        .select("*, semesters(semester_number, academic_year, period)")
        .order("course_name"),
      supabase.from("semesters").select("*").order("semester_number"),
    ]);

    if (courseRes.error) setError(courseRes.error.message);
    else setCourses((courseRes.data ?? []) as Course[]);

    if (semRes.data) {
      setSemesters(semRes.data);
      if (semRes.data.length > 0 && !semesterId) {
        setSemesterId(semRes.data[0].id);
      }
    }
    setLoading(false);
  }

  async function addCourse(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error: insertError } = await supabase.from("courses").insert({
      course_name: courseName,
      course_code: courseCode || null,
      description: description || null,
      color: color || "#FF3366",
      semester_id: semesterId,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      await fetchData();
      setModalOpen(false);
      setCourseName("");
      setCourseCode("");
      setDescription("");
      setColor("#FF3366");
    }
    setSaving(false);
  }

  async function deleteCourse(id: string) {
    if (
      !confirm(
        "Hapus mata kuliah ini? Semua literatur di dalamnya juga akan terhapus."
      )
    ) {
      return;
    }
    const { error: delError } = await supabase
      .from("courses")
      .delete()
      .eq("id", id);
    if (delError) setError(delError.message);
    else await fetchData();
  }

  const filtered = filterSemester
    ? courses.filter((c) => c.semester_id === filterSemester)
    : courses;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-[#FF3366] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            {filtered.length} Mata Kuliah
          </p>
          {semesters.length > 0 && (
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="text-xs border border-white/10 rounded-xl px-3 py-1.5 bg-[#121528] text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF3366]/30"
            >
              <option value="">Semua Semester</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#101326] text-white">
                  Semester {s.semester_number} — {s.academic_year} ({s.period})
                </option>
              ))}
            </select>
          )}
        </div>
        <Button onClick={() => setModalOpen(true)} variant="coral">
          <Plus size={16} />
          Tambah Mata Kuliah
        </Button>
      </div>

      {error && (
        <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl font-medium">
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BookOpen size={44} />}
            title="Belum Ada Mata Kuliah"
            description="Tambahkan mata kuliah sesuai semester untuk mengelompokkan bahan literatur dan catatan riset."
            action={
              <Button onClick={() => setModalOpen(true)} variant="coral">
                <Plus size={16} />
                Tambah Mata Kuliah Pertama
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card hover className="relative overflow-hidden flex flex-col justify-between h-full group">
                {/* Color strip top */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: course.color || "#FF3366" }}
                />

                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-xs"
                        style={{ backgroundColor: course.color || "#FF3366" }}
                      />
                      {course.course_code ? (
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {course.course_code}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Tanpa Kode</span>
                      )}
                    </div>

                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug mb-1 tracking-tight">
                    {course.course_name}
                  </h3>

                  {course.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {course.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <Badge variant="default">
                    {course.semesters
                      ? `Sem ${course.semesters.semester_number} (${course.semesters.period})`
                      : "Semester —"}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Add Course */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tambah Mata Kuliah Baru"
      >
        <form onSubmit={addCourse} className="space-y-4">
          <Input
            id="courseName"
            label="Nama Mata Kuliah"
            placeholder="Contoh: Algoritma & Struktur Data"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />

          <Input
            id="courseCode"
            label="Kode Mata Kuliah (Opsional)"
            placeholder="Contoh: CS102 / IF-210"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Deskripsi Singkat
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-white/10 bg-[#141830] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#FF3366] focus:ring-2 focus:ring-[#FF3366]/20 focus:outline-none"
              placeholder="Deskripsi silabus atau topik mata kuliah..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {semesters.length > 0 ? (
            <Select
              id="semesterId"
              label="Pilih Semester"
              value={semesterId}
              onChange={(e) => setSemesterId(e.target.value)}
              options={semesters.map((s) => ({
                value: s.id,
                label: `Semester ${s.semester_number} — ${s.academic_year} (${s.period})`,
              }))}
            />
          ) : (
            <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
              Harap tambahkan semester terlebih dahulu di halaman Semesters.
            </p>
          )}

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Warna Penanda
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PALETTE.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                    color === c
                      ? "ring-2 ring-offset-2 ring-offset-[#0F1225] ring-[#FF3366] scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="coral"
              loading={saving}
              disabled={semesters.length === 0}
              className="flex-1"
            >
              Simpan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
