
# flaks code for hospital reccomend nd nearby ambulance booking
# api url - https://hospital-recomm.onrender.com

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import pickle
import math
from typing import List, Dict, Any
import os

app = Flask(__name__)
CORS(app)

# ============================================
# LOAD MODEL AND METADATA
# ============================================

MODEL_PATH = "waiting_time_model.pkl"
METADATA_PATH = "model_metadata.pkl"
DATA_PATH = "mumbai_hospital_ambulance_dataset_2000.csv"

# Global variables
model = None
metadata = None
hospitals_df = None

def load_model_and_data():
    """Load trained model, metadata, and hospital data"""
    global model, metadata, hospitals_df
    
    try:
        print("[INFO] Loading model...")
        model = joblib.load(MODEL_PATH)
        
        print("[INFO] Loading metadata...")
        with open(METADATA_PATH, 'rb') as f:
            metadata = pickle.load(f)
        
        print("[INFO] Loading hospital dataset...")
        hospitals_df = pd.read_csv(DATA_PATH)
        
        print("[SUCCESS] All resources loaded successfully!")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to load resources: {str(e)}")
        return False


# ============================================
# HELPER FUNCTIONS
# ============================================

def haversine_distance_km(lat1, lon1, lat2, lon2) -> float:
    """Calculate haversine distance between two coordinates"""
    R = 6371.0  # Earth radius in km
    
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)
    
    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c


def engineer_features_for_prediction(df: pd.DataFrame) -> pd.DataFrame:
    """Apply same feature engineering as training"""
    df = df.copy()
    
    # Total capacity
    df['total_capacity'] = (
        df['general_beds'] + 
        df['icu_beds'] * 2 + 
        df['ventilators'] * 3
    )
    
    # Ratios
    df['icu_ratio'] = df['icu_beds'] / (df['general_beds'] + 1)
    df['ventilator_ratio'] = df['ventilators'] / (df['general_beds'] + 1)
    
    # Traffic numeric
    traffic_map = {'Low': 1, 'Moderate': 2, 'High': 3}
    df['traffic_numeric'] = df['traffic_level'].map(traffic_map)
    
    # Severity numeric
    severity_map = {'mild': 1, 'moderate': 2, 'severe': 3}
    df['severity_numeric'] = df['severity'].map(severity_map)
    
    # Distance from center
    central_lat, central_lng = 19.0760, 72.8777
    df['distance_from_center'] = np.sqrt(
        (df['hospital_lat'] - central_lat)**2 + 
        (df['hospital_lng'] - central_lng)**2
    )
    
    return df


def normalize_series(s: pd.Series) -> pd.Series:
    """Normalize a series to 0-1 range"""
    if s.max() == s.min():
        return pd.Series([0.5] * len(s), index=s.index)
    return (s - s.min()) / (s.max() - s.min())


def infer_severity(symptom: str) -> str:
    """Infer severity from symptom"""
    return metadata['symptom_to_severity'].get(symptom.lower(), "moderate")


def infer_speciality(symptom: str) -> str:
    """Infer required speciality from symptom"""
    return metadata['symptom_to_speciality'].get(symptom.lower(), "General Medicine")


def get_ambulance_type(severity: str) -> str:
    """Get recommended ambulance type based on severity"""
    return metadata['severity_to_ambulance'].get(severity.lower(), "BLS")


# ============================================
# RECOMMENDATION ENGINE
# ============================================

