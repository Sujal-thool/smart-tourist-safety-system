from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.ensemble import IsolationForest
# pyrefly: ignore [missing-import]
import numpy as np
import random

app = FastAPI(title="Tourist Anomaly Detection API")

class LocationData(BaseModel):
    latitude: float
    longitude: float
    time_diff: float
    speed: float

# Initialize and train Isolation Forest with dummy "normal" data
model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)

# Generate synthetic normal data: speeds around 1-5 m/s (walking), time_diffs ~10s
# Lat/Lng centered around some arbitrary city (28.6, 77.2) for training shape
X_train = []
for _ in range(1000):
    lat = 28.6139 + random.uniform(-0.1, 0.1)
    lng = 77.2090 + random.uniform(-0.1, 0.1)
    t_diff = random.uniform(5, 30)
    spd = random.uniform(0.5, 5.0)
    X_train.append([lat, lng, t_diff, spd])

model.fit(X_train)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "ML Service is running"}

@app.post("/predict")
def predict_anomaly(data: LocationData):
    # Prepare input for prediction
    X_test = np.array([[data.latitude, data.longitude, data.time_diff, data.speed]])
    
    # Predict (-1 is anomaly, 1 is normal)
    prediction = model.predict(X_test)[0]
    
    # Calculate anomaly score (lower means more anomalous)
    # sklearn score_samples returns negative anomaly scores. We can normalize or just return it.
    score = model.score_samples(X_test)[0]
    
    # Convert prediction to boolean
    is_anomaly = bool(prediction == -1)
    
    return {
        "anomaly": is_anomaly,
        "score": float(score)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
