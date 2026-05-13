# Smart Tourist Safety Monitoring System - Implementation and Working

## Overview
The **Smart Tourist Safety Monitoring System** is a comprehensive application engineered to safeguard tourists by offering real-time monitoring, blockchain-based digital identity verification, and AI-driven anomaly detection. 

## Project Implementation Details

The project is structured into three distinct and independent components:

### 1. Frontend (React / Vite)
- **Framework:** React.js bootstrapped with Vite.
- **Role:** Serves as the user interface, providing separate, interactive web-based dashboards for both **Tourists** and **Police/Admins**.
- **Key Features:**
  - **Real-time Map & Heatmap:** Integrates maps to display active tourist locations and historical heatmaps of danger zones based on previous alerts (e.g., Panic, Anomaly, Low Battery).
  - **Panic Controls:** Offers a quick-access SOS button for tourists to trigger an emergency immediately.
  - **Digital Identity:** Interface to generate a QR code linking to their verified blockchain identity.

### 2. Backend (Node.js / Express)
- **Framework:** Node.js with Express.js.
- **Database:** MongoDB for persistent storage of user profiles, location history, and alert logs.
- **Role:** The core processing unit that orchestrates data flow, database operations, and external service integrations.
- **Key Implementations:**
  - **WebSockets (Socket.io):** Maintains real-time bi-directional communication. When a tourist's location updates or an SOS is triggered, the backend instantly broadcasts `location_update` or `new_alert` events to the Police dashboard without requiring a page refresh.
  - **Blockchain Digital Identity (Web3):** Integrates a Solidity Smart Contract (`TouristIdentity.sol`) deployed on a local Ethereum network (Ganache). It allows tourists to mint a secure KYC digital identity by anchoring a hash of their document details to the blockchain, ensuring their identity is verifiable and tamper-proof.
  - **Geofencing:** Actively monitors if a tourist breaches a designated safe zone (e.g., moving outside a 50km radius) and triggers a `GeoFenceBreach` alert.
  - **SMS Notifications:** Utilizes an SMS API to automatically send text messages to emergency contacts or local authorities during critical events.

### 3. Machine Learning Service (Python / FastAPI)
- **Framework:** Python using FastAPI for serving the endpoint.
- **Model:** **Isolation Forest** (from `scikit-learn`).
- **Role:** Anomaly detection service to monitor abnormal movement patterns.
- **How It Works:**
  - The model is pre-trained on "normal" human movement data parameters (like walking speeds of 1-5 m/s and typical time intervals between location pings).
  - When the frontend sends a GPS update, the Node.js backend calculates the approximate speed and time elapsed since the last update and forwards this to the FastAPI `/predict` endpoint.
  - The Isolation Forest algorithm evaluates the `latitude`, `longitude`, `time_diff`, and `speed`.
  - If the movement is highly irregular (e.g., physically impossible speeds, sudden massive distance jumps), the model flags it as an anomaly (`prediction == -1`) and returns a score.
  - The backend catches this anomaly and instantly triggers an **AI Anomaly Alert**, updating the dashboard and dispatching an SMS.

---

## Current Working State

**The system is fully functional.** All three core services run concurrently and communicate seamlessly.

- ✅ **Backend:** Operational on `http://localhost:5000`. Successfully connects to MongoDB and initializes the Web3 local blockchain, allowing the `TouristIdentity` smart contract to deploy.
- ✅ **Frontend:** Operational on `http://localhost:5173`. Connects to the backend via WebSockets to send/receive real-time updates.
- ✅ **ML Service:** Operational on `http://localhost:8000`. Receives prediction requests from the Node.js backend and accurately responds with anomaly scores.

## How to Run the Project Locally

To run the application, open three separate terminal windows and launch each service in its respective directory:

### 1. Start the Backend
```bash
cd backend
npm run dev
```

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

### 3. Start the Machine Learning Service
```bash
cd ml-service
py main.py
```
*(Note: Use `py -m pip install -r requirements.txt` if running for the first time)*

Once all three terminal processes are actively running, open your web browser and navigate to **http://localhost:5173** to access the application.
