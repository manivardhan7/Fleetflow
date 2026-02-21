import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Card, StatusPill, Modal, FormInput, FormSelect,
  PrimaryBtn, GhostBtn, ErrorBox, PageHeader,
} from "../components/UI";

const EMPTY_FORM = {
  name: "", model: "", plate: "", type: "Van",
  capacity: "", odometer: "", acquisitionCost: "", acquired: "",
};

export default function VehicleRegistry() {
  const { vehicles, setVehicles } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  }

  function openEdit(v) {
    setEditing(v.id);
    setForm({ ...v });
    setError("");
    setShowModal(true);
  }

  function handleSave() {
    if (!form.name || !form.plate || !form.capacity) {
      setError("Vehicle name, plate and capacity are required.");
      return;
    }
    if (editing) {
      setVehicles(vehicles.map((v) =>
        v.id === editing
          ? { ...v, ...form, capacity: +form.capacity, odometer: +form.odometer }
          : v
      ));
    } else {
      setVehicles([
        ...vehicles,
        {
          ...form,
          id: "V" + Date.now(),
          capacity: +form.capacity,
          odometer: +form.odometer,
          status: "Available",
        },
      ]);
    }
    setShowModal(false);
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      setVehicles(vehicles.filter((v) => v.id !== id));
    }
  }

  function toggleRetire(id) {
    setVehicles(vehicles.map((v) =>
      v.id === id
        ? { ...v, status: v.status === "Out of Service" ? "Available" : "Out of Service" }
        : v
    ));
  }

  return (
    <div>
      <PageHeader
        title="Vehicle Registry"
        subtitle="Manage your fleet assets"
        action={<PrimaryBtn onClick={openAdd}>+ Add Vehicle</PrimaryBtn>}
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-700 text-left">
                <th className="pb-3 font-medium">Name / Model</th>
                <th className="pb-3 font-medium">Plate</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Capacity</th>
                <th className="pb-3 font-medium">Odometer</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                  <td className="py-3 text-white font-semibold">
                    {v.name}
                    <div className="text-gray-500 text-xs font-normal">{v.model}</div>
                  </td>
                  <td className="py-3 text-gray-400 font-mono text-xs">{v.plate}</td>
                  <td className="py-3 text-gray-400">{v.type}</td>
                  <td className="py-3 text-gray-400">{v.capacity} kg</td>
                  <td className="py-3 text-gray-400">{v.odometer?.toLocaleString()} km</td>
                  <td className="py-3"><StatusPill status={v.status} /></td>
                  <td className="py-3">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(v)} className="text-xs text-cyan-400 hover:underline">Edit</button>
                      <button onClick={() => toggleRetire(v.id)} className="text-xs text-yellow-400 hover:underline">
                        {v.status === "Out of Service" ? "Restore" : "Retire"}
                      </button>
                      <button onClick={() => handleDelete(v.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <Modal title={editing ? "Edit Vehicle" : "Add New Vehicle"} onClose={() => setShowModal(false)}>
          <ErrorBox message={error} />
          <FormInput label="Vehicle Name *" placeholder="Van-05" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FormInput label="Model" placeholder="Toyota HiAce" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
          <FormInput label="License Plate *" placeholder="TN01AB1234" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} />
          <FormSelect label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option>Van</option><option>Truck</option><option>Bike</option><option>Car</option>
          </FormSelect>
          <FormInput label="Max Capacity (kg) *" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
          <FormInput label="Odometer (km)" type="number" value={form.odometer} onChange={(e) => setForm({ ...form, odometer: e.target.value })} />
          <FormInput label="Acquisition Cost (Rs)" type="number" value={form.acquisitionCost} onChange={(e) => setForm({ ...form, acquisitionCost: e.target.value })} />
          <div className="flex gap-3 justify-end mt-2">
            <GhostBtn onClick={() => setShowModal(false)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={handleSave}>Save Vehicle</PrimaryBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}