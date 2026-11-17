import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Tag as TagIcon, Plus, Trash2, Hash } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import type { Tag } from "../types/database";

const TAG_COLORS = [
  "#FF3366", // Coral Pink
  "#FF8C42", // Warm Orange
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#EC4899", // Pink
  "#3B82F6", // Blue
  "#64748B", // Slate
];

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [color, setColor] = useState("#FF3366");

  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    setLoading(true);
    const { data, error: fetchErr } = await supabase
      .from("tags")
      .select("*")
      .order("name");

    if (fetchErr) setError(fetchErr.message);
    else setTags((data ?? []) as Tag[]);
    setLoading(false);
  }

  async function addTag(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError("");

    const { error: insertError } = await supabase.from("tags").insert({
      name: name.trim(),
      color,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      await fetchTags();
      setModalOpen(false);
      setName("");
      setColor("#FF3366");
    }
    setSaving(false);
  }

  async function deleteTag(id: string) {
    if (!confirm("Hapus tag ini?")) return;
    const { error: delError } = await supabase.from("tags").delete().eq("id", id);
    if (delError) setError(delError.message);
    else await fetchTags();
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
          {tags.length} Kategori Tag
        </p>
        <Button onClick={() => setModalOpen(true)} variant="coral">
          <Plus size={16} />
          Tambah Tag
        </Button>
      </div>

      {error && (
        <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl font-medium">
          {error}
        </div>
      )}

      {tags.length === 0 ? (
        <Card>
          <EmptyState
            icon={<TagIcon size={44} />}
            title="Belum Ada Tag"
            description="Buat tag (misal: 'Machine Learning', 'Metodologi Kualitatif', 'Ujian Akhir') untuk mengelompokkan literatur Anda."
            action={
              <Button onClick={() => setModalOpen(true)} variant="coral">
                <Plus size={16} />
                Tambah Tag Pertama
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {tags.map((tag, i) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
            >
              <div
                className="group relative p-3 rounded-xl border border-white/[0.08] bg-[#0F1225]/85 hover:bg-[#141830] transition-all flex items-center justify-between gap-2 shadow-sm"
                style={{ borderLeftColor: tag.color, borderLeftWidth: 3 }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Hash size={14} style={{ color: tag.color }} />
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {tag.name}
                  </span>
                </div>

                <button
                  onClick={() => deleteTag(tag.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/15 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                  title="Hapus Tag"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Add Tag */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Tambah Tag Kategori">
        <form onSubmit={addTag} className="space-y-4">
          <Input
            id="tagName"
            label="Nama Tag *"
            placeholder="Contoh: Deep Learning, Metodologi, Skripsi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Pilih Warna Penanda
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {TAG_COLORS.map((c) => (
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
            <Button type="submit" variant="coral" loading={saving} className="flex-1">
              Simpan Tag
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
