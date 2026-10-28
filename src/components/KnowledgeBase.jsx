import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Info, Plus, Trash2 } from "lucide-react";

const EMPTY_FORM = { name: "", keywords: "", questions: "", answer: "" };

export default function KnowledgeBase({ store }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [notice, setNotice] = useState(null); // { ok: bool, text: string }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const keywords = form.keywords.split(",").map((s) => s.trim()).filter(Boolean);
    const questions = form.questions.split(",").map((s) => s.trim()).filter(Boolean);
    const answer = form.answer.trim();

    if (!name || keywords.length === 0 || !answer) {
      setNotice({
        ok: false,
        text: "Nama intent, minimal 1 kata kunci, dan jawaban wajib diisi.",
      });
      return;
    }
    store.addIntent({ name, keywords, questions, answer });
    setForm(EMPTY_FORM);
    setNotice({
      ok: true,
      text: `Intent "${name}" aktif — langsung dicoba di halaman Chat Demo.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-bold text-accent">
          <BookOpen className="h-3.5 w-3.5" />
          Basis jawaban chatbot
        </span>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
            Intent yang dikuasai bot
          </h1>
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-extrabold text-accent">
            {store.intents.length} intent aktif
          </span>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">
          Setiap intent berisi kata kunci yang dicari di pesan pelanggan, contoh
          pertanyaan, dan jawaban baku. Intent yang kamu tambah di halaman ini
          langsung dipakai mesin pencocokan di Chat Demo.
        </p>
      </motion.section>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Daftar intent */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:content-start">
          {store.intents.map((it) => (
            <div
              key={it.id}
              className="flex flex-col rounded-2xl border border-edge bg-card p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-bold text-ink">{it.name}</h2>
                {it.custom && (
                  <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-extrabold text-accent">
                    intent baru
                  </span>
                )}
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {(it.keywords || []).map((kw) => (
                  <span
                    key={kw}
                    className="rounded-md bg-raised px-2 py-1 text-[11px] font-semibold text-accent"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              {it.questions?.length > 0 && (
                <div className="mt-3 space-y-1">
                  {it.questions.map((q, i) => (
                    <p key={i} className="text-xs italic text-mute">
                      “{q}”
                    </p>
                  ))}
                </div>
              )}

              <p className="mt-3 flex-1 border-t border-edge pt-3 text-sm leading-relaxed text-ink/90">
                {it.id === "bicara_agen"
                  ? "Intent khusus — memicu tawaran eskalasi ke agen manusia dengan tombol konfirmasi."
                  : it.answer}
              </p>

              {it.custom && (
                <button
                  onClick={() => store.removeIntent(it.id)}
                  className="mt-3 inline-flex items-center gap-1.5 self-start text-xs font-bold text-mute transition-colors hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus intent
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Form tambah intent */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <form
            onSubmit={submit}
            className="rounded-2xl border border-edge bg-card p-5"
          >
            <h2 className="flex items-center gap-2 font-bold text-ink">
              <Plus className="h-4 w-4 text-accent" />
              Tambah intent baru
            </h2>

            <label className="mt-4 block text-xs font-bold text-mute">
              Nama intent
              <input
                value={form.name}
                onChange={set("name")}
                placeholder="cth. Garansi Produk"
                className="mt-1.5 w-full rounded-xl border-0 bg-raised px-3.5 py-2.5 text-sm font-medium text-ink outline-none ring-1 ring-edge placeholder:text-mute/50 focus:ring-2 focus:ring-accent"
              />
            </label>

            <label className="mt-3 block text-xs font-bold text-mute">
              Kata kunci (pisahkan dengan koma)
              <input
                value={form.keywords}
                onChange={set("keywords")}
                placeholder="garansi, klaim, rusak pabrik"
                className="mt-1.5 w-full rounded-xl border-0 bg-raised px-3.5 py-2.5 text-sm font-medium text-ink outline-none ring-1 ring-edge placeholder:text-mute/50 focus:ring-2 focus:ring-accent"
              />
            </label>

            <label className="mt-3 block text-xs font-bold text-mute">
              Contoh pertanyaan (opsional, koma)
              <input
                value={form.questions}
                onChange={set("questions")}
                placeholder="Garansi berapa lama?"
                className="mt-1.5 w-full rounded-xl border-0 bg-raised px-3.5 py-2.5 text-sm font-medium text-ink outline-none ring-1 ring-edge placeholder:text-mute/50 focus:ring-2 focus:ring-accent"
              />
            </label>

            <label className="mt-3 block text-xs font-bold text-mute">
              Jawaban bot
              <textarea
                value={form.answer}
                onChange={set("answer")}
                rows={4}
                placeholder="Semua produk bergaransi resmi 1 tahun…"
                className="mt-1.5 w-full resize-none rounded-xl border-0 bg-raised px-3.5 py-2.5 text-sm font-medium text-ink outline-none ring-1 ring-edge placeholder:text-mute/50 focus:ring-2 focus:ring-accent"
              />
            </label>

            {notice && (
              <p
                className={`mt-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold ${
                  notice.ok
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "bg-red-500/10 text-red-300"
                }`}
              >
                {notice.text}
              </p>
            )}

            <button
              type="submit"
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-extrabold text-canvas transition-transform hover:scale-[1.02] active:scale-100"
            >
              <Plus className="h-4 w-4" />
              Tambah ke Basis Jawaban
            </button>
          </form>

          <div className="flex gap-3 rounded-2xl border border-dashed border-accent/40 bg-accent-soft/40 p-4">
            <Info className="h-4 w-4 shrink-0 text-accent" />
            <p className="text-xs leading-relaxed text-mute">
              Intent baru tersimpan di <span className="font-bold text-ink">localStorage</span>{" "}
              browsermu — bertahan meski halaman di-refresh, dan bisa dihapus
              kapan saja. Kata kunci dicocokkan dengan pencarian teks sederhana
              (bukan AI generatif), cocok untuk FAQ yang polanya stabil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
