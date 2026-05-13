# Smart Tourist Safety Monitoring System - Project Summary

## What It Does
The **Smart Tourist Safety Monitoring System** is an application designed to ensure the safety of tourists by providing real-time monitoring, digital identity verification, and AI-driven anomaly detection. 

It consists of three main components:

### 1. Frontend (React/Vite)
- **Dashboards**: Provides separate, interactive web-based dashboards for **Tourists** and **Police/Admins**.
- **Real-time Map & Heatmap**: Displays active tourist locations on a map. It also renders a historical heatmap of danger zones based on past "Panic", "Anomaly", and "LowBattery" alerts.
- **Panic Controls**: Allows tourists to instantly trigger SOS signals.

### 2. Backend (Node.js/Express)
- **Core API & Database**: Built with Express and connects to MongoDB to store user profiles, locations, and alert history.
- **WebSockets (Socket.io)**: Handles real-time bi-directional communication. When a tourist's location changes or an emergency is triggered, it instantly broadcasts `location_update` or `new_alert` events to the Police dashboard.
- **Blockchain Digital Identity (Web3)**: Uses a Solidity Smart Contract (`TouristIdentity.sol`) deployed on a local Ethereum network (Ganache). It allows tourists to mint a secure KYC digital identity by anchoring a hash of their document details to the blockchain, ensuring their identity is verifiable and tamper-proof.
- **Geofencing**: Monitors if a tourist breaches a safe zone (e.g., leaving a 50km radius) and triggers a `GeoFenceBreach` alert.
- **SMS Notifications**: Integrates an SMS service to automatically dispatch text messages to emergency contacts or authorities during critical events (Panic SOS, Severe Weather, Low Battery).

### 3. Machine Learning Service (Python/FastAPI)
- **Anomaly Detection Model**: Uses the **Isolation Forest** algorithm (from `scikit-learn`) to detect abnormal movement patterns.
- **How It Works**:
  - The model is trained on "normal" human movement data (e.g., walking speeds of 1-5 m/s, typical location intervals).
  - Whenever a tourist's GPS location updates, the Node.js backend calculates their approximate speed and time difference and sends it to the FastAPI endpoint (`/predict`).
  - The Isolation Forest evaluates the `latitude`, `longitude`, `time_diff`, and `speed`.
  - If the movement is highly irregular (e.g., sudden high-speed deviation or teleportation-like movement), the model flags it as an anomaly (`prediction == -1`) and returns an anomaly score.
  - The backend then instantly triggers an **AI Anomaly Alert**, notifying the police dashboard and sending an emergency SMS.

## Is It Working?
**Yes, the project is working.** 

All three core services have been successfully started and verified:

- ✅ **Backend**: Started successfully on `localhost:5000`. It was able to connect to the local MongoDB instance and initialize the Web3 local blockchain, successfully deploying the `TouristIdentity` smart contract.
- ✅ **Frontend**: Started successfully using Vite on `localhost:5173`. 
- ✅ **ML-Service**: Started successfully using Uvicorn/FastAPI on `localhost:8000`.

## How to Run Locally
To run the system, you need to open three separate terminal windows and start each service:

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
   
Once all services are running, you can access the application frontend at **http://localhost:5173**.
