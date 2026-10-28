import { useEffect, useMemo, useRef, useState } from "react";
import {
  BASE_INTENTS,
  DEFAULT_CHIPS,
  ASK_ORDER_TEXT,
  AGENT_OFFER_TEXT,
  FALLBACK_1,
  FALLBACK_2,
  CANNED,
  matchIntent,
  findOrder,
  extractOrderCode,
  freshMe,
  buildMockConvs,
} from "../data/seed";

const ME_KEY = "tanyara:me-conv";
const INTENT_KEY = "tanyara:custom-intents";

let _seq = 0;
const uid = () => `m${Date.now().toString(36)}-${++_seq}`;

function loadCustomIntents() {
  try {
    const raw = JSON.parse(localStorage.getItem(INTENT_KEY) || "[]");
    if (Array.isArray(raw)) return raw;
  } catch {
    /* abaikan data rusak */
  }
  return [];
}

function loadConvs() {
  let me = null;
  try {
    me = JSON.parse(localStorage.getItem(ME_KEY) || "null");
    if (!me || me.id !== "me" || !Array.isArray(me.messages) || me.messages.length === 0) {
      me = null;
    }
  } catch {
    me = null;
  }
  return [...buildMockConvs(), me || freshMe()];
}

// Mesin balasan bot (pure): tentukan pesan & patch state dari satu pesan pelanggan.
function buildReply(text, conv, intents) {
  const code = extractOrderCode(text);
  if (code) {
    const order = findOrder(code);
    if (order) {
      return {
        msgs: [{ role: "bot", text: "Ketemu! Ini status pesananmu:", order }],
        patch: { awaiting: null },
      };
    }
    return {
      msgs: [
        {
          role: "bot",
          text: `Kode ${code} tidak ada di data demo. Coba kode contoh: TNY-20451, TNY-30777, atau TNY-11209 ya.`,
          chips: ["Status pesanan"],
        },
      ],
      patch: { awaiting: null },
    };
  }

  if (conv.awaiting === "order") {
    return {
      msgs: [
        {
          role: "bot",
          text: "Sepertinya itu belum format kode pesanan ya. Ketik dengan pola TNY-xxxxx (contoh: TNY-20451), atau pilih topik di bawah.",
          chips: ["TNY-20451", "TNY-30777", "TNY-11209"],
        },
      ],
    };
  }

  const hit = matchIntent(text, intents);
  if (hit) {
    if (hit.id === "bicara_agen") {
      return { msgs: [{ role: "bot", text: AGENT_OFFER_TEXT, offer: true }] };
    }
    if (hit.needsOrder) {
      return {
        msgs: [{ role: "bot", text: hit.answer || ASK_ORDER_TEXT, chips: ["TNY-20451", "TNY-30777", "TNY-11209"] }],
        patch: { awaiting: "order" },
      };
    }
    return { msgs: [{ role: "bot", text: hit.answer, chips: hit.quick || DEFAULT_CHIPS }] };
  }

  // Fallback: dua kali gagal paham → tawarkan eskalasi
  const f = (conv.fallbacks || 0) + 1;
  if (f >= 2) {
    return { msgs: [{ role: "bot", text: FALLBACK_2, offer: true }], patch: { fallbacks: f } };
  }
  return { msgs: [{ role: "bot", text: FALLBACK_1, chips: DEFAULT_CHIPS }], patch: { fallbacks: f } };
}

