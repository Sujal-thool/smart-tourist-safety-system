# Smart Tourist Safety Monitoring System

This project consists of three main components: a React frontend, a Node.js/Express backend, and a Python (FastAPI) Machine Learning service for anomaly detection.

## Prerequisites
- **Node.js**: Installed on your system to run the frontend and backend.
- **Python**: Installed on your system (use the `py` command on Windows) for the ML service.

## How to Run the Project

You will need to open **three separate terminal windows** (or tabs) and run the following commands in each.

### 1. Start the Node.js Backend
The backend handles the core API, database connections, and Socket.io real-time communications.
```bash
cd backend
npm run dev
```
*The backend will run on `http://localhost:5000`*

### 2. Start the React Frontend
The frontend contains the interactive dashboards for Tourists and Admins.
```bash
cd frontend
npm run dev
```
*The frontend will run on `http://localhost:5173`*

### 3. Start the Python ML Service
The ML service uses an Isolation Forest model to detect abnormal movement.
```bash
cd ml-service
py main.py
```
*(If it's your first time running this, you may need to install the requirements first using `py -m pip install -r requirements.txt`)*
*The ML service will run on `http://localhost:8000`*

## Accessing the Application
Once all three services are running, open your web browser and navigate to:
**http://localhost:5173**
