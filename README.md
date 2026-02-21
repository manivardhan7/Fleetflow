# FleetFlow
To replace inefficient, manual logbooks with a centralized, rule-based digital hub that optimizes the lifecycle of a delivery fleet, monitors driver safety, and tracks financial performance.

# FleetFlow — Fleet & Logistics Management System

A web-based fleet management platform built during a hackathon. Designed to replace manual logbooks with a centralized digital system that handles everything from vehicle tracking to driver compliance and financial reporting.

---

## What This Does

Managing a delivery fleet without proper tools is messy. Dispatchers lose track of which vehicles are available, managers have no visibility into fuel costs, and expired driver licenses go unnoticed until something goes wrong. FleetFlow brings all of this into one place.

---

## Pages and Features

**Login and Signup**
Role-based access for Managers, Dispatchers, Safety Officers and Financial Analysts. New users can register directly from the login screen.

**Command Center (Dashboard)**
The first thing you see after logging in. Shows active vehicles, how many are in the shop, overall fleet utilization rate and pending shipments. Filter the fleet table by vehicle type on the fly.

**Vehicle Registry**
Add, edit and delete vehicles. Each vehicle has a name, model, license plate, max load capacity and odometer reading. Managers can mark a vehicle as retired which removes it from active use without deleting the record.

**Trip Dispatcher**
Create delivery trips by selecting an available vehicle and a driver with a valid license. The system blocks trip creation if the cargo weight exceeds the vehicle's maximum capacity. Once dispatched, trips can be marked complete or cancelled. Completing a trip automatically frees up the vehicle.

**Maintenance Logs**
Log service work against any vehicle. As soon as a service entry is created, the vehicle status changes to In Shop and disappears from the dispatcher's vehicle selection. When the service is marked done, the vehicle becomes available again.

**Fuel and Expense Tracking**
Record fuel fills with liters, cost and kilometers driven. The system calculates fuel efficiency per vehicle automatically. Summary cards show total fuel spend per vehicle at a glance.

**Driver Profiles**
Full driver records with license expiry tracking. Drivers with expired licenses cannot be assigned to trips. Each profile shows safety score, trip completion rate and total trips. Status can be toggled between On Duty, Off Duty and Suspended.

**Analytics and Reports**
Financial overview showing total revenue, fuel costs, maintenance spend and net profit. Per-vehicle ROI is calculated using revenue minus operational costs divided by acquisition cost. One click exports everything to a CSV file.

---

## Tech Stack

- React
- Tailwind CSS
- React Context API for state management
- No backend — all data lives in memory during the session

---

## Getting Started

Clone the repo and install dependencies:

```
npm install
```

Start the development server:

```
npm start
```

Open your browser at http://localhost:3000

Demo login: admin@fleetflow.com / admin123

---

## Project Structure

```
src/
├── App.js
├── context/
│   └── AppContext.js
├── data/
│   └── initialData.js
├── components/
│   ├── Sidebar.js
│   └── UI.js
└── pages/
    ├── AuthPage.js
    ├── Dashboard.js
    ├── VehicleRegistry.js
    ├── TripDispatcher.js
    ├── MaintenanceLogs.js
    ├── FuelExpenses.js
    ├── DriverProfiles.js
    └── Analytics.js

## Key Business Rules

- A trip cannot be created if cargo weight is greater than the vehicle's max capacity
- A driver with an expired license cannot be assigned to any trip
- Adding a maintenance log automatically sets the vehicle to In Shop
- Completing or cancelling a trip sets the vehicle back to Available
- Driver completion stats update every time a trip is finished

---

## Built By
MANIVARDHAN and Team.
