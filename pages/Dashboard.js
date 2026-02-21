import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, KPICard, StatusPill } from "../components/UI";

export default function Dashboard() {
  const { vehicles, trips } = useApp();
  const [filter, setFilter] = useState("All");

  const activeFleet = vehicles.filter((v) => v.status === "On Trip").length;
  const maintenanceAlerts = vehicles.filter((v) => v.status === "In Shop").length;
  const utilization = Math.round((activeFleet / vehicles.length) * 100);
  const pendingCargo = trips.filter((t) => t.status === "Draft").length;
  const filtered = vehicles.filter((v) => filter === "All" || v.type === filter);

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-1">Command Center</h1>
      <p className="text-gray-500 text-sm mb-6">Real-time fleet overview</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard label="Active Fleet"       value={activeFleet}        icon="🚚" color="text-blue-400" />
        <KPICard label="Maintenance Alerts" value={maintenanceAlerts}  icon="🔧" color="text-yellow-400" />
        <KPICard label="Utilization Rate"   value={`${utilization}%`}  icon="📊" color="text-cyan-400" />
        <KPICard label="Pending Cargo"      value={pendingCargo}       icon="📦" color="text-purple-400" />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["All", "Truck", "Van", "Bike", "Car"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
              filter === t
                ? "bg-cyan-500 text-black border-cyan-500"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:border-cyan-500 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Fleet Table */}
      <Card className="mb-4">
        <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Fleet Status</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-700 text-left">
                <th className="pb-3 font-medium">Vehicle</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Plate</th>
                <th className="pb-3 font-medium">Odometer</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                  <td className="py-3 text-white font-semibold">
                    {v.name}
                    <div className="text-gray-500 text-xs font-normal">{v.model}</div>
                  </td>
                  <td className="py-3 text-gray-400">{v.type}</td>
                  <td className="py-3 text-gray-400 font-mono text-xs">{v.plate}</td>
                  <td className="py-3 text-gray-400">{v.odometer.toLocaleString()} km</td>
                  <td className="py-3"><StatusPill status={v.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Trips */}
      <Card>
        <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Recent Trips</h2>
        <div className="space-y-2">
          {trips.slice(0, 5).map((t) => {
            const v = vehicles.find((x) => x.id === t.vehicleId);
            return (
              <div key={t.id} className="flex items-center justify-between bg-gray-700 rounded-xl px-4 py-3">
                <div>
                  <span className="text-white font-semibold text-sm">{t.origin} to {t.destination}</span>
                  <span className="text-gray-500 text-xs ml-2">{v?.name} - {t.cargo}</span>
                </div>
                <StatusPill status={t.status} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}