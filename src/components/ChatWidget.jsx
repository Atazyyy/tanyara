import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Headset, Library, RotateCcw, Send } from "lucide-react";
import { fmtTime } from "../utils/format";

function TypingRow() {
  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-raised px-4 py-3 ring-1 ring-edge">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const badge = {
    Dikirim: "bg-amber-400/15 text-amber-300",
    Dikemas: "bg-sky-400/15 text-sky-300",
    Diterima: "bg-emerald-400/15 text-emerald-300",
  }[order.status] || "bg-accent-soft text-accent";

  return (
    <div className="mt-2 rounded-xl border border-edge bg-canvas p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-extrabold tracking-wide text-accent">{order.code}</span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${badge}`}>
          {order.status}
        </span>
      </div>
      <p className="mt-1.5 text-sm font-bold text-ink">{order.item}</p>
      <p className="text-xs text-mute">{order.detail}</p>
    </div>
  );
}

function Bubble({ m }) {
  if (m.role === "system") {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-card px-3 py-1 text-[11px] font-semibold italic text-mute ring-1 ring-edge">
          {m.text}
        </span>
      </div>
    );
  }

  const isCustomer = m.role === "customer";
  const isAgent = m.role === "agent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex flex-col ${isCustomer ? "items-end" : "items-start"}`}
    >
      <span className="mb-1 px-1 text-[10px] font-bold uppercase tracking-wide text-mute">
        {isCustomer ? "Kamu" : isAgent ? `Agen — ${m.agentName}` : "Tanyara (bot)"}
      </span>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isCustomer
            ? "rounded-br-md bg-accent font-medium text-canvas"
            : isAgent
              ? "rounded-bl-md bg-violet-500/10 text-ink ring-1 ring-violet-400/30"
              : "rounded-bl-md bg-raised text-ink ring-1 ring-edge"
        }`}
      >
        {m.text}
        {m.order && <OrderCard order={m.order} />}
      </div>
      <span className="mt-1 px-1 text-[10px] text-mute/70">{fmtTime(m.ts)}</span>
    </motion.div>
  );
}

const HEADER_STATUS = {
  bot: { label: "Online — dijawab bot", dot: "bg-emerald-400" },
  menunggu: { label: "Menunggu agen…", dot: "bg-amber-400" },
  dibahas: { label: "Agen bergabung", dot: "bg-violet-400" },
  selesai: { label: "Percakapan selesai", dot: "bg-mute" },
};

export default function ChatWidget({ me, typing, onSend, onEscalate, onTopics, onReset }) {
  const [draft, setDraft] = useState("");
  const boxRef = useRef(null);
  const last = me.messages[me.messages.length - 1];
  const canChips = me.status === "bot";
  const hs = HEADER_STATUS[me.status] || HEADER_STATUS.bot;

  useEffect(() => {
    const el = boxRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [me.messages.length, typing]);

  const submit = (e) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t) return;
    onSend(t);
    setDraft("");
  };

  return (
    <div className="flex h-[560px] flex-col overflow-hidden rounded-3xl border border-edge bg-card shadow-2xl shadow-black/40">
      {/* Header widget */}
      <div className="flex items-center justify-between gap-3 border-b border-edge bg-raised px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
              <Bot className="h-5 w-5 text-canvas" />
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-raised ${hs.dot}`} />
          </div>
          <div>
            <p className="text-sm font-extrabold text-ink">Tanyara Assistant</p>
            <p className="text-xs text-mute">{hs.label}</p>
          </div>
        </div>
        <button
          onClick={onReset}
          title="Mulai ulang percakapan demo"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-mute ring-1 ring-edge transition-colors hover:text-accent"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Pesan */}
      <div ref={boxRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {me.messages.map((m) => (
          <Bubble key={m.id} m={m} />
        ))}
        {typing && <TypingRow />}

        {/* Quick reply chips — hanya di pesan bot terakhir */}
        {canChips && last?.chips && (
          <div className="flex flex-wrap gap-1.5 pl-1 pt-1">
            {last.chips.map((chip) => (
              <button
                key={chip}
                onClick={() => onSend(chip)}
                className="rounded-full bg-accent-soft px-3 py-1.5 text-xs font-bold text-accent transition-colors hover:bg-accent hover:text-canvas"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Tombol tawaran eskalasi */}
        {canChips && last?.offer && (
          <div className="flex flex-wrap gap-2 pl-1 pt-1">
            <button
              onClick={onEscalate}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-xs font-extrabold text-canvas transition-transform hover:scale-105"
            >
              <Headset className="h-3.5 w-3.5" />
              Ya, hubungkan ke agen
            </button>
            <button
              onClick={onTopics}
              className="inline-flex items-center gap-1.5 rounded-full bg-raised px-3.5 py-2 text-xs font-bold text-mute ring-1 ring-edge transition-colors hover:text-ink"
            >
              <Library className="h-3.5 w-3.5" />
              Lihat topik bantuan
            </button>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={submit} className="border-t border-edge bg-raised px-4 py-3">
        {(me.status === "menunggu" || me.status === "dibahas") && (
          <p className="mb-2 rounded-lg bg-accent-soft px-3 py-1.5 text-[11px] font-semibold text-accent">
            Pesanmu diteruskan ke agen manusia. Demo lengkap: buka Panel Agen → Ambil Alih → kirim balasan.
          </p>
        )}
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ketik pertanyaanmu…"
            className="w-full rounded-xl border-0 bg-card px-4 py-2.5 text-sm text-ink outline-none ring-1 ring-edge placeholder:text-mute/60 focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            aria-label="Kirim"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-canvas transition-transform hover:scale-105 active:scale-95"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
