import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Card, StatusPill, Modal, FormInput, FormSelect, FormTextarea,
  PrimaryBtn, GhostBtn, WarningBox, PageHeader,
} from "../components/UI";

const EMPTY_FORM = { vehicleId: "", type: "", date: "", cost: "", notes: "" };

export default function MaintenanceLogs() {
  const { vehicles, setVehicles, maintenance, setMaintenance } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function handleAdd() {
    if (!form.vehicleId || !form.type) return;
    const newLog = {
      ...form,
      id: "M" + Date.now(),
      cost: +form.cost,
      status: "In Progress",
    };
    setMaintenance([...maintenance, newLog]);
    // Auto-set vehicle to In Shop
    setVehicles(vehicles.map((v) =>
      v.id === form.vehicleId ? { ...v, status: "In Shop" } : v
    ));
    setShowModal(false);
    setForm(EMPTY_FORM);
  }

  function completeService(id, vehicleId) {
    setMaintenance(maintenance.map((m) => m.id === id ? { ...m, status: "Completed" } : m));
    setVehicles(vehicles.map((v) => v.id === vehicleId ? { ...v, status: "Available" } : v));
  }

  function handleDelete(id) {
    if (window.confirm("Delete this maintenance record?")) {
      setMaintenance(maintenance.filter((m) => m.id !== id));
    }
  }

  return (
    <div>
      <PageHeader
        title="Maintenance Logs"
        subtitle="Vehicle service and health tracking"
        action={
          <PrimaryBtn onClick={() => { setShowModal(true); setForm(EMPTY_FORM); }}>
            + Log Service
          </PrimaryBtn>
        }
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-700 text-left">
                <th className="pb-3 font-medium">Vehicle</th>
                <th className="pb-3 font-medium">Service Type</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Cost (Rs)</th>
                <th className="pb-3 font-medium">Notes</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {maintenance.map((m) => {
                const v = vehicles.find((x) => x.id === m.vehicleId);
                return (
                  <tr key={m.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="py-3 text-white font-semibold">{v?.name}</td>
                    <td className="py-3 text-gray-400">{m.type}</td>
                    <td className="py-3 text-gray-400">{m.date}</td>
                    <td className="py-3 text-gray-400">Rs {m.cost?.toLocaleString()}</td>
                    <td className="py-3 text-gray-500 text-xs max-w-xs truncate">{m.notes}</td>
                    <td className="py-3"><StatusPill status={m.status} /></td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        {m.status === "In Progress" && (
                          <button onClick={() => completeService(m.id, m.vehicleId)} className="text-xs text-green-400 hover:underline">
                            Mark Done
                          </button>
                        )}
                        <button onClick={() => handleDelete(m.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <Modal title="Log Maintenance / Service" onClose={() => setShowModal(false)}>
          <WarningBox message="Adding a service log will automatically set the vehicle status to In Shop and remove it from the dispatcher pool." />
          <FormSelect label="Vehicle *" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}>
            <option value="">Select vehicle...</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.name} — {v.plate}</option>
            ))}
          </FormSelect>
          <FormSelect label="Service Type *" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="">Select type...</option>
            <option>Oil Change</option>
            <option>Tyre Rotation</option>
            <option>Brake Service</option>
            <option>Engine Repair</option>
            <option>Battery Replacement</option>
            <option>Other</option>
          </FormSelect>
          <FormInput label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <FormInput label="Cost (Rs)" type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
          <FormTextarea label="Notes" placeholder="Describe the work done..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex gap-3 justify-end">
            <GhostBtn onClick={() => setShowModal(false)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={handleAdd}>Log Service</PrimaryBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}