export function useTanyaraStore() {
  const [customIntents, setCustomIntents] = useState(loadCustomIntents);
  const [convs, setConvs] = useState(loadConvs);
  const [typing, setTyping] = useState(false);

  const convsRef = useRef(convs);
  const timers = useRef([]);

  useEffect(() => {
    convsRef.current = convs;
  }, [convs]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const intents = useMemo(() => [...BASE_INTENTS, ...customIntents], [customIntents]);

  // Persist percakapan pengunjung demo + intent custom ke localStorage
  useEffect(() => {
    const me = convs.find((c) => c.id === "me");
    if (me) {
      try {
        localStorage.setItem(ME_KEY, JSON.stringify(me));
      } catch {
        /* storage penuh — abaikan */
      }
    }
  }, [convs]);

  useEffect(() => {
    try {
      localStorage.setItem(INTENT_KEY, JSON.stringify(customIntents));
    } catch {
      /* storage penuh — abaikan */
    }
  }, [customIntents]);

  const later = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  };

  const patchMe = (fn) =>
    setConvs((prev) => prev.map((c) => (c.id === "me" ? fn(c) : c)));

  const pushMsg = (convId, m) =>
    setConvs((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, messages: [...c.messages, { ...m, id: uid(), ts: m.ts ?? Date.now() }] }
          : c
      )
    );

  // ---------- Aksi sisi pelanggan ----------
  const sendCustomer = (text) => {
    const clean = String(text || "").trim();
    if (!clean) return;
    const cur = convsRef.current.find((c) => c.id === "me");
    if (!cur) return;

    if (cur.status === "selesai") {
      patchMe((c) => ({ ...c, status: "bot", handler: "bot", agentName: null, awaiting: null, fallbacks: 0 }));
      pushMsg("me", { role: "system", text: "Percakapan dibuka kembali oleh pelanggan." });
    }

    pushMsg("me", { role: "customer", text: clean });

    const forwarded =
      cur.status === "menunggu" ||
      cur.status === "dibahas" ||
      (cur.handler === "agent" && cur.status !== "selesai");
    if (forwarded) {
      patchMe((c) => ({ ...c, unread: true }));
      return;
    }

    // Bot menjawab dengan delay "mengetik" singkat
    setTyping(true);
    later(() => {
      setTyping(false);
      const c = convsRef.current.find((x) => x.id === "me");
      if (!c) return;
      const reply = buildReply(clean, c, intents);
      if (reply.patch) patchMe((prev) => ({ ...prev, ...reply.patch }));
      reply.msgs.forEach((m, i) => later(() => pushMsg("me", m), i * 350));
    }, 700 + Math.random() * 600);
  };

  const escalate = () => {
    const cur = convsRef.current.find((c) => c.id === "me");
    if (!cur || cur.status !== "bot") return;
    pushMsg("me", { role: "system", text: "Percakapan dieskalasi ke agen manusia." });
    patchMe((c) => ({
      ...c,
      status: "menunggu",
      handler: "queue",
      escalatedAt: Date.now(),
      unread: true,
      awaiting: null,
    }));
    later(
      () =>
        pushMsg("me", {
          role: "bot",
          text: "Kamu masuk antrean nomor 2 — estimasi tunggu ±3 menit. Aku kabari di sini begitu agen bergabung ya.",
        }),
      400
    );
    later(() => pushMsg("me", { role: "system", text: "Posisi antrean: 1." }), 5200);
    later(() => {
      const join = Date.now();
      setConvs((prev) =>
        prev.map((c) =>
          c.id === "me" && c.status === "menunggu"
            ? {
                ...c,
                status: "dibahas",
                handler: "agent",
                agentName: "Raka Pratama",
                unread: true,
                messages: [
                  ...c.messages,
                  { id: uid(), ts: join, role: "system", text: "Agen Raka Pratama bergabung ke percakapan." },
                  { id: uid(), ts: join + 1, role: "agent", agentName: "Raka Pratama", text: CANNED[0] },
                ],
              }
            : c
        )
      );
    }, 11000);
  };

  const showTopics = () =>
    pushMsg("me", { role: "bot", text: "Ini topik yang aku pahami — tinggal pilih:", chips: DEFAULT_CHIPS });

  const resetMe = () => setConvs((prev) => prev.map((c) => (c.id === "me" ? freshMe() : c)));

  // ---------- Aksi sisi agen ----------
  const takeOver = (id) => {
    const now = Date.now();
    setConvs((prev) =>
      prev.map((c) =>
        c.id === id && c.status !== "selesai"
          ? {
              ...c,
              status: "dibahas",
              handler: "agent",
              agentName: "Kamu (Demo)",
              unread: false,
              messages: [
                ...c.messages,
                { id: uid(), ts: now, role: "system", text: "Kamu (Demo) mengambil alih percakapan sebagai agen." },
              ],
            }
          : c
      )
    );
  };

  const agentSend = (id, text) => {
    const clean = String(text || "").trim();
    if (!clean) return;
    pushMsg(id, { role: "agent", agentName: "Kamu (Demo)", text: clean });
  };

  const finishConv = (id) =>
    setConvs((prev) =>
      prev.map((c) =>
        c.id === id && c.status !== "selesai"
          ? {
              ...c,
              status: "selesai",
              messages: [
                ...c.messages,
                { id: uid(), ts: Date.now(), role: "system", text: "Percakapan ditandai selesai." },
              ],
            }
          : c
      )
    );

  const openConv = (id) =>
    setConvs((prev) => prev.map((c) => (c.id === id ? { ...c, unread: false } : c)));

  // ---------- Basis jawaban ----------
  const addIntent = ({ name, keywords, questions, answer }) =>
    setCustomIntents((prev) => [
      ...prev,
      {
        id: `ci-${Date.now()}`,
        custom: true,
        name,
        keywords,
        questions: questions.length ? questions : [],
        answer,
        quick: DEFAULT_CHIPS,
      },
    ]);

  const removeIntent = (id) => setCustomIntents((prev) => prev.filter((i) => i.id !== id));

  return {
    convs,
    intents,
    typing,
    sendCustomer,
    escalate,
    showTopics,
    resetMe,
    takeOver,
    agentSend,
    finishConv,
    openConv,
    addIntent,
    removeIntent,
  };
}
