// ─── Status Pill ───────────────────────────────────────────
export function StatusPill({ status }) {
  const map = {
    "Available":      "bg-green-900 text-green-300 border border-green-700",
    "On Trip":        "bg-blue-900 text-blue-300 border border-blue-700",
    "In Shop":        "bg-yellow-900 text-yellow-300 border border-yellow-700",
    "Out of Service": "bg-red-900 text-red-300 border border-red-700",
    "Dispatched":     "bg-blue-900 text-blue-300 border border-blue-700",
    "Completed":      "bg-green-900 text-green-300 border border-green-700",
    "Cancelled":      "bg-red-900 text-red-300 border border-red-700",
    "Draft":          "bg-gray-700 text-gray-300 border border-gray-600",
    "On Duty":        "bg-green-900 text-green-300 border border-green-700",
    "Off Duty":       "bg-gray-700 text-gray-300 border border-gray-600",
    "Suspended":      "bg-red-900 text-red-300 border border-red-700",
    "In Progress":    "bg-yellow-900 text-yellow-300 border border-yellow-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${map[status] || "bg-gray-700 text-gray-300"}`}>
      {status}
    </span>
  );
}

// ─── Card ───────────────────────────────────────────────────
export function Card({ children, className = "" }) {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );
}

// ─── KPI Card ───────────────────────────────────────────────
export function KPICard({ label, value, icon, color }) {
  return (
    <Card className="flex items-center gap-4">
      <div className="text-4xl">{icon}</div>
      <div>
        <div className={`text-2xl font-black ${color}`}>{value}</div>
        <div className="text-gray-400 text-sm mt-1">{label}</div>
      </div>
    </Card>
  );
}

// ─── Modal ──────────────────────────────────────────────────
export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h3 className="text-lg font-black text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Form Input ─────────────────────────────────────────────
export function FormInput({ label, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm text-gray-400 mb-1 font-medium">{label}</label>}
      <input
        {...props}
        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
      />
    </div>
  );
}

// ─── Form Select ────────────────────────────────────────────
export function FormSelect({ label, children, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm text-gray-400 mb-1 font-medium">{label}</label>}
      <select
        {...props}
        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
      >
        {children}
      </select>
    </div>
  );
}

// ─── Form Textarea ──────────────────────────────────────────
export function FormTextarea({ label, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm text-gray-400 mb-1 font-medium">{label}</label>}
      <textarea
        {...props}
        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 h-24 resize-none transition-colors"
      />
    </div>
  );
}

// ─── Buttons ────────────────────────────────────────────────
export function PrimaryBtn({ children, onClick, disabled = false, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostBtn({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium text-sm transition-all ${className}`}
    >
      {children}
    </button>
  );
}

// ─── Alert Boxes ────────────────────────────────────────────
export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div className="bg-red-900 border border-red-700 text-red-300 text-sm rounded-xl px-4 py-3 mb-4">
      {message}
    </div>
  );
}

export function SuccessBox({ message }) {
  if (!message) return null;
  return (
    <div className="bg-green-900 border border-green-700 text-green-300 text-sm rounded-xl px-4 py-3 mb-4">
      {message}
    </div>
  );
}

export function WarningBox({ message }) {
  if (!message) return null;
  return (
    <div className="bg-yellow-900 border border-yellow-700 text-yellow-300 text-xs rounded-xl px-4 py-3 mb-4">
      {message}
    </div>
  );
}

// ─── Page Header ────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-black text-white mb-1">{title}</h1>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── Table Wrapper ──────────────────────────────────────────
export function TableWrapper({ children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ columns }) {
  return (
    <thead>
      <tr className="text-gray-500 border-b border-gray-700 text-left">
        {columns.map((col) => (
          <th key={col} className="pb-3 font-medium">{col}</th>
        ))}
      </tr>
    </thead>
  );
}