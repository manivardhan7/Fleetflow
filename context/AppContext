import { createContext, useContext, useState } from "react";
import {
  initialVehicles,
  initialDrivers,
  initialTrips,
  initialMaintenance,
  initialFuelLogs,
  initialUsers,
} from "../data/initialData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [trips, setTrips] = useState(initialTrips);
  const [maintenance, setMaintenance] = useState(initialMaintenance);
  const [fuelLogs, setFuelLogs] = useState(initialFuelLogs);
  const [users, setUsers] = useState(initialUsers);
  const [user, setUser] = useState(null);

  return (
    <AppContext.Provider
      value={{
        vehicles, setVehicles,
        drivers, setDrivers,
        trips, setTrips,
        maintenance, setMaintenance,
        fuelLogs, setFuelLogs,
        users, setUsers,
        user, setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
