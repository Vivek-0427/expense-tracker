import SpendBar from "../components/SpendBar";
import { ICONS } from "../App";

const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const BAR_COLORS = ["bg-indigo-400","bg-pink-400","bg-orange-400","bg-teal-400","bg-purple-400","bg-blue-400"];

export default function Insights({ transactions, summary }) {
  const catSpend = (() => {
    const map = {};
    transactions.filter(t => t.type === "expense").forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map).map(([cat, amt]) => ({ cat, amt })).sort((a, b) => b.amt - a.amt);
  })();

  const maxSpend   = catSpend[0]?.amt || 1;
  const largest    = [...transactions].sort((a, b) => b.amount - a.amount)[0];
  const maxBarVal  = Math.max(summary.income, summary.expenses, 1);

  return (
    <div className="space-y-5">
      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Top Category</p>
          <p className="text-lg font-bold text-gray-800">{catSpend[0]?.cat || "—"}</p>
          <p className="text-xs text-gray-400">{catSpend[0] ? fmt(catSpend[0].amt) : "No data"}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Total Transactions</p>
          <p className="text-lg font-bold text-gray-800">{transactions.length}</p>
          <p className="text-xs text-gray-400">
            {transactions.filter(t => t.type === "income").length} income · {transactions.filter(t => t.type === "expense").length} expense
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 col-span-2 md:col-span-1">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Largest Transaction</p>
          <p className="text-lg font-bold text-gray-800">{fmt(largest?.amount || 0)}</p>
          <p className="text-xs text-gray-400 truncate">{largest?.desc || "—"}</p>
        </div>
      </div>

      {/* Spending by Category */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Spending by Category</h2>
        {catSpend.length === 0 ? (
          <p className="text-sm text-gray-400">No expense data.</p>
        ) : (
          <div className="space-y-3">
            {catSpend.map(({ cat, amt }, i) => (
              <SpendBar key={cat} label={`${ICONS[cat] || "📦"} ${cat}`} amount={amt} max={maxSpend} color={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </div>
        )}
      </div>

      {/* Income vs Expenses */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Income vs Expenses</h2>
        <div className="flex items-end gap-6 h-36">
          {[
            { label: "Income",   value: summary.income,   color: "bg-emerald-400" },
            { label: "Expenses", value: summary.expenses, color: "bg-rose-400"    },
            { label: "Savings%", value: summary.savings,  color: "bg-indigo-400", isPercent: true },
          ].map(({ label, value, color, isPercent }) => {
            const h = isPercent ? Math.max(value, 2) : Math.round((value / maxBarVal) * 100);
            return (
              <div key={label} className="flex flex-col items-center gap-2 flex-1">
                <span className="text-xs font-mono text-gray-500">{isPercent ? `${value}%` : fmt(value)}</span>
                <div className={`w-full ${color} rounded-t-lg`} style={{ height: `${h}%`, minHeight: 15, transition: "height 0.5s ease" }} />
                <span className="text-xs text-gray-500 font-medium">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}