def recommend_hospitals(
    user_lat: float,
    user_lng: float,
    symptom: str,
    severity: str = None,
    emergency_level: str = None,
    top_k: int = 5,
) -> List[Dict[str, Any]]:
    """
    Main recommendation logic
    """
    
    # Infer severity if not provided
    if severity is None:
        severity = infer_severity(symptom)
    
    # Derive emergency level from severity
    if emergency_level is None:
        if severity.lower() == "severe":
            emergency_level = "critical"
        elif severity.lower() == "moderate":
            emergency_level = "moderate"
        else:
            emergency_level = "mild"
    
    # Infer required speciality
    required_speciality = infer_speciality(symptom)
    
    # Filter hospitals by speciality
    candidates = hospitals_df[hospitals_df["speciality"] == required_speciality].copy()
    
    if candidates.empty:
        # Fallback to all hospitals
        candidates = hospitals_df.copy()
    
    # Prepare features for prediction
    candidates["symptom"] = symptom
    candidates["severity"] = severity
    
    # Apply feature engineering
    candidates = engineer_features_for_prediction(candidates)
    
    # Predict waiting time
    feature_cols = metadata['feature_cols']
    predicted_wait = model.predict(candidates[feature_cols])
    candidates["predicted_waiting_time"] = predicted_wait
    
    # Calculate distances
    distances = []
    for _, row in candidates.iterrows():
        d = haversine_distance_km(
            user_lat, user_lng,
            row["hospital_lat"], row["hospital_lng"]
        )
        distances.append(d)
    candidates["distance_km"] = distances
    
    # Normalize distance and waiting time
    candidates["dist_norm"] = normalize_series(candidates["distance_km"])
    candidates["wait_norm"] = normalize_series(candidates["predicted_waiting_time"])
    
    # Severity-aware scoring
    if emergency_level == "critical":
        alpha_dist = 0.7
        alpha_wait = 0.3
    elif emergency_level == "moderate":
        alpha_dist = 0.5
        alpha_wait = 0.5
    else:  # mild
        alpha_dist = 0.3
        alpha_wait = 0.7
    
    candidates["score"] = (
        alpha_dist * candidates["dist_norm"] +
        alpha_wait * candidates["wait_norm"]
    )
    
    # Sort by score
    candidates = candidates.sort_values(by="score", ascending=True)
    
    # Prepare results
    results = []
    for _, row in candidates.head(top_k).iterrows():
        ambulance_reco = get_ambulance_type(severity)
        
        result = {
            "hospital_name": row["hospital_name"],
            "speciality": row["speciality"],
            "hospital_lat": float(row["hospital_lat"]),
            "hospital_lng": float(row["hospital_lng"]),
            "distance_km": round(float(row["distance_km"]), 2),
            "predicted_waiting_time_min": round(float(row["predicted_waiting_time"]), 1),
            "available_general_beds": int(row["general_beds"]),
            "available_icu_beds": int(row["icu_beds"]),
            "available_ventilators": int(row["ventilators"]),
            "traffic_level": row["traffic_level"],
            "ml_score": round(float(row["score"]), 4),
            "recommended_ambulance_type": ambulance_reco,
            "dataset_ambulance_hint": row["ambulance_type_needed"],
        }
        results.append(result)
    
    return results, severity, emergency_level, required_speciality


# ============================================
# API ENDPOINTS
# ============================================

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "success",
        "message": "Smart Emergency Hospital Recommender API",
        "version": "1.0.0",
        "model_info": {
            "model_name": metadata['model_name'] if metadata else None,
            "trained_date": metadata['trained_date'] if metadata else None,
            "mae": metadata['mae'] if metadata else None
        }
    }), 200


@app.route('/health', methods=['GET'])
def health():
    """Detailed health check"""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "metadata_loaded": metadata is not None,
        "data_loaded": hospitals_df is not None,
        "total_hospitals": len(hospitals_df) if hospitals_df is not None else 0
    }), 200


