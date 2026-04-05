import { ICONS, COLORS } from "../App";
import { FaTimes } from "react-icons/fa";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { MdDelete } from "react-icons/md";

export default function TxnRow({ t, isAdmin, onEdit, onDelete }) {
  const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl group transition-colors">
      <span className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-lg ${COLORS[t.category] || COLORS.Other}`}>
        {ICONS[t.category] || "📦"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{t.desc}</p>
        <p className="text-xs text-gray-400">{fmtDate(t.date)} · {t.category}</p>
      </div>
      <span className={`text-sm font-semibold font-mono ${t.type === "income" ? "text-emerald-600" : "text-rose-500"}`}>
        {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
      </span>
      {isAdmin && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(t)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400">✏️</button>
          <button onClick={() => onDelete(t.id)} className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-400"><MdDelete className="text-rose-500" /></button>
        </div>
      )}
    </div>
  );
}