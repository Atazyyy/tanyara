import { motion } from "framer-motion";
import { Headset, MousePointerClick, Sparkles, Zap } from "lucide-react";
import ChatWidget from "./ChatWidget";
import { ORDERS } from "../data/seed";

const SUGGESTIONS = [
  "Toko buka jam berapa?",
  "Ongkir ke Bandung berapa?",
  "Status pesanan TNY-20451",
  "Barang saya rusak, mau retur",
  "Ada promo bulan ini?",
  "Lupa password gimana ya?",
  "Saya mau bicara dengan agen manusia",
];

const FLOW = [
  { step: "1", label: "Pelanggan bertanya", desc: "lewat widget chat" },
  { step: "2", label: "Bot cocokkan intent", desc: "pencocokan kata kunci" },
  { step: "3", label: "Jawaban instan", desc: "+ quick reply chips" },
  { step: "4", label: "Eskalasi bila perlu", desc: "dilanjut agen manusia" },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Rule-based, 100% client-side",
    desc: "Mesin pencocokan kata kunci berjalan sepenuhnya di browser — tanpa API eksternal, tanpa backend. Cepat dan murah dioperasikan.",
  },
  {
    icon: Sparkles,
    title: "Quick replies yang mengarahkan",
    desc: "Tiap jawaban menyertakan chips topik lanjutan, jadi pelanggan tidak perlu menebak harus mengetik apa.",
  },
  {
    icon: Headset,
    title: "Eskalasi ke agen manusia",
    desc: "Dua kali gagal dipahami? Bot menawarkan eskalasi: antrean, status menunggu, lalu agen mengambil alih dari panel.",
  },
  {
    icon: MousePointerClick,
    title: "Basis jawaban yang tumbuh",
    desc: "Intent baru bisa ditambah langsung dari tab Basis Jawaban — tanpa deploy ulang, langsung dipakai bot di halaman ini.",
  },
];

export default function ChatPage({ store }) {
  const me = store.convs.find((c) => c.id === "me");

  return (
    <div className="space-y-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-bold text-accent">
          <Sparkles className="h-3.5 w-3.5" />
          Chatbot &amp; customer service AI — concept demo
        </span>
        <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-ink md:text-4xl">
          Customer service otomatis yang tetap{" "}
          <span className="text-accent">manusiawi</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-mute md:text-base">
          Tanyara menjawab pertanyaan pelanggan dalam hitungan detik lewat mesin
          rule-based, lalu menyerahkan ke agen manusia saat percakapan butuh
          sentuhan personal. Coba langsung di widget di samping.
        </p>
      </motion.section>

      {/* Widget + panel samping */}
      <section className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ChatWidget
            me={me}
            typing={store.typing}
            onSend={store.sendCustomer}
            onEscalate={store.escalate}
            onTopics={store.showTopics}
            onReset={store.resetMe}
          />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-3xl border border-edge bg-card p-5">
            <h2 className="text-sm font-extrabold text-ink">Coba tanyakan ini</h2>
            <p className="mt-1 text-xs text-mute">
              Klik untuk langsung dikirim ke chatbot — perhatikan bagaimana
              intent dikenali dari kata kuncinya.
            </p>
            <div className="mt-3 space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => store.sendCustomer(s)}
                  className="w-full rounded-xl bg-raised px-3.5 py-2.5 text-left text-xs font-semibold text-ink ring-1 ring-edge transition-colors hover:ring-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-dashed border-accent/40 bg-accent-soft/40 p-5">
            <h2 className="text-sm font-extrabold text-ink">Kode pesanan demo</h2>
            <p className="mt-1 text-xs text-mute">
              Bot mengenali pola <span className="font-bold text-accent">TNY-xxxxx</span> dan
              menampilkan kartu status pesanan.
            </p>
            <div className="mt-3 space-y-2">
              {ORDERS.map((o) => (
                <button
                  key={o.code}
                  onClick={() => store.sendCustomer(o.code)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl bg-card px-3.5 py-2.5 text-left ring-1 ring-edge transition-colors hover:ring-accent"
                >
                  <span className="text-xs font-extrabold text-accent">{o.code}</span>
                  <span className="truncate text-xs text-mute">{o.item}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Alur */}
      <section>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW.map((f) => (
            <div
              key={f.step}
              className="rounded-2xl border border-edge bg-card p-4"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-xs font-extrabold text-accent">
                {f.step}
              </span>
              <p className="mt-2.5 text-sm font-bold text-ink">{f.label}</p>
              <p className="text-xs text-mute">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fitur */}
      <section className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-edge bg-card p-5 transition-colors hover:border-accent/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-bold text-ink">{f.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-mute">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