@app.route('/api/recommend', methods=['POST'])
def recommend():
    """
    Main recommendation endpoint
    
    Request Body:
    {
        "user_lat": 19.119,
        "user_lng": 72.846,
        "symptom": "chest pain",
        "severity": "severe" (optional),
        "emergency_level": "critical" (optional),
        "top_k": 5 (optional, default: 5)
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({
                "status": "error",
                "message": "Request body is required"
            }), 400
        
        required_fields = ['user_lat', 'user_lng', 'symptom']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({
                "status": "error",
                "message": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400
        
        # Extract parameters
        user_lat = float(data['user_lat'])
        user_lng = float(data['user_lng'])
        symptom = data['symptom']
        severity = data.get('severity', None)
        emergency_level = data.get('emergency_level', None)
        top_k = int(data.get('top_k', 5))
        
        # Validate coordinates
        if not (-90 <= user_lat <= 90) or not (-180 <= user_lng <= 180):
            return jsonify({
                "status": "error",
                "message": "Invalid coordinates"
            }), 400
        
        # Get recommendations
        recommendations, final_severity, final_emergency, speciality = recommend_hospitals(
            user_lat=user_lat,
            user_lng=user_lng,
            symptom=symptom,
            severity=severity,
            emergency_level=emergency_level,
            top_k=top_k
        )
        
        return jsonify({
            "status": "success",
            "query": {
                "user_lat": user_lat,
                "user_lng": user_lng,
                "symptom": symptom,
                "inferred_severity": final_severity,
                "emergency_level": final_emergency,
                "required_speciality": speciality
            },
            "recommendations": recommendations,
            "total_results": len(recommendations)
        }), 200
        
    except ValueError as e:
        return jsonify({
            "status": "error",
            "message": f"Invalid input: {str(e)}"
        }), 400
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Internal server error: {str(e)}"
        }), 500


@app.route('/api/specialities', methods=['GET'])
def get_specialities():
    """Get list of available specialities"""
    try:
        specialities = hospitals_df['speciality'].unique().tolist()
        return jsonify({
            "status": "success",
            "specialities": sorted(specialities),
            "total": len(specialities)
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/api/symptoms', methods=['GET'])
def get_symptoms():
    """Get list of known symptoms with severity and speciality mapping"""
    try:
        symptoms_info = []
        for symptom, severity in metadata['symptom_to_severity'].items():
            speciality = metadata['symptom_to_speciality'].get(symptom, "General Medicine")
            ambulance = metadata['severity_to_ambulance'].get(severity, "BLS")
            
            symptoms_info.append({
                "symptom": symptom,
                "severity": severity,
                "speciality": speciality,
                "ambulance_type": ambulance
            })
        
        return jsonify({
            "status": "success",
            "symptoms": symptoms_info,
            "total": len(symptoms_info)
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/api/hospitals', methods=['GET'])
def get_hospitals():
    """Get list of all hospitals with optional filtering"""
    try:
        speciality = request.args.get('speciality', None)
        
        df = hospitals_df.copy()
        
        if speciality:
            df = df[df['speciality'] == speciality]
        
        hospitals = []
        for _, row in df.iterrows():
            hospitals.append({
                "hospital_name": row["hospital_name"],
                "speciality": row["speciality"],
                "hospital_lat": float(row["hospital_lat"]),
                "hospital_lng": float(row["hospital_lng"]),
                "general_beds": int(row["general_beds"]),
                "icu_beds": int(row["icu_beds"]),
                "ventilators": int(row["ventilators"]),
                "ambulance_type": row["ambulance_type_needed"]
            })
        
        return jsonify({
            "status": "success",
            "hospitals": hospitals,
            "total": len(hospitals),
            "filter": {"speciality": speciality} if speciality else None
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/api/predict-waiting-time', methods=['POST'])
def predict_waiting_time():
    """
    Predict waiting time for a specific hospital and condition
    
    Request Body:
    {
        "hospital_name": "Lilavati Hospital",
        "symptom": "chest pain",
        "severity": "severe",
        "traffic_level": "High"
    }
    """
    try:
        data = request.get_json()
        
        required_fields = ['hospital_name', 'symptom']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({
                "status": "error",
                "message": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400
        
        hospital_name = data['hospital_name']
        symptom = data['symptom']
        severity = data.get('severity', infer_severity(symptom))
        traffic_level = data.get('traffic_level', 'Moderate')
        
        # Find hospital
        hospital_row = hospitals_df[hospitals_df['hospital_name'] == hospital_name]
        
        if hospital_row.empty:
            return jsonify({
                "status": "error",
                "message": f"Hospital '{hospital_name}' not found"
            }), 404
        
        # Prepare for prediction
        hospital_row = hospital_row.copy()
        hospital_row['symptom'] = symptom
        hospital_row['severity'] = severity
        hospital_row['traffic_level'] = traffic_level
        
        # Apply feature engineering
        hospital_row = engineer_features_for_prediction(hospital_row)
        
        # Predict
        feature_cols = metadata['feature_cols']
        predicted_wait = model.predict(hospital_row[feature_cols])[0]
        
        return jsonify({
            "status": "success",
            "hospital_name": hospital_name,
            "symptom": symptom,
            "severity": severity,
            "traffic_level": traffic_level,
            "predicted_waiting_time_min": round(float(predicted_wait), 1)
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "status": "error",
        "message": "Endpoint not found"
    }), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "status": "error",
        "message": "Internal server error"
    }), 500


# ============================================
# MAIN
# ============================================

if __name__ == '__main__':
    print("=" * 60)
    print("SMART EMERGENCY HOSPITAL RECOMMENDER API")
    print("=" * 60)
    
    # Load model and data
    if not load_model_and_data():
        print("[ERROR] Failed to start server. Please train the model first.")
        exit(1)
    
    print("\n[INFO] Starting Flask server...")
    app.run(host='0.0.0.0', port=5000, debug=True)