import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Card, StatusPill, Modal, FormInput, FormSelect,
  PrimaryBtn, GhostBtn, ErrorBox, PageHeader,
} from "../components/UI";

const EMPTY_FORM = {
  vehicleId: "", driverId: "", origin: "", destination: "",
  cargo: "", cargoWeight: "", date: "",
};

export default function TripDispatcher() {
  const { vehicles, setVehicles, drivers, setDrivers, trips, setTrips } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const availableVehicles = vehicles.filter((v) => v.status === "Available");
  const availableDrivers = drivers.filter(
    (d) => d.status === "On Duty" && new Date(d.licenseExpiry) > new Date()
  );

  function handleCreate() {
    setError("");
    if (!form.vehicleId || !form.driverId || !form.origin || !form.destination || !form.cargoWeight) {
      setError("Please fill all required fields."); return;
    }
    const vehicle = vehicles.find((v) => v.id === form.vehicleId);
    if (+form.cargoWeight > vehicle.capacity) {
      setError(
        `Cargo weight (${form.cargoWeight} kg) exceeds vehicle max capacity (${vehicle.capacity} kg). Please choose a bigger vehicle.`
      );
      return;
    }
    const newTrip = {
      ...form,
      id: "T" + Date.now(),
      status: "Dispatched",
      cargoWeight: +form.cargoWeight,
      revenue: 0,
    };
    setTrips([...trips, newTrip]);
    setVehicles(vehicles.map((v) => v.id === form.vehicleId ? { ...v, status: "On Trip" } : v));
    setShowModal(false);
    setForm(EMPTY_FORM);
  }

  function updateStatus(id, newStatus) {
  const trip = trips.find((t) => t.id === id);
  setTrips(trips.map((t) => t.id === id ? { ...t, status: newStatus } : t));
  if (newStatus === "Completed" || newStatus === "Cancelled") {
    setVehicles(vehicles.map((v) => v.id === trip.vehicleId ? { ...v, status: "Available" } : v));
    // Update driver trip completion stats
    setDrivers(drivers.map((d) => {
      if (d.id !== trip.driverId) return d;
      return {
        ...d,
        trips: d.trips + 1,
        completed: newStatus === "Completed" ? d.completed + 1 : d.completed,
      };
    }));
  
}
  }

  function handleDelete(id) {
    if (window.confirm("Delete this trip record?")) {
      setTrips(trips.filter((t) => t.id !== id));
    }
  }

  return (
    <div>
      <PageHeader
        title="Trip Dispatcher"
        subtitle="Create and manage delivery trips"
        action={
          <PrimaryBtn onClick={() => { setShowModal(true); setError(""); setForm(EMPTY_FORM); }}>
            + New Trip
          </PrimaryBtn>
        }
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-700 text-left">
                <th className="pb-3 font-medium">Trip ID</th>
                <th className="pb-3 font-medium">Route</th>
                <th className="pb-3 font-medium">Vehicle</th>
                <th className="pb-3 font-medium">Driver</th>
                <th className="pb-3 font-medium">Weight (kg)</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t) => {
                const v = vehicles.find((x) => x.id === t.vehicleId);
                const d = drivers.find((x) => x.id === t.driverId);
                return (
                  <tr key={t.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="py-3 text-gray-400 font-mono text-xs">{t.id}</td>
                    <td className="py-3 text-white font-semibold">
                      {t.origin} → {t.destination}
                      <div className="text-gray-500 text-xs font-normal">{t.cargo}</div>
                    </td>
                    <td className="py-3 text-gray-400">{v?.name}</td>
                    <td className="py-3 text-gray-400">{d?.name}</td>
                    <td className="py-3 text-gray-400">{t.cargoWeight}</td>
                    <td className="py-3 text-gray-400">{t.date}</td>
                    <td className="py-3"><StatusPill status={t.status} /></td>
                    <td className="py-3">
                      <div className="flex gap-2 flex-wrap">
                        {t.status === "Dispatched" && (
                          <>
                            <button onClick={() => updateStatus(t.id, "Completed")} className="text-xs text-green-400 hover:underline">Complete</button>
                            <button onClick={() => updateStatus(t.id, "Cancelled")} className="text-xs text-yellow-400 hover:underline">Cancel</button>
                          </>
                        )}
                        {t.status === "Draft" && (
                          <button onClick={() => updateStatus(t.id, "Dispatched")} className="text-xs text-blue-400 hover:underline">Dispatch</button>
                        )}
                        <button onClick={() => handleDelete(t.id)} className="text-xs text-red-400 hover:underline">Delete</button>
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
        <Modal title="Create New Trip" onClose={() => setShowModal(false)}>
          <ErrorBox message={error} />
          <FormSelect label="Vehicle *" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}>
            <option value="">Select available vehicle...</option>
            {availableVehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.name} — max {v.capacity} kg</option>
            ))}
          </FormSelect>
          <FormSelect label="Driver *" value={form.driverId} onChange={(e) => setForm({ ...form, driverId: e.target.value })}>
            <option value="">Select available driver...</option>
            {availableDrivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name} ({d.category})</option>
            ))}
          </FormSelect>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Origin *" placeholder="Chennai" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
            <FormInput label="Destination *" placeholder="Bangalore" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
          </div>
          <FormInput label="Cargo Description" placeholder="Electronics, Garments..." value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
          <FormInput label="Cargo Weight (kg) *" type="number" value={form.cargoWeight} onChange={(e) => setForm({ ...form, cargoWeight: e.target.value })} />
          <FormInput label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <div className="flex gap-3 justify-end mt-2">
            <GhostBtn onClick={() => setShowModal(false)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={handleCreate}>Dispatch Trip</PrimaryBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}