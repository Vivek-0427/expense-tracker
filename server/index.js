const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let transactions = [
  { id: 1,  desc: "Monthly Salary",       amount: 120000, type: "income",  category: "Salary",        date: "2026-03-01" },
  { id: 2,  desc: "House Rent",           amount: 25000,  type: "expense", category: "Housing",       date: "2026-03-02" },
  { id: 3,  desc: "Swiggy Orders",        amount: 3200,   type: "expense", category: "Food",          date: "2026-03-05" },
  { id: 4,  desc: "Electricity Bill",     amount: 1950,   type: "expense", category: "Utilities",     date: "2026-03-08" },
  { id: 5,  desc: "Freelance Project",    amount: 42000,  type: "income",  category: "Freelance",     date: "2026-03-10" },
  { id: 6,  desc: "Zepto Grocery",        amount: 3600,   type: "expense", category: "Food",          date: "2026-03-12" },
  { id: 7,  desc: "Decathlon Gear",       amount: 4200,   type: "expense", category: "Shopping",      date: "2026-03-15" },
  { id: 8,  desc: "Namma Metro Pass",     amount: 800,    type: "expense", category: "Transport",     date: "2026-03-16" },
  { id: 9,  desc: "SIP Investment",       amount: 10000,  type: "expense", category: "Investment",    date: "2026-03-18" },
  { id: 10, desc: "Netflix Subscription", amount: 649,    type: "expense", category: "Entertainment", date: "2026-03-20" },
  { id: 11, desc: "Mutual Fund Return",   amount: 6800,   type: "income",  category: "Investment",    date: "2026-03-22" },
  { id: 12, desc: "Pharmacy",            amount: 1200,   type: "expense", category: "Health",        date: "2026-03-25" },
  { id: 13, desc: "Restaurant Dinner",   amount: 2800,   type: "expense", category: "Food",          date: "2026-03-27" },
  { id: 14, desc: "Uber Rides",          amount: 1400,   type: "expense", category: "Transport",     date: "2026-03-28" },
  { id: 15, desc: "Udemy Course",        amount: 1299,   type: "expense", category: "Education",     date: "2026-03-29" },
];

let nextId = 16;

// GET all transactions (supports ?type=&category=&q= filters)
app.get("/api/transactions", (req, res) => {
  const { type, category, q } = req.query;
  let result = [...transactions];
  if (type && type !== "all") result = result.filter(t => t.type === type);
  if (category && category !== "all") result = result.filter(t => t.category === category);
  if (q) result = result.filter(t => t.desc.toLowerCase().includes(q.toLowerCase()));
  res.json(result);
});

// GET summary stats
app.get("/api/summary", (req, res) => {
  const income   = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance  = income - expenses;
  const savings  = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
  res.json({ income, expenses, balance, savings });
});

// POST add transaction
app.post("/api/transactions", (req, res) => {
  const { desc, amount, type, category, date } = req.body;
  if (!desc || !amount || !type || !category || !date) {
    return res.status(400).json({ error: "All fields are required." });
  }
  const t = { id: nextId++, desc, amount: Number(amount), type, category, date };
  transactions.push(t);
  res.status(201).json(t);
});

// PUT edit transaction
app.put("/api/transactions/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = transactions.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found." });
  transactions[idx] = { ...transactions[idx], ...req.body, id, amount: Number(req.body.amount) };
  res.json(transactions[idx]);
});

// DELETE transaction
app.delete("/api/transactions/:id", (req, res) => {
  const id = Number(req.params.id);
  transactions = transactions.filter(t => t.id !== id);
  res.json({ success: true });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));