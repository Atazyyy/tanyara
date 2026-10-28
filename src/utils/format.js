export const num = (n) => n.toLocaleString("id-ID");

export const fmtTime = (ts) =>
  new Date(ts).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const fmtDateTime = (ts) => `${fmtDate(ts)}, ${fmtTime(ts)}`;

export const relTime = (ts) => {
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
};

export const initials = (name) =>
  String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export const lastMsg = (conv) =>
  conv.messages.length ? conv.messages[conv.messages.length - 1] : null;
