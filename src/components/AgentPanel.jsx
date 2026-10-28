import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  CheckCheck,
  Clock3,
  Headset,
  Inbox,
  Send,
  User,
} from "lucide-react";
import { CANNED, AGENTS } from "../data/seed";
import { fmtTime, relTime, initials, lastMsg } from "../utils/format";
import StatDonut from "./StatDonut";

const STATUS_META = {
  bot: { label: "Bot", cls: "bg-accent-soft text-accent" },
  menunggu: { label: "Menunggu Agen", cls: "bg-amber-400/15 text-amber-300" },
  dibahas: { label: "Dibahas Agen", cls: "bg-violet-400/15 text-violet-300" },
  selesai: { label: "Selesai", cls: "bg-emerald-400/15 text-emerald-300" },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.bot;
  return (
    <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-extrabold ${meta.cls}`}>
      {meta.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-edge bg-card p-4">
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-mute">
        <Icon className="h-3.5 w-3.5 text-accent" />
        {label}
      </p>
      <p className="mt-1.5 text-2xl font-extrabold text-ink">{value}</p>
      <p className="text-[11px] text-mute">{sub}</p>
    </div>
  );
}

function Bubble({ m }) {
  if (m.role === "system") {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-raised px-3 py-1 text-[11px] font-semibold italic text-mute ring-1 ring-edge">
          {m.text}
        </span>
      </div>
    );
  }

  const isCustomer = m.role === "customer";
  const isAgent = m.role === "agent";

  return (
    <div className={`flex flex-col ${isCustomer ? "items-end" : "items-start"}`}>
      <span className="mb-1 px-1 text-[10px] font-bold uppercase tracking-wide text-mute">
        {isCustomer ? "Pelanggan" : isAgent ? `Agen — ${m.agentName}` : "Tanyara (bot)"}
      </span>
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isCustomer
            ? "rounded-br-md bg-accent font-medium text-canvas"
            : isAgent
              ? "rounded-bl-md bg-violet-500/10 text-ink ring-1 ring-violet-400/30"
              : "rounded-bl-md bg-raised text-ink ring-1 ring-edge"
        }`}
      >
        {m.text}
      </div>
      <span className="mt-1 px-1 text-[10px] text-mute/70">{fmtTime(m.ts)}</span>
    </div>
  );
}

