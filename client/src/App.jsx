import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/NavBar";
import Modal from "./components/Modal";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";

const API = "http://localhost:4000/api";

export const CATEGORIES = ["Food","Transport","Shopping","Entertainment","Health","Housing","Utilities","Salary","Freelance","Investment","Education","Other"];
export const ICONS = { Food:"🍜", Transport:"🚌", Shopping:"🛍️", Entertainment:"🎬", Health:"💊", Housing:"🏠", Utilities:"⚡", Salary:"💼", Freelance:"💻", Investment:"📈", Education:"📚", Other:"📦" };
export const COLORS = { Food:"bg-orange-100 text-orange-600", Transport:"bg-blue-100 text-blue-600", Shopping:"bg-pink-100 text-pink-600", Entertainment:"bg-purple-100 text-purple-600", Health:"bg-emerald-100 text-emerald-600", Housing:"bg-yellow-100 text-yellow-600", Utilities:"bg-cyan-100 text-cyan-600", Salary:"bg-indigo-100 text-indigo-600", Freelance:"bg-lime-100 text-lime-600", Investment:"bg-teal-100 text-teal-600", Education:"bg-rose-100 text-rose-600", Other:"bg-gray-100 text-gray-600" };

export const EMPTY_FORM = { desc: "", amount: "", type: "expense", category: "Food", date: new Date().toISOString().slice(0, 10) };

export default function App() {
  const [tab, setTab]           = useState("dashboard");
  const [role, setRole]         = useState("viewer");
  const [transactions, setTxns] = useState([]);
  const [summary, setSummary]   = useState({ income: 0, expenses: 0, balance: 0, savings: 0 });
  const [loading, setLoading]   = useState(true);
  const [apiError, setApiError] = useState(false);

  // filters
  const [search, setSearch] = useState("");
  const [typeF, setTypeF]   = useState("all");
  const [catF, setCatF]     = useState("all");

  // modal
  const [modal, setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [formErr, setFormErr] = useState("");

  const isAdmin = role === "admin";

  const fetchAll = useCallback(async () => {
    try {
      const params = new URLSearchParams({ type: typeF, category: catF, q: search });
      const [txRes, sumRes] = await Promise.all([
        fetch(`${API}/transactions?${params}`),
        fetch(`${API}/summary`),
      ]);
      setTxns(await txRes.json());
      setSummary(await sumRes.json());
      setApiError(false);
    } catch {
      setApiError(true);
    } finally {
      setLoading(false);
    }
  }, [typeF, catF, search]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd  = () => { setForm(EMPTY_FORM); setEditing(null); setFormErr(""); setModal(true); };
  const openEdit = (t) => { setForm({ desc: t.desc, amount: t.amount, type: t.type, category: t.category, date: t.date }); setEditing(t); setFormErr(""); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.desc.trim()) return setFormErr("Description is required.");
    if (!form.amount || +form.amount <= 0) return setFormErr("Enter a valid amount.");
    try {
      if (editing) {
        await fetch(`${API}/transactions/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      } else {
        await fetch(`${API}/transactions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      }
      closeModal();
      fetchAll();
    } catch {
      setFormErr("Server error. Is the backend running?");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    await fetch(`${API}/transactions/${id}`, { method: "DELETE" });
    fetchAll();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar tab={tab} setTab={setTab} role={role} setRole={setRole} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {apiError && (
          <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
            ⚠️ Cannot reach backend at <code>localhost:4000</code>. Run <code>npm run dev</code> inside <code>/server</code>.
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading…</div>
        ) : (
          <>
            {tab === "dashboard" && (
              <Dashboard
                transactions={transactions}
                summary={summary}
                isAdmin={isAdmin}
                setTab={setTab}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            )}
            {tab === "transactions" && (
              <Transactions
                transactions={transactions}
                search={search} setSearch={setSearch}
                typeF={typeF}   setTypeF={setTypeF}
                catF={catF}     setCatF={setCatF}
                isAdmin={isAdmin}
                onAdd={openAdd}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            )}
            {tab === "insights" && (
              <Insights transactions={transactions} summary={summary} />
            )}
          </>
        )}
      </main>

      {modal && isAdmin && (
        <Modal
          form={form} setForm={setForm}
          error={formErr}
          onSave={handleSave}
          onClose={closeModal}
          editing={editing}
        />
      )}
    </div>
  );
}