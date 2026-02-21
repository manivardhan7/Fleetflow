import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Card, StatusPill, Modal, FormInput, FormSelect,
  PrimaryBtn, GhostBtn, ErrorBox, PageHeader,
} from "../components/UI";

const EMPTY_FORM = {
  name: "", license: "", licenseExpiry: "",
  category: "Van", phone: "", status: "On Duty",
};

const STATUS_CYCLE = ["On Duty", "Off Duty", "Suspended"];

export default function DriverProfiles() {
  const { drivers, setDrivers } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const today = new Date();

  function isExpired(expiry) {
    return new Date(expiry) < today;
  }

  function daysLeft(expiry) {
    return Math.ceil((new Date(expiry) - today) / (1000 * 60 * 60 * 24));
  }

  function handleAdd() {
    setError("");
    if (!form.name || !form.license || !form.licenseExpiry) {
      setError("Name, license number and expiry date are required.");
      return;
    }
    setDrivers([
      ...drivers,
      { ...form, id: "D" + Date.now(), trips: 0, completed: 0, safetyScore: 100 },
    ]);
    setShowModal(false);
    setForm(EMPTY_FORM);
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      setDrivers(drivers.filter((d) => d.id !== id));
    }
  }

  function cycleStatus(id) {
    setDrivers(drivers.map((d) => {
      if (d.id !== id) return d;
      const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(d.status) + 1) % STATUS_CYCLE.length];
      return { ...d, status: next };
    }));
  }

  return (
    <div>
      <PageHeader
        title="Driver Profiles"
        subtitle="Compliance, safety and performance tracking"
        action={
          <PrimaryBtn onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setError(""); }}>
            + Add Driver
          </PrimaryBtn>
        }
      />

      <div className="grid gap-4">
        {drivers.map((d) => {
          const expired = isExpired(d.licenseExpiry);
          const days = daysLeft(d.licenseExpiry);
          const completion = d.trips > 0 ? Math.round((d.completed / d.trips) * 100) : 0;

          return (
            <Card key={d.id} className={expired ? "border-red-700" : ""}>
              <div className="flex items-start justify-between flex-wrap gap-4">

                {/* Driver Info */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-700 flex items-center justify-center text-2xl font-black text-cyan-400">
                    {d.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-black text-lg">{d.name}</div>
                    <div className="text-gray-400 text-sm">{d.phone} · {d.category} License</div>
                    <div className={`text-xs mt-1 font-medium ${expired ? "text-red-400" : days < 30 ? "text-yellow-400" : "text-gray-500"}`}>
                      {expired
                        ? `⚠️ License EXPIRED on ${d.licenseExpiry}`
                        : `License expires: ${d.licenseExpiry} (${days} days left)`}
                    </div>
                  </div>
                </div>

                {/* Stats and Controls */}
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="text-center">
                    <div className="text-cyan-400 font-black text-xl">{d.safetyScore}</div>
                    <div className="text-gray-500 text-xs">Safety Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-black text-xl">{completion}%</div>
                    <div className="text-gray-500 text-xs">Completion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-black text-xl">{d.trips}</div>
                    <div className="text-gray-500 text-xs">Total Trips</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusPill status={d.status} />
                    <button onClick={() => cycleStatus(d.id)} className="text-xs text-cyan-400 hover:underline">
                      Change Status
                    </button>
                    <button onClick={() => handleDelete(d.id)} className="text-xs text-red-400 hover:underline">
                      Delete Driver
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {showModal && (
        <Modal title="Add New Driver" onClose={() => setShowModal(false)}>
          <ErrorBox message={error} />
          <FormInput label="Full Name *" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FormInput label="License Number *" placeholder="TN1234567" value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} />
          <FormInput label="License Expiry Date *" type="date" value={form.licenseExpiry} onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })} />
          <FormSelect label="License Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option>Van</option>
            <option>Truck</option>
            <option>Bike</option>
          </FormSelect>
          <FormInput label="Phone Number" placeholder="9876543210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="flex gap-3 justify-end">
            <GhostBtn onClick={() => setShowModal(false)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={handleAdd}>Add Driver</PrimaryBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}