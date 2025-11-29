# 🏥 Hospital-AI-Mumbai-Hack

AI-powered hospital operations system designed for the city of Mumbai.  
Uses **two Machine Learning APIs + Firebase** to dynamically manage emergency load, hospital resources, medical inventory, and patient routing.

---

## 🚨 Core Idea

Mumbai faces unpredictable spikes in patient load due to pollution, weather, traffic, festivals, and seasonal diseases.

This platform helps all stakeholders stay ahead:

| Role | Superpower |
|------|------------|
| Hospital Staff | See disease surges before they happen + manage queue + track ambulances |
| Users / Patients | Get instant AI recommendation of the best hospital right now |
| Medical / Pharmacy | See inventory shortages based on predicted disease surges |

---

## 🧠 Technology Highlights

| Component | Purpose |
|----------|----------|
| Patient Surge Prediction API | Predicts disease spikes and required hospital resources |
| Hospital Recommender API | Finds the best hospital for a patient based on symptom + severity + traffic + crowding |
| Firebase | Auth + database + real-time ambulance sync |
| Next.js 14 | Web app + API abstraction layer |
| React Query + Tailwind + shadcn/ui | Modern UI/UX |

---

## 🔥 Key Features

### 🏥 Hospital Dashboard
- City-level surge forecast: risk level, trending diseases, advisories
- Required resources vs. current hospital capacity
- Emergency queue with predicted waiting time
- Live ambulance tracking (prototype)

### 👤 User Dashboard
- City risk indicator based on pollution + weather + disease forecasts
- Trending diseases and preventive advisories
- AI Emergency Helper:
  - Enter symptom + severity + location
  - Get best hospital instantly with predicted waiting time & distance



---

## 🔗 Machine Learning APIs Used

### 1️⃣ Patient Surge Prediction API
Predicts:
- Surging diseases
- Expected patient volume
- Required hospital resources
- Public health advisories

Endpoint example:
POST /api/predict

markdown
Copy code

### 2️⃣ Smart Hospital Recommendation API
Reroutes emergencies based on:
- Symptom
- Severity
- Distance
- Predicted waiting time
- Traffic level
- ICU/ventilator availability

Endpoint example:
POST /api/recommend

yaml
Copy code

---

## 🔥 Live Ambulance Tracking (Firebase Prototype)
When mobile user presses **Start Route**:
ambulances/{id} → source + destination + status = "en_route"

yaml
Copy code
Hospital dashboard receives it instantly and displays:
Ambulance A1 → Coming from X to Lilavati Hospital

yaml
Copy code

No full GPS map needed — just proving live coordination.

---

## 📁 Project Modules

/hospital → Surge forecast, emergency queue, ambulance tracking
/user → Emergency helper + city health summary
/medical → Surge-aware inventory + shortages
/api/internal → Bridges ML APIs ↔ Firestore
/lib/api → Typed ML API clients

yaml
Copy code

---

## 🏗 System Architecture (Conceptual)

scss
Copy code
 Weather + AQI + Festival + Day
                │
  ┌─────────────▼─────────────┐
  │ Patient Surge Prediction  │ (ML API #1)
  └─────────────┬─────────────┘
                │ city forecast
                ▼
       Firestore (stored once)
                │
                ├──────────► Hospital Dashboard
                ├──────────► User Health Awareness
                └──────────► Surge-Aware Inventory
User Symptom + Location + Severity
│
┌─────────────▼─────────────┐
│ Hospital Recommender API │ (ML API #2)
└─────────────┬─────────────┘
│ best hospitals
▼
emergency_cases + ambulances (Firestore)
│
└──────────► Hospital Emergency Queue
► Ambulance Tracking

yaml
Copy code

---

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind, shadcn/ui
- **State:** React Query
- **Auth / DB / Realtime:** Firebase (Auth + Firestore)
- **ML APIs:** Python + Flask
- **Deployment:** Render / Docker for APIs

---

## 🛠 Installation

```bash
npm install
cp .env.example .env.local
# fill Firebase + API URLs
npm run dev

