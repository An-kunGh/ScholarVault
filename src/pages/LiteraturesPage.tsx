import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Star,
  Search,
  Filter,
  Calendar,
  User,
  Sparkles,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import type { Course, Literature, LiteratureType } from "../types/database";

const LITERATURE_TYPES: { value: LiteratureType; label: string }[] = [
  { value: "journal", label: "Jurnal Ilmiah" },
  { value: "paper", label: "Paper / Prosiding" },
  { value: "book", label: "Buku / E-Book" },
  { value: "article", label: "Artikel / Essay" },
  { value: "thesis", label: "Skripsi / Tesis" },
  { value: "slides", label: "Slide Kuliah" },
  { value: "other", label: "Lainnya" },
];

export default function LiteraturesPage() {
  const [literatures, setLiteratures] = useState<Literature[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publicationYear, setPublicationYear] = useState<number | "">("");
  const [literatureType, setLiteratureType] = useState<LiteratureType>("journal");
  const [courseId, setCourseId] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [filePath, setFilePath] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [litRes, courseRes] = await Promise.all([
      supabase
        .from("literatures")
        .select("*, courses(course_name, course_code, color)")
        .order("created_at", { ascending: false }),
      supabase.from("courses").select("*").order("course_name"),
    ]);

    if (litRes.error) setError(litRes.error.message);
    else setLiteratures((litRes.data ?? []) as Literature[]);

    if (courseRes.data) {
      setCourses(courseRes.data);
      if (courseRes.data.length > 0 && !courseId) {
        setCourseId(courseRes.data[0].id);
      }
    }
    setLoading(false);
  }

  async function addLiterature(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error: insertError } = await supabase.from("literatures").insert({
      title,
      author: author || null,
      publication_year: publicationYear ? Number(publicationYear) : null,
      literature_type: literatureType,
      course_id: courseId,
      external_url: externalUrl || null,
      file_path: filePath || null,
      source: source || null,
      description: description || null,
      is_favorite: isFavorite,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      await fetchData();
      setModalOpen(false);
      resetForm();
    }
    setSaving(false);
  }

  function resetForm() {
    setTitle("");
    setAuthor("");
    setPublicationYear("");
    setLiteratureType("journal");
    setExternalUrl("");
    setFilePath("");
    setSource("");
    setDescription("");
    setIsFavorite(false);
  }

  async function toggleFavorite(lit: Literature) {
    const nextState = !lit.is_favorite;
    const { error: updateError } = await supabase
      .from("literatures")
      .update({ is_favorite: nextState })
      .eq("id", lit.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setLiteratures((prev) =>
        prev.map((item) =>
          item.id === lit.id ? { ...item, is_favorite: nextState } : item
        )
      );
    }
  }

  async function deleteLiterature(id: string) {
    if (!confirm("Hapus literatur ini dari vault?")) return;
    const { error: delError } = await supabase
      .from("literatures")
      .delete()
      .eq("id", id);

    if (delError) setError(delError.message);
    else await fetchData();
  }

  // Filter logic
  const filtered = literatures.filter((lit) => {
    const matchSearch =
      search === "" ||
      lit.title.toLowerCase().includes(search.toLowerCase()) ||
      (lit.author && lit.author.toLowerCase().includes(search.toLowerCase())) ||
      (lit.source && lit.source.toLowerCase().includes(search.toLowerCase()));

    const matchCourse =
      selectedCourse === "" || lit.course_id === selectedCourse;
    const matchType =
      selectedType === "" || lit.literature_type === selectedType;
    const matchFav = !onlyFavorites || lit.is_favorite;

    return matchSearch && matchCourse && matchType && matchFav;
  });

  const getTypeBadge = (type: string) => {
    const map: Record<
      string,
      { label: string; variant: "coral" | "info" | "success" | "warning" | "danger" | "default" }
    > = {
      journal: { label: "Jurnal", variant: "coral" },
      paper: { label: "Paper", variant: "warning" },
      book: { label: "Buku", variant: "success" },
      thesis: { label: "Tesis", variant: "danger" },
      article: { label: "Artikel", variant: "info" },
      slides: { label: "Slides", variant: "default" },
    };
    const item = map[type] || { label: type, variant: "default" };
    return <Badge variant={item.variant}>{item.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-[#FF3366] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col gap-3.5 bg-[#0F1225]/85 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/[0.08] shadow-xl shadow-black/20">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari judul paper, nama penulis, publisher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#141830] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF3366]/30 focus:border-[#FF3366] transition-all"
            />
          </div>

          {/* Action button */}
          <Button onClick={() => setModalOpen(true)} variant="coral" className="flex-shrink-0">
            <Plus size={16} />
            Tambah Literatur
          </Button>
        </div>

        {/* Dropdowns / Filter pills */}
        <div className="flex items-center gap-2 flex-wrap pt-2.5 border-t border-white/[0.06] text-xs">
          <Filter size={13} className="text-slate-500 mr-1" />

          {/* Course filter */}
          {courses.length > 0 && (
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border border-white/10 rounded-lg px-2.5 py-1.5 bg-[#141830] text-slate-300 focus:outline-none"
            >
              <option value="">Semua Mata Kuliah</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#101326] text-white">
                  {c.course_name}
                </option>
              ))}
            </select>
          )}

          {/* Type filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-white/10 rounded-lg px-2.5 py-1.5 bg-[#141830] text-slate-300 focus:outline-none"
          >
            <option value="">Semua Jenis</option>
            {LITERATURE_TYPES.map((t) => (
              <option key={t.value} value={t.value} className="bg-[#101326] text-white">
                {t.label}
              </option>
            ))}
          </select>

          {/* Favorite filter toggle */}
          <button
            onClick={() => setOnlyFavorites((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              onlyFavorites
                ? "bg-[#FFAA00]/15 text-[#FFAA00] border-[#FFAA00]/30 font-semibold"
                : "bg-white/[0.03] text-slate-400 border-white/10 hover:bg-white/[0.06]"
            }`}
          >
            <Star
              size={13}
              className={onlyFavorites ? "fill-[#FFAA00] text-[#FFAA00]" : ""}
            />
            Favorit Saja
          </button>

          <span className="ml-auto text-[11px] text-slate-500 font-medium">
            {filtered.length} dari {literatures.length} literatur
          </span>
        </div>
      </div>

      {error && (
        <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Grid of Literatures */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FileText size={44} />}
            title="Tidak Ada Literatur Ditemukan"
            description="Tambahkan jurnal, buku referensi, atau paper untuk mulai membangun pustaka digital riset Anda."
            action={
              <Button onClick={() => setModalOpen(true)} variant="coral">
                <Plus size={16} />
                Tambah Literatur
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((lit, i) => (
              <motion.div
                key={lit.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card hover className="h-full flex flex-col justify-between group">
                  <div>
                    {/* Header: badge, course, star, action */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getTypeBadge(lit.literature_type)}
                        {lit.courses && (
                          <span
                            className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border"
                            style={{
                              backgroundColor: `${lit.courses.color}15`,
                              borderColor: `${lit.courses.color}35`,
                              color: lit.courses.color,
                            }}
                          >
                            {lit.courses.course_code || lit.courses.course_name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleFavorite(lit)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#FFAA00] hover:bg-white/[0.05] transition-colors cursor-pointer"
                          title="Bookmark Favorit"
                        >
                          <Star
                            size={15}
                            className={
                              lit.is_favorite
                                ? "fill-[#FFAA00] text-[#FFAA00]"
                                : ""
                            }
                          />
                        </button>
                        <button
                          onClick={() => deleteLiterature(lit.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-2 mb-1.5 group-hover:text-slate-100 transition-colors tracking-tight">
                      {lit.title}
                    </h3>

                    {/* Meta: Author & Year */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                      {lit.author && (
                        <span className="flex items-center gap-1 truncate">
                          <User size={12} className="text-slate-500 flex-shrink-0" />
                          <span className="truncate">{lit.author}</span>
                        </span>
                      )}
                      {lit.publication_year && (
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <Calendar size={12} className="text-slate-500" />
                          {lit.publication_year}
                        </span>
                      )}
                    </div>

                    {/* Source / Publisher */}
                    {lit.source && (
                      <p className="text-xs text-[#FF6B8B] font-medium line-clamp-1 mb-2">
                        {lit.source}
                      </p>
                    )}

                    {/* Description */}
                    {lit.description && (
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {lit.description}
                      </p>
                    )}
                  </div>

                  {/* Footer Links */}
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {new Date(lit.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    {lit.external_url && (
                      <a
                        href={lit.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B8B] hover:text-[#FF3366] transition-colors"
                      >
                        Buka Sumber <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal Add Literature */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Simpan Literatur Baru"
      >
        <form onSubmit={addLiterature} className="space-y-4">
          <Input
            id="title"
            label="Judul Literatur / Paper *"
            placeholder="Contoh: Attention Is All You Need"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              id="literatureType"
              label="Jenis Literatur *"
              value={literatureType}
              onChange={(e) => setLiteratureType(e.target.value as LiteratureType)}
              options={LITERATURE_TYPES}
            />

            {courses.length > 0 && (
              <Select
                id="courseId"
                label="Mata Kuliah Terkait *"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                options={courses.map((c) => ({
                  value: c.id,
                  label: c.course_name,
                }))}
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="author"
              label="Penulis / Peneliti"
              placeholder="Contoh: Vaswani et al."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />

            <Input
              id="publicationYear"
              label="Tahun Terbit"
              type="number"
              placeholder="Contoh: 2023"
              value={publicationYear}
              onChange={(e) =>
                setPublicationYear(e.target.value ? Number(e.target.value) : "")
              }
            />
          </div>

          <Input
            id="source"
            label="Penerbit / Jurnal / Konferensi"
            placeholder="Contoh: IEEE / NeurIPS / Springer"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />

          <Input
            id="externalUrl"
            label="Tautan URL / DOI / Link Web"
            type="url"
            placeholder="https://arxiv.org/abs/..."
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
          />

          <Input
            id="filePath"
            label="Tautan File PDF / Cloud Drive (Opsional)"
            placeholder="https://drive.google.com/..."
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Catatan / Abstrak Singkat
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-[#141830] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#FF3366] focus:ring-2 focus:ring-[#FF3366]/20 focus:outline-none"
              placeholder="Ringkasan poin penting atau metodologi dari literatur ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFavorite"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="w-4 h-4 rounded bg-[#141830] border-white/20 text-[#FF3366] focus:ring-[#FF3366]"
            />
            <label htmlFor="isFavorite" className="text-xs font-semibold text-slate-300 cursor-pointer">
              Tandai sebagai Favorit / Penting
            </label>
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
              disabled={courses.length === 0}
              className="flex-1"
            >
              Simpan Literatur
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
