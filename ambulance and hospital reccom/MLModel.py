# train_model.py

import pandas as pd
import numpy as np
import pickle
import joblib
from datetime import datetime

from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import warnings
warnings.filterwarnings('ignore')

# ============================================
# ENHANCED CONFIGURATIONS
# ============================================

DATA_PATH = "mumbai_hospital_ambulance_dataset_2000.csv"
MODEL_PATH = "waiting_time_model.pkl"
METADATA_PATH = "model_metadata.pkl"

# Enhanced Symptom Mappings
SYMPTOM_TO_SEVERITY = {
    "fever": "mild",
    "headache": "mild",
    "dizziness": "mild",
    "cold": "mild",
    "cough": "mild",
    "vomiting": "moderate",
    "burn injury": "moderate",
    "fracture": "moderate",
    "high blood pressure": "moderate",
    "abdominal pain": "moderate",
    "breathing difficulty": "severe",
    "chest pain": "severe",
    "bleeding": "severe",
    "unconscious": "severe",
    "stroke": "severe",
    "heart attack": "severe",
    "seizure": "severe",
}

SYMPTOM_TO_SPECIALITY = {
    "fever": "General Medicine",
    "headache": "Neurology",
    "dizziness": "Neurology",
    "vomiting": "General Medicine",
    "burn injury": "Burns",
    "fracture": "Orthopedics",
    "high blood pressure": "Cardiology",
    "breathing difficulty": "Pulmonology",
    "chest pain": "Cardiology",
    "bleeding": "Trauma",
    "unconscious": "Neurology",
    "cold": "General Medicine",
    "cough": "Pulmonology",
    "abdominal pain": "General Medicine",
    "stroke": "Neurology",
    "heart attack": "Cardiology",
    "seizure": "Neurology",
}

SEVERITY_TO_AMBULANCE = {
    "mild": "None / Optional BLS",
    "moderate": "BLS",
    "severe": "ALS / ICU",
}


# ============================================
# LOAD AND PREPARE DATA
# ============================================

def load_and_prepare_data(path: str = DATA_PATH):
    """Load dataset and perform initial preprocessing"""
    print("[INFO] Loading dataset...")
    df = pd.read_csv(path)
    
    print(f"[INFO] Dataset loaded: {len(df)} rows, {len(df.columns)} columns")
    print(f"[INFO] Columns: {list(df.columns)}")
    
    # Basic data validation
    if df.isnull().sum().sum() > 0:
        print("[WARN] Found missing values. Filling with appropriate defaults...")
        df = df.fillna({
            'general_beds': df['general_beds'].median(),
            'icu_beds': df['icu_beds'].median(),
            'ventilators': df['ventilators'].median(),
            'waiting_time_min': df['waiting_time_min'].median()
        })
    
    return df


