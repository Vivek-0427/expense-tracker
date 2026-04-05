export default function SpendBar({ label, amount, max, color }) {
  const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const pct = max > 0 ? Math.round((amount / max) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-28 truncate">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%`, transition: "width 0.5s ease" }} />
      </div>
      <span className="text-xs font-mono text-gray-500 w-20 text-right">{fmt(amount)}</span>
    </div>
  );
}