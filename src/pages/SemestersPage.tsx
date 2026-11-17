import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Plus, Trash2, Calendar, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import type { Semester } from "../types/database";

export default function SemestersPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [semesterNumber, setSemesterNumber] = useState(1);
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [period, setPeriod] = useState("Ganjil");

  useEffect(() => {
    fetchSemesters();
  }, []);

  async function fetchSemesters() {
    setLoading(true);
    const { data, error: fetchErr } = await supabase
      .from("semesters")
      .select("*")
      .order("semester_number");

    if (fetchErr) setError(fetchErr.message);
    else setSemesters(data ?? []);
    setLoading(false);
  }

  async function addSemester(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error: insertErr } = await supabase.from("semesters").insert({
      semester_number: semesterNumber,
      academic_year: academicYear,
      period,
    });

    if (insertErr) {
      setError(insertErr.message);
    } else {
      await fetchSemesters();
      setModalOpen(false);
      setSemesterNumber((prev) => prev + 1);
    }
    setSaving(false);
  }

  async function deleteSemester(id: string) {
    if (!confirm("Hapus semester ini beserta data terkait?")) return;
    const { error: delErr } = await supabase
      .from("semesters")
      .delete()
      .eq("id", id);
    if (delErr) setError(delErr.message);
    else await fetchSemesters();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-[#FF3366] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            {semesters.length} Semester Terdaftar
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} variant="coral">
          <Plus size={16} />
          Add Semester
        </Button>
      </div>

      {error && (
        <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Grid Semesters */}
      {semesters.length === 0 ? (
        <Card>
          <EmptyState
            icon={<GraduationCap size={44} />}
            title="Belum Ada Semester"
            description="Tambahkan semester pertama untuk menstrukturkan mata kuliah dan bahan literatur akademik Anda."
            action={
              <Button onClick={() => setModalOpen(true)} variant="coral">
                <Plus size={16} />
                Tambah Semester Pertama
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {semesters.map((semester, i) => (
            <motion.div
              key={semester.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card hover className="relative overflow-hidden group">
                {/* Glow accent bar at top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF3366]/40 to-transparent group-hover:via-[#FF3366] transition-all duration-300" />

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF3366]/20 to-[#6366F1]/20 border border-white/10 flex items-center justify-center text-[#FF6B8B] shadow-inner">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base tracking-tight">
                        Semester {semester.semester_number}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Calendar size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-400 font-medium">
                          {semester.academic_year}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteSemester(semester.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <Badge
                    variant={semester.period === "Ganjil" ? "coral" : "purple"}
                  >
                    {semester.period}
                  </Badge>

                  <span className="text-[11px] text-slate-500 font-medium">
                    Tahun {semester.academic_year}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Add Semester */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tambah Semester Baru"
      >
        <form onSubmit={addSemester} className="space-y-4">
          <Input
            id="semesterNumber"
            label="Nomor Semester"
            type="number"
            min={1}
            max={20}
            value={semesterNumber}
            onChange={(e) => setSemesterNumber(Number(e.target.value))}
            required
          />

          <Input
            id="academicYear"
            label="Tahun Akademik"
            placeholder="2026/2027"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            required
          />

          <Select
            id="period"
            label="Periode Perkuliahan"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { value: "Ganjil", label: "Ganjil (Odd Semester)" },
              { value: "Genap", label: "Genap (Even Semester)" },
            ]}
          />

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
              className="flex-1"
            >
              Simpan Semester
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
