// Donut SVG buatan sendiri: proporsi percakapan yang diselesaikan
// bot (cyan) vs butuh agen manusia (violet).
export default function StatDonut({ bot, agen }) {
  const total = Math.max(1, bot + agen);
  const pct = Math.min(Math.max(bot / total, 0), 1);
  const R = 40;
  const C = 2 * Math.PI * R;

  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" role="img" aria-label="Proporsi penanganan bot vs agen">
        <circle cx="50" cy="50" r={R} fill="none" stroke="#24394e" strokeWidth="12" />
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="12"
          strokeDasharray={`${C} ${C}`}
          strokeDashoffset={-pct * C}
        />
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="12"
          strokeDasharray={`${pct * C} ${C}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-extrabold text-ink">{Math.round(pct * 100)}%</span>
        <span className="text-[10px] font-semibold text-mute">oleh bot</span>
      </div>
    </div>
  );
}
