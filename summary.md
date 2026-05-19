# Smart Tourist Safety Monitoring System - Comprehensive Project Summary

## What It Does
The **Smart Tourist Safety Monitoring System** is an advanced full-stack application designed to ensure the safety of tourists. It provides real-time monitoring, AI-driven anomaly detection, digital identity verification, and an interconnected alert system to guarantee rapid emergency responses.

The project is structured into three primary architectural components:

---

### 1. Frontend (React/Vite)
The user interface is built using **React** and **Vite** for rapid performance, styled with **Tailwind CSS** using a premium "Glassmorphism" aesthetic. It utilizes context-based state management (`AuthContext`) and handles web-based navigation via `react-router-dom`.

#### Key Frontend Features & How They Work:
- **Role-Based Dashboards**: Interactive portals specific to **Tourists** and **Police/Admins**, ensuring users only see data and actions relevant to their permissions.
- **Dynamic Navbar Notifications**: A bell icon dynamically tracks unread alerts. Using `useEffect` and `api` intercepts, it fetches recent alerts based on the user's role (Tourist personal history vs. Admin global history) and displays them in an interactive dropdown.
- **Digital ID Onboarding & QR Verification**: During registration, users generate a "Digital Passport". 
  - **How it works:** The system validates document formats in real-time (e.g., ensuring Aadhaar is exactly 12 digits). It captures a `personalPhone` and `emergencyPhone`. A dynamic `qrcode.react` component generates a scannable QR code summarizing their identity and blockchain hash.
- **Real-time Map & Routing**: Integrated mapping (`leaflet` or similar map view). 
  - **How it works:** It plots active tourist coordinates and statuses. Tourists can calculate safe routes to their hotels, while Admins view a live tracking grid and historical heatmaps.
- **Tourist Alert History**: The dashboard fetches and persists the tourist's historical alerts (Panic, Weather, AI anomaly) from the MongoDB database so past incidents aren't lost on refresh.
- **Admin Live Feed & CSV Reports**: The Police dashboard fetches active tourists on initialization. Admins can track statuses changing from 'Safe' to 'Danger' in real-time. 
  - **How it works:** A "Download Report" button dynamically converts the current JSON alert state into a CSV string, creates a Blob URL, and prompts a file download to the Admin's device.
- **SafeTrax AI Assistant & Weather Widget**: A live weather module dynamically issues local safety advisories (Temperature, AQI, UV Index), and a smart chatbot acts as a digital concierge for navigation and safety inquiries.

---

### 2. Backend (Node.js/Express)
The core server handles the business logic, API endpoints, user authentication (JWT + bcrypt), and database operations.

#### Key Backend Features & How They Work:
- **Database Architecture**: Connects to **MongoDB** using `mongoose`. Stores schemas for `User`, `TouristID`, `Location`, and `Alert`.
- **WebSockets (Socket.io)**: Facilitates instant, bi-directional communication.
  - **How it works:** When a tourist's GPS ping hits the `/location` endpoint, the server processes it and instantly emits a `location_update` event (containing the tourist's name and coordinates). If an emergency happens, it emits a `new_alert` event causing the Admin dashboard to instantly flash red.
- **Blockchain Digital Identity (Web3)**: 
  - **How it works:** A Solidity Smart Contract (`TouristIdentity.sol`) is deployed on a local Ethereum network (Ganache). The Node.js server acts as an oracle, taking the user's KYC details, generating a cryptographic hash, and anchoring it to the blockchain to guarantee identity immutability.
- **Automated Emergency SMS Dispatch**: 
  - **How it works:** Uses `twilio` (or a mock console logger in development). When a Panic SOS is pressed, or an AI Anomaly is detected, the `touristController` fetches the tourist's Digital ID profile, extracts their `emergencyPhone`, and dispatches an SMS containing a Google Maps link to *both* Police dispatch and the family emergency contact.
- **Geofencing & Weather Alerts**: The backend continuously cross-references incoming GPS coordinates. If a tourist leaves a predefined 50km safe-zone radius, or enters an extreme weather area, the system automatically creates an `Alert` document and broadcasts it via WebSocket.

---

### 3. Machine Learning Service (Python/FastAPI)
A standalone Python microservice responsible purely for predictive safety modeling.

#### Key ML Features & How They Work:
- **AI Anomaly Detection Model**: Utilizes the **Isolation Forest** algorithm from `scikit-learn` to detect irregular movement patterns indicative of danger (kidnapping, fleeing, etc.).
- **How It Works**:
  1. The model is pre-trained on "normal" human movement physics (standard walking speeds, typical GPS ping intervals).
  2. With every new GPS update, the Node.js backend calculates the tourist's approximate speed and time differential since their last ping.
  3. This data (`latitude`, `longitude`, `time_diff`, `speed`) is sent to the FastAPI `/predict` endpoint.
  4. The Isolation Forest evaluates the data. If the physics are highly irregular (e.g., sudden high-speed deviation indicating being pushed into a vehicle), it returns an anomaly score (`prediction == -1`).
  5. The Node.js backend receives this, instantly triggers an **AI Anomaly Alert**, updates the Admin map, and fires off the emergency SMS sequence.

---

## Current Status: Fully Operational
**Yes, the project is working.** All components, including the new dynamic Admin load, SMS emergency contacts, and ID validation features, are successfully integrated.

### How to Run Locally
Open three separate terminal windows and start each service:

1. **Backend**:
   ```bash
   cd backend
   npm run dev
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
3. **ML Service**:
   ```bash
   cd ml-service
   py main.py
   ```
   
Once all services are running, access the application frontend at **http://localhost:5173**.
