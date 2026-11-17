import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { StickyNote, Plus, Trash2, FileText, Calendar } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import type { Literature, Note } from "../types/database";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [literatures, setLiteratures] = useState<Literature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [content, setContent] = useState("");
  const [literatureId, setLiteratureId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [notesRes, litRes] = await Promise.all([
      supabase
        .from("notes")
        .select("*, literatures(title, course_id, courses(course_name))")
        .order("created_at", { ascending: false }),
      supabase.from("literatures").select("id, title").order("title"),
    ]);

    if (notesRes.error) setError(notesRes.error.message);
    else setNotes((notesRes.data ?? []) as Note[]);

    if (litRes.data) {
      setLiteratures(litRes.data as Literature[]);
      if (litRes.data.length > 0 && !literatureId) {
        setLiteratureId(litRes.data[0].id);
      }
    }
    setLoading(false);
  }

  async function addNote(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setSaving(true);
    setError("");

    const { error: insertError } = await supabase.from("notes").insert({
      content,
      literature_id: literatureId,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      await fetchData();
      setModalOpen(false);
      setContent("");
    }
    setSaving(false);
  }

  async function deleteNote(id: string) {
    if (!confirm("Hapus catatan ini?")) return;
    const { error: delError } = await supabase.from("notes").delete().eq("id", id);
    if (delError) setError(delError.message);
    else await fetchData();
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {notes.length} Catatan Akademik
        </p>
        <Button onClick={() => setModalOpen(true)} variant="coral">
          <Plus size={16} />
          Tulis Catatan
        </Button>
      </div>

      {error && (
        <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl font-medium">
          {error}
        </div>
      )}

      {notes.length === 0 ? (
        <Card>
          <EmptyState
            icon={<StickyNote size={44} />}
            title="Belum Ada Catatan"
            description="Buat catatan analisis, ringkasan bab, kutipan penting, atau kritik terhadap literatur yang Anda baca."
            action={
              <Button onClick={() => setModalOpen(true)} variant="coral">
                <Plus size={16} />
                Tulis Catatan Pertama
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card hover className="h-full flex flex-col justify-between border-amber-500/20 bg-[#111425]/90 group">
                <div>
                  {/* Linked Literature */}
                  <div className="flex items-start justify-between gap-2 mb-3 pb-2.5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={14} className="text-[#FFAA00] flex-shrink-0" />
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {note.literatures?.title || "Literatur Terkait"}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex-shrink-0 cursor-pointer"
                      title="Hapus Catatan"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Note Body */}
                  <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                    {note.content}
                  </p>
                </div>

                {/* Footer date */}
                <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-white/[0.06]">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {new Date(note.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {note.literatures?.courses?.course_name && (
                    <span className="text-slate-400 font-medium truncate max-w-[130px]">
                      {note.literatures.courses.course_name}
                    </span>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Add Note */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tulis Catatan Literatur Baru"
      >
        <form onSubmit={addNote} className="space-y-4">
          {literatures.length > 0 ? (
            <Select
              id="literatureId"
              label="Pilih Literatur yang Dibahas *"
              value={literatureId}
              onChange={(e) => setLiteratureId(e.target.value)}
              options={literatures.map((l) => ({
                value: l.id,
                label: l.title,
              }))}
            />
          ) : (
            <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
              Belum ada literatur. Tambahkan literatur terlebih dahulu di menu Literature Vault.
            </p>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Isi Catatan / Ringkasan *
            </label>
            <textarea
              rows={6}
              className="w-full rounded-xl border border-white/10 bg-[#141830] p-3 text-sm text-white placeholder-slate-500 focus:border-[#FF3366] focus:ring-2 focus:ring-[#FF3366]/20 focus:outline-none"
              placeholder="Tuliskan ide, kutipan, ringkasan bab, metodologi penting, atau catatan kritis dari literatur ini..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
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
              disabled={literatures.length === 0}
              className="flex-1"
            >
              Simpan Catatan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
