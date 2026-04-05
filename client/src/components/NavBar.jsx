const NAV = [
  { id: "dashboard",    label: "Dashboard"    },
  { id: "transactions", label: "Transactions" },
  { id: "insights",     label: "Insights"     },
];

export default function NavBar({ tab, setTab, role, setRole }) {
  const activeIndex = NAV.findIndex(n => n.id === tab);

  return (
    <>
      {/* Top Nav */}
      <header className="bg-gray-100 border-b border-gray-200 shadow-2xl sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 flex items-center h-14 gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-gray-800 text-lg mr-2">
            <span className="w-7 h-7 bg-purple-600 text-white rounded-lg flex items-center justify-center text-lg font-bold">FL</span>
            FINGER
          </div>

        <nav className="relative flex bg-gray-700 text-white p-1 rounded-full w-fit">

          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`px-5 py-1.5 text-sm font-medium rounded-full transition-all
              ${tab === n.id 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-white hover:text-indigo-300"}`}
            >
              {n.label}
            </button>
          ))}

        </nav>

          {/* Role Switcher */}
          <div className="flex items-center gap-2 text-right ml-auto">
              <span className="text-sm text-gray-600">Role:</span>

            <div className="relative flex bg-gray-700 rounded-2xl p-1">
              
              {/* Sliding Indicator */}
              <div
                className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-xl shadow-sm 
                transition-all duration-300 ease-in-out
                ${role === "admin" ? "translate-x-14" : "translate-x-0"}`}
              />

              {/* Buttons */}
              {["viewer", "admin"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`relative z-10 px-3 py-1 text-xs font-semibold capitalize 
                  transition-colors duration-200
                  ${role === r ? "text-indigo-600" : "text-white"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}