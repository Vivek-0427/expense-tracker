import TxnRow from "../components/TxnRow";
import { CATEGORIES } from "../App";

export default function Transactions({ transactions, search, setSearch, typeF, setTypeF, catF, setCatF, isAdmin, onAdd, onEdit, onDelete }) {
  const selectCls = "border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-indigo-400";

  return (
    <div className="space-y-4">
      {/* Filters + Add */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search…"
          className="flex-1 min-w-36 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
        />
        <select value={typeF} onChange={e => setTypeF(e.target.value)} className={selectCls}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={catF} onChange={e => setCatF(e.target.value)} className={selectCls}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        {isAdmin && (
          <button onClick={onAdd} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            + Add
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm gap-2">
            <span className="text-3xl">🔍</span>
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="px-2 py-2 divide-y divide-gray-50">
            {transactions.map(t => (
              <TxnRow key={t.id} t={t} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 px-5 py-3 border-t border-gray-100">
          {transactions.length} record{transactions.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}