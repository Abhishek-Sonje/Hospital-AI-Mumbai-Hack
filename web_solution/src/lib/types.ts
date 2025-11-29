// ============================================
// AUTHENTICATION & USER TYPES
// ============================================

export type UserRole = "hospital" | "user" | "medical";

export interface AppUser {
  uid: string;
  email: string | null;
  role: UserRole;
  displayName?: string;
  createdAt: string;
}

// ============================================
// SURGE PREDICTION API TYPES
// ============================================

export interface SurgePredictionRequest {
  city: string;
  aqi: number;
  pm25: number;
  pm10: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  season: "winter" | "summer" | "monsoon" | "autumn";
  festival: boolean;
  day_type: "weekday" | "weekend" | "holiday";
  city_population: number;
  diseases?: string[];
  surge_multiplier?: number;
}

export interface DiseasePrediction {
  disease: string;
  predicted_cases: number;
  baseline_median: number;
  surge_threshold: number;
  is_surge: boolean;
  resources: {
    beds: number;
    oxygen_units: number;
    ventilators: number;
    staff: number;
  };
  disease_specific_resources?: Record<string, number>;
}

export interface SurgePredictionSummary {
  total_surges_detected: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  resources_required: {
    total_beds: number;
    total_oxygen_units: number;
    total_ventilators: number;
    total_staff: number;
  };
  advisories: string[];
}

export interface SurgePredictionResponse {
  predictions: DiseasePrediction[];
  summary: SurgePredictionSummary;
}

export interface BatchPredictionRequest {
  scenarios: SurgePredictionRequest[];
}

export interface SurgeAPIHealthResponse {
  status: string;
  model_loaded: boolean;
}

// ============================================
// FIRESTORE DOCUMENT TYPES
// ============================================

export interface HospitalInventoryItem {
  id: string;
  name: string;
  category: string;
  current_stock: number;
  reorder_level: number;
  unit: string;
  is_critical: boolean;
  last_updated: string;
  last_restocked?: string;
}

export interface MedicalInventoryItem {
  id: string;
  name: string;
  type: "inhaler" | "antibiotic" | "saline" | "oxygen_cylinder" | "trauma_kit" | "general";
  category: string;
  current_stock: number;
  min_required: number;
  unit: string;
  status: "OK" | "Low" | "Critical";
  last_updated: string;
  restock_requested?: boolean;
}

export interface Ward {
  id: string;
  name: string;
  type: "General" | "ICU" | "Pediatric" | "Emergency";
  total_beds: number;
  occupied_beds: number;
  free_beds: number;
  last_updated: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  target: "public" | "staff" | "all";
  created_at: string;
  acknowledged: boolean;
  acknowledged_at?: string;
}

export interface Ambulance {
  id: string;
  status: "idle" | "en_route" | "arrived";
  source_name?: string;
  destination_name?: string;
  source_coords?: {
    lat: number;
    lng: number;
  };
  destination_coords?: {
    lat: number;
    lng: number;
  };
  updated_at: string;
  driver_name?: string;
}

export interface TrendingDisease {
  id: string;
  name: string;
  description: string;
  cases_count: number;
  trend: "rising" | "stable" | "declining";
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  city: string;
  last_updated: string;
}

// ============================================
// ML API INTEGRATION TYPES
// ============================================

export interface SurgeForecast {
  city: string;
  date: string;
  
  // Risk levels (raw + derived)
  api_risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  ui_risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  
  // Surge metrics
  total_surges_detected: number;
  
  // Resources (raw + derived)
  resources_required: {
    // Raw from API
    raw_total_beds: number;
    raw_total_oxygen_units: number;
    raw_total_ventilators: number;
    raw_total_staff: number;
    raw_total_ors_kits: number;
    raw_total_nebulizers: number;
    raw_total_masks: number;
    raw_total_ppe_kits: number;
    
    // Derived for UI
    additional_beds: number;
    oxygen_units: number;
    ventilators: number;
    nebulizers: number;
    masks: number;
    ppe_kits: number;
    ors_kits: number;
    icu_beds: number;
    staff_nurses: number;
    staff_doctors: number;
  };
  
  // Disease predictions
  diseases: Array<{
    disease_name: string;
    predicted_cases: number;
    baseline_median: number;
    is_surge: boolean;
    disease_specific_resources?: Record<string, number>;
  }>;
  
  advisories: string[];
  created_at: string;
}

export interface EmergencyCase {
  id?: string;
  symptom: string;
  inferred_severity: string;
  emergency_level: string;
  required_speciality: string;
  
  assigned_hospital_name: string;
  distance_km: number;
  predicted_waiting_time_min: number;
  traffic_level: string;
  recommended_ambulance_type: string;
  
  status: 'new' | 'en_route' | 'arrived' | 'complete';
  created_at: string;
}

export interface AmbulanceTracking {
  id?: string;
  status: 'idle' | 'en_route';
  source_name: string;
  destination_name: string;
  user_lat: number;
  user_lng: number;
  hospital_lat?: number;
  hospital_lng?: number;
  case_id: string;
  updated_at: string;
}

// ============================================
// AQI TYPES
// ============================================

export interface AQIData {
  value: number;
  status: "Good" | "Moderate" | "Unhealthy" | "Very Unhealthy" | "Hazardous";
  color: string;
  city: string;
  timestamp: string;
}

// ============================================
// LEGACY TYPES (from existing codebase)
// ============================================

export type Role = "Admin" | "Doctor" | "Nurse" | "Planner";

export interface User {
  id: string;
  name: string;
  role: Role;
  department: string;
  avatarUrl?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: Role;
  department: string;
  shifts: Shift[];
  weeklyHours: number;
  status: "Active" | "Off" | "On Leave";
}

export interface Shift {
  id: string;
  staffId: string;
  start: string;
  end: string;
  type: "Morning" | "Afternoon" | "Night";
  isOvertime: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  forecastedUsage: number;
  reorderLevel: number;
  status: "Safe" | "At Risk" | "Critical";
  lastRestocked: string;
}

export interface Bed {
  id: string;
  ward: string;
  type: "General" | "ICU" | "Pediatric" | "Emergency";
  isOccupied: boolean;
  patientId?: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  department: string;
  time: string;
  status: "Confirmed" | "Pending" | "Rescheduled" | "Cancelled";
  isSurgeImpacted: boolean;
  aiSuggestion?: string;
}

export interface Plan {
  id: string;
  type: "Staffing" | "Inventory" | "Beds" | "Alerts";
  status: "Draft" | "Pending Approval" | "Active" | "Completed";
  createdAt: string;
  summary: string;
}

export interface ForecastData {
  timestamp: string;
  predictedVolume: number;
  baselineVolume: number;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  condition: string;
  aqi: number;
  aqiStatus: "Good" | "Moderate" | "Unhealthy" | "Hazardous";
}
