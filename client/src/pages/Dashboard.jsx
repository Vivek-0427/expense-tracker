import SummaryCard from "../components/SummaryCard";
import TxnRow from "../components/TxnRow";

const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function Dashboard({ transactions, summary, isAdmin, setTab, onEdit, onDelete }) {
  const recent = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Balance"  value={fmt(summary.balance)}  sub="All time"     accent="bg-indigo-600 text-white" />
        <SummaryCard label="Income"   value={fmt(summary.income)}   sub="This month"   accent="bg-emerald-50 text-emerald-800" />
        <SummaryCard label="Expenses" value={fmt(summary.expenses)} sub="This month"   accent="bg-rose-50 text-rose-800" />
        <SummaryCard label="Savings"  value={`${summary.savings}%`} sub="Savings rate" accent="bg-amber-50 text-amber-800" />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Transactions</h2>
          <button onClick={() => setTab("transactions")} className="text-xs text-indigo-500 hover:underline">
            View all →
          </button>
        </div>
        <div className="px-2 py-2 divide-y divide-gray-50">
          {recent.map(t => (
            <TxnRow key={t.id} t={t} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}