export default function AgentPanel({ store }) {
  const { convs } = store;
  const [selected, setSelected] = useState(() => convs[0]?.id ?? null);
  const [draft, setDraft] = useState("");

  const sorted = useMemo(
    () =>
      [...convs].sort(
        (a, b) => (lastMsg(b)?.ts ?? 0) - (lastMsg(a)?.ts ?? 0)
      ),
    [convs]
  );
  const conv = sorted.find((c) => c.id === selected) || sorted[0] || null;

  const stats = useMemo(() => {
    const agentNeeded = convs.filter(
      (c) => c.status === "menunggu" || c.status === "dibahas" || c.handler === "agent"
    ).length;
    return {
      agentNeeded,
      botOnly: convs.length - agentNeeded,
      total: convs.length,
    };
  }, [convs]);
  const eskalasiPct = Math.round((stats.agentNeeded / Math.max(1, stats.total)) * 100);

  const canTakeOver = conv && conv.status !== "selesai" && conv.handler !== "agent";
  const canReply = conv && conv.status === "dibahas";

  const submit = (e) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t || !conv) return;
    store.agentSend(conv.id, t);
    setDraft("");
  };

  const openAndSelect = (id) => {
    setSelected(id);
    store.openConv(id);
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
          <Headset className="h-3.5 w-3.5" />
          Panel agen internal
        </span>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
          Ambil alih percakapan dalam satu klik
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">
          Semua percakapan dari widget pelanggan mendarat di sini — lengkap
          dengan status bot/eskalasi, transkrip, dan canned responses. Demo
          simulasi: tidak ada pelanggan nyata.
        </p>
      </motion.section>

      {/* Statistik */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex items-center gap-4 rounded-2xl border border-edge bg-card p-4 lg:col-span-2">
          <StatDonut bot={stats.botOnly} agen={stats.agentNeeded} />
          <div className="space-y-1.5 text-xs">
            <p className="font-bold text-ink">Bot vs Agen</p>
            <p className="flex items-center gap-1.5 font-semibold text-mute">
              <span className="h-2.5 w-2.5 rounded-full bg-[#22d3ee]" />
              Diselesaikan bot — {stats.botOnly}
            </p>
            <p className="flex items-center gap-1.5 font-semibold text-mute">
              <span className="h-2.5 w-2.5 rounded-full bg-[#a78bfa]" />
              Butuh agen manusia — {stats.agentNeeded}
            </p>
          </div>
        </div>
        <StatCard
          icon={Inbox}
          label="Percakapan"
          value={String(stats.total)}
          sub="termasuk percakapanmu di halaman Chat"
        />
        <StatCard
          icon={Headset}
          label="Eskalasi ke agen"
          value={`${eskalasiPct}%`}
          sub={`${stats.agentNeeded} dari ${stats.total} percakapan`}
        />
        <StatCard
          icon={Clock3}
          label="Rata-rata balasan bot"
          value="1,8 dtk"
          sub="CSAT mock 4,8/5 · target < 5 dtk"
        />
      </section>

      {/* Daftar + transkrip */}
      <section className="grid gap-4 lg:grid-cols-[340px_1fr]">
        {/* Daftar percakapan */}
        <div className="space-y-2.5">
          {sorted.map((c) => {
            const last = lastMsg(c);
            const active = conv?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => openAndSelect(c.id)}
                className={`w-full rounded-2xl border p-3.5 text-left transition-colors ${
                  active
                    ? "border-accent/60 bg-card"
                    : "border-edge bg-card/60 hover:border-accent/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-raised text-xs font-extrabold text-accent ring-1 ring-edge">
                      {initials(c.name)}
                    </div>
                    {c.unread && (
                      <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-canvas bg-accent" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold text-ink">{c.name}</p>
                      <span className="shrink-0 text-[10px] text-mute">
                        {last ? relTime(last.ts) : ""}
                      </span>
                    </div>
                    <p className="truncate text-xs text-mute">
                      {last ? `${last.role === "customer" ? "" : last.role === "bot" ? "Bot: " : last.role === "agent" ? "Agen: " : ""}${last.text}` : ""}
                    </p>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <StatusBadge status={c.status} />
                  <span className="text-[10px] font-semibold text-mute">{c.channel}</span>
                </div>
              </button>
            );
          })}

          <div className="rounded-2xl border border-dashed border-edge bg-card/50 p-4">
            <p className="text-xs font-bold text-ink">Agen on shift</p>
            {AGENTS.map((a) => (
              <p key={a.id} className="mt-1.5 flex items-center justify-between text-xs text-mute">
                <span className="font-semibold text-ink">{a.name}</span>
                <span>
                  {a.shift} · {a.chats} chat
                </span>
              </p>
            ))}
          </div>
        </div>

        {/* Transkrip */}
        {conv && (
          <div className="flex h-fit flex-col overflow-hidden rounded-2xl border border-edge bg-card lg:sticky lg:top-20">
            {/* Header transkrip */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge bg-raised px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-xs font-extrabold text-accent">
                  {initials(conv.name)}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-ink">
                    {conv.name}
                    {conv.mine && (
                      <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-extrabold text-accent">
                        percakapanmu
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-mute">
                    {conv.channel} ·{" "}
                    {conv.agentName ? `ditangani ${conv.agentName}` : conv.status === "menunggu" ? "di antrean" : "dijawab bot"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={conv.status} />
                {canTakeOver && (
                  <button
                    onClick={() => store.takeOver(conv.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-xs font-extrabold text-canvas transition-transform hover:scale-105"
                  >
                    <Headset className="h-3.5 w-3.5" />
                    Ambil Alih
                  </button>
                )}
                {conv.status !== "selesai" && conv.handler === "agent" && (
                  <button
                    onClick={() => store.finishConv(conv.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-raised px-3.5 py-2 text-xs font-bold text-ink ring-1 ring-edge transition-colors hover:text-accent"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Tandai Selesai
                  </button>
                )}
              </div>
            </div>

            {/* Isi transkrip */}
            <div className="max-h-[420px] space-y-3 overflow-y-auto px-4 py-4">
              {conv.messages.map((m) => (
                <Bubble key={m.id} m={m} />
              ))}
            </div>

            {/* Canned responses + input agen */}
            <div className="border-t border-edge bg-raised px-4 py-3">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-mute">
                Canned responses
              </p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {CANNED.map((c, i) => (
                  <button
                    key={i}
                    disabled={!canReply}
                    onClick={() => store.agentSend(conv.id, c)}
                    className="max-w-full truncate rounded-full bg-card px-3 py-1.5 text-[11px] font-semibold text-mute ring-1 ring-edge transition-colors enabled:hover:text-accent enabled:hover:ring-accent disabled:cursor-not-allowed disabled:opacity-40"
                    title={c}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {canReply ? (
                <form onSubmit={submit} className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={`Balas sebagai agen ke ${conv.name}…`}
                    className="w-full rounded-xl border-0 bg-card px-4 py-2.5 text-sm text-ink outline-none ring-1 ring-edge placeholder:text-mute/60 focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    aria-label="Kirim balasan agen"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-canvas transition-transform hover:scale-105 active:scale-95"
                  >
                    <Send className="h-4.5 w-4.5" />
                  </button>
                </form>
              ) : (
                <p className="flex items-center gap-2 rounded-xl bg-card px-3.5 py-2.5 text-xs font-semibold text-mute ring-1 ring-edge">
                  <Bot className="h-4 w-4 shrink-0 text-accent" />
                  {conv.status === "menunggu"
                    ? "Klik Ambil Alih dulu untuk membalas percakapan ini."
                    : conv.status === "selesai"
                      ? "Percakapan sudah selesai."
                      : "Ambil alih percakapan ini untuk mulai membalas sebagai agen."}
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-mute">
        <User className="h-3.5 w-3.5" />
        Percakapan pelanggan lain adalah simulasi mock — hanya percakapan
        "Kamu (Pelanggan Demo)" yang terhubung dengan halaman Chat.
      </p>
    </div>
  );
}