# ============================================
# FEATURE ENGINEERING
# ============================================

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add engineered features to improve model performance"""
    df = df.copy()
    
    # 1. Total capacity score
    df['total_capacity'] = (
        df['general_beds'] + 
        df['icu_beds'] * 2 +  # ICU beds weighted more
        df['ventilators'] * 3  # Ventilators weighted most
    )
    
    # 2. Bed availability ratios
    df['icu_ratio'] = df['icu_beds'] / (df['general_beds'] + 1)  # avoid division by zero
    df['ventilator_ratio'] = df['ventilators'] / (df['general_beds'] + 1)
    
    # 3. Traffic impact (convert categorical to numeric for feature)
    traffic_map = {'Low': 1, 'Moderate': 2, 'High': 3}
    df['traffic_numeric'] = df['traffic_level'].map(traffic_map)
    
    # 4. Severity score (convert to numeric)
    severity_map = {'mild': 1, 'moderate': 2, 'severe': 3}
    df['severity_numeric'] = df['severity'].map(severity_map)
    
    # 5. Location-based features (distance from central Mumbai)
    central_lat, central_lng = 19.0760, 72.8777  # Mumbai coordinates
    df['distance_from_center'] = np.sqrt(
        (df['hospital_lat'] - central_lat)**2 + 
        (df['hospital_lng'] - central_lng)**2
    )
    
    print(f"[INFO] Engineered {5} new features")
    return df


# ============================================
# TRAIN ENHANCED MODEL
# ============================================

def train_enhanced_model(df: pd.DataFrame):
    """Train an enhanced regression model with better features"""
    
    print("\n[INFO] Starting model training...")
    
    # Apply feature engineering
    df = engineer_features(df)
    
    # Define target
    target = "waiting_time_min"
    
    # Define feature sets
    categorical_cols = [
        "hospital_name",
        "speciality",
        "ambulance_type_needed",
        "symptom",
        "severity",
        "traffic_level",
    ]
    
    numeric_cols = [
        "hospital_lat", 
        "hospital_lng", 
        "general_beds", 
        "icu_beds", 
        "ventilators",
        "total_capacity",
        "icu_ratio",
        "ventilator_ratio",
        "traffic_numeric",
        "severity_numeric",
        "distance_from_center"
    ]
    
    feature_cols = categorical_cols + numeric_cols
    
    X = df[feature_cols]
    y = df[target]
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, shuffle=True
    )
    
    print(f"[INFO] Train set: {len(X_train)} samples")
    print(f"[INFO] Test set: {len(X_test)} samples")
    
    # Create preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_cols),
            ("num", StandardScaler(), numeric_cols),
        ]
    )
    
    # Try multiple models and select best
    models = {
        'RandomForest': RandomForestRegressor(
            n_estimators=200,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        ),
        'GradientBoosting': GradientBoostingRegressor(
            n_estimators=150,
            learning_rate=0.1,
            max_depth=7,
            random_state=42
        )
    }
    
    best_model = None
    best_score = float('inf')
    best_model_name = None
    
    for name, model in models.items():
        print(f"\n[INFO] Training {name}...")
        
        pipeline = Pipeline(steps=[
            ("preprocess", preprocessor),
            ("model", model)
        ])
        
        # Train
        pipeline.fit(X_train, y_train)
        
        # Evaluate
        y_pred_train = pipeline.predict(X_train)
        y_pred_test = pipeline.predict(X_test)
        
        mae_train = mean_absolute_error(y_train, y_pred_train)
        mae_test = mean_absolute_error(y_test, y_pred_test)
        rmse_test = np.sqrt(mean_squared_error(y_test, y_pred_test))
        r2_test = r2_score(y_test, y_pred_test)
        
        print(f"  Train MAE: {mae_train:.2f} min")
        print(f"  Test MAE: {mae_test:.2f} min")
        print(f"  Test RMSE: {rmse_test:.2f} min")
        print(f"  Test R²: {r2_test:.4f}")
        
        if mae_test < best_score:
            best_score = mae_test
            best_model = pipeline
            best_model_name = name
    
    print(f"\n[INFO] Best model: {best_model_name} (MAE: {best_score:.2f} min)")
    
    # Save model and metadata
    print(f"[INFO] Saving model to {MODEL_PATH}...")
    joblib.dump(best_model, MODEL_PATH)
    
    metadata = {
        'model_name': best_model_name,
        'mae': best_score,
        'trained_date': datetime.now().isoformat(),
        'feature_cols': feature_cols,
        'categorical_cols': categorical_cols,
        'numeric_cols': numeric_cols,
        'symptom_to_severity': SYMPTOM_TO_SEVERITY,
        'symptom_to_speciality': SYMPTOM_TO_SPECIALITY,
        'severity_to_ambulance': SEVERITY_TO_AMBULANCE,
        'train_samples': len(X_train),
        'test_samples': len(X_test)
    }
    
    with open(METADATA_PATH, 'wb') as f:
        pickle.dump(metadata, f)
    
    print(f"[INFO] Metadata saved to {METADATA_PATH}")
    print("\n[SUCCESS] Model training complete!")
    
    return best_model, metadata


# ============================================
# MAIN EXECUTION
# ============================================

if __name__ == "__main__":
    print("=" * 60)
    print("ENHANCED HOSPITAL RECOMMENDATION MODEL TRAINING")
    print("=" * 60)
    
    # Load data
    df = load_and_prepare_data(DATA_PATH)
    
    # Train model
    model, metadata = train_enhanced_model(df)
    
    print("\n" + "=" * 60)
    print("TRAINING SUMMARY")
    print("=" * 60)
    print(f"Model: {metadata['model_name']}")
    print(f"MAE: {metadata['mae']:.2f} minutes")
    print(f"Trained: {metadata['trained_date']}")
    print(f"Train samples: {metadata['train_samples']}")
    print(f"Test samples: {metadata['test_samples']}")
    print("=" * 60)