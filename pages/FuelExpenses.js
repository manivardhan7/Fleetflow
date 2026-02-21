import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Card, Modal, FormInput, FormSelect,
  PrimaryBtn, GhostBtn, PageHeader,
} from "../components/UI";

const EMPTY_FORM = { vehicleId: "", tripId: "", liters: "", cost: "", date: "", kmDriven: "" };

export default function FuelExpenses() {
  const { vehicles, trips, fuelLogs, setFuelLogs } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function handleAdd() {
    if (!form.vehicleId || !form.liters) return;
    setFuelLogs([
      ...fuelLogs,
      {
        ...form,
        id: "F" + Date.now(),
        liters: +form.liters,
        cost: +form.cost,
        kmDriven: +form.kmDriven,
      },
    ]);
    setShowModal(false);
    setForm(EMPTY_FORM);
  }

  function handleDelete(id) {
    if (window.confirm("Delete this fuel log?")) {
      setFuelLogs(fuelLogs.filter((f) => f.id !== id));
    }
  }

  // Per-vehicle summary cards
  const vehicleSummary = vehicles.map((v) => {
    const logs = fuelLogs.filter((f) => f.vehicleId === v.id);
    const totalCost = logs.reduce((s, f) => s + f.cost, 0);
    const totalKm = logs.reduce((s, f) => s + f.kmDriven, 0);
    const totalLiters = logs.reduce((s, f) => s + f.liters, 0);
    const efficiency = totalLiters > 0 ? (totalKm / totalLiters).toFixed(1) : "N/A";
    return { ...v, totalCost, efficiency };
  });

  return (
    <div>
      <PageHeader
        title="Fuel and Expenses"
        subtitle="Financial tracking per asset"
        action={
          <PrimaryBtn onClick={() => { setShowModal(true); setForm(EMPTY_FORM); }}>
            + Log Fuel
          </PrimaryBtn>
        }
      />

      {/* Per-Vehicle Cost Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {vehicleSummary.map((v) => (
          <Card key={v.id}>
            <div className="text-white font-bold text-sm mb-1">{v.name}</div>
            <div className="text-cyan-400 font-black text-xl">Rs {v.totalCost.toLocaleString()}</div>
            <div className="text-gray-500 text-xs mt-1">Total Fuel Cost</div>
            <div className="text-gray-400 text-xs mt-1">{v.efficiency} km/L</div>
          </Card>
        ))}
      </div>

      {/* Fuel Log Table */}
      <Card>
        <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Fuel Log History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-700 text-left">
                <th className="pb-3 font-medium">Vehicle</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Liters</th>
                <th className="pb-3 font-medium">Cost (Rs)</th>
                <th className="pb-3 font-medium">KM Driven</th>
                <th className="pb-3 font-medium">Efficiency</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fuelLogs.map((f) => {
                const v = vehicles.find((x) => x.id === f.vehicleId);
                const efficiency = f.liters > 0 ? (f.kmDriven / f.liters).toFixed(1) : "N/A";
                return (
                  <tr key={f.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="py-3 text-white font-semibold">{v?.name}</td>
                    <td className="py-3 text-gray-400">{f.date}</td>
                    <td className="py-3 text-gray-400">{f.liters} L</td>
                    <td className="py-3 text-gray-400">Rs {f.cost?.toLocaleString()}</td>
                    <td className="py-3 text-gray-400">{f.kmDriven} km</td>
                    <td className="py-3 text-cyan-400 font-bold">{efficiency} km/L</td>
                    <td className="py-3">
                      <button onClick={() => handleDelete(f.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <Modal title="Log Fuel Entry" onClose={() => setShowModal(false)}>
          <FormSelect label="Vehicle *" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}>
            <option value="">Select vehicle...</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </FormSelect>
          <FormSelect label="Link to Trip (optional)" value={form.tripId} onChange={(e) => setForm({ ...form, tripId: e.target.value })}>
            <option value="">No trip linked</option>
            {trips.map((t) => (
              <option key={t.id} value={t.id}>{t.id} — {t.origin} to {t.destination}</option>
            ))}
          </FormSelect>
          <FormInput label="Liters *" type="number" value={form.liters} onChange={(e) => setForm({ ...form, liters: e.target.value })} />
          <FormInput label="Cost (Rs) *" type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
          <FormInput label="KM Driven" type="number" value={form.kmDriven} onChange={(e) => setForm({ ...form, kmDriven: e.target.value })} />
          <FormInput label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <div className="flex gap-3 justify-end">
            <GhostBtn onClick={() => setShowModal(false)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={handleAdd}>Save Entry</PrimaryBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}