import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";

import Sidebar      from "./components/Sidebar";
import AuthPage     from "./pages/AuthPage";
import Dashboard    from "./pages/Dashboard";
import VehicleRegistry from "./pages/VehicleRegistry";
import TripDispatcher  from "./pages/TripDispatcher";
import MaintenanceLogs from "./pages/MaintenanceLogs";
import FuelExpenses    from "./pages/FuelExpenses";
import DriverProfiles  from "./pages/DriverProfiles";
import Analytics       from "./pages/Analytics";

// ─── Page map ───────────────────────────────────────────────
const PAGES = {
  dashboard:   <Dashboard />,
  vehicles:    <VehicleRegistry />,
  trips:       <TripDispatcher />,
  maintenance: <MaintenanceLogs />,
  fuel:        <FuelExpenses />,
  drivers:     <DriverProfiles />,
  analytics:   <Analytics />,
};

// ─── Inner App (has access to context) ──────────────────────
function InnerApp() {
  const { user, setUser, users, setUsers } = useApp();
  const [activePage, setActivePage] = useState("dashboard");

  if (!user) {
    return (
      <AuthPage
        onLogin={setUser}
        users={users}
        setUsers={setUsers}
      />
    );
  }

  return (
    <div className="flex bg-gray-950 min-h-screen text-white">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={() => {
          setUser(null);
          setActivePage("dashboard");
        }}
      />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {PAGES[activePage]}
      </main>
    </div>
  );
}

// ─── Root App wrapped with Provider ─────────────────────────
export default function App() {
  return (
    <AppProvider>
      <InnerApp />
    </AppProvider>
  );
}