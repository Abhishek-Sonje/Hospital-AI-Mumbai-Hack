// Hospital Recommender API Client
// Matches the raw API response schema exactly

export interface RecommendRequest {
  user_lat: number
  user_lng: number
  symptom: string
  severity: string
  top_k?: number
}

export interface HospitalRecommendation {
  hospital_name: string
  speciality: string
  distance_km: number
  predicted_waiting_time_min: number
  available_general_beds: number
  available_icu_beds: number
  available_ventilators: number
  traffic_level: string
  recommended_ambulance_type: string
  ml_score: number
}

export interface RecommendQuery {
  symptom: string
  inferred_severity: string
  emergency_level: string
  required_speciality: string
}

export interface RecommendAPIResponse {
  status: string
  query: RecommendQuery
  recommendations: HospitalRecommendation[]
}

export interface Symptom {
  name: string
  severity: string
  speciality: string
}

export interface Hospital {
  hospital_name: string
  speciality: string
  hospital_lat: number
  hospital_lng: number
  general_beds: number
  icu_beds: number
  ventilators: number
}

const HOSPITAL_REC_API_URL = process.env.NEXT_PUBLIC_HOSPITAL_REC_API_URL || 'http://localhost:5000'

export const hospitalRecClient = {
  async recommendHospital(payload: RecommendRequest): Promise<RecommendAPIResponse> {
    const response = await fetch(`${HOSPITAL_REC_API_URL}/api/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    
    if (!response.ok) {
      throw new Error(`Hospital recommendation failed: ${response.statusText}`)
    }
    
    return response.json()
  },

  async getSymptoms(): Promise<Symptom[]> {
    const response = await fetch(`${HOSPITAL_REC_API_URL}/api/symptoms`, {
      method: 'GET',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch symptoms: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.symptoms || []
  },

  async getHospitals(params?: { speciality?: string }): Promise<Hospital[]> {
    const queryString = params?.speciality 
      ? `?speciality=${encodeURIComponent(params.speciality)}` 
      : ''
    
    const response = await fetch(`${HOSPITAL_REC_API_URL}/api/hospitals${queryString}`, {
      method: 'GET',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch hospitals: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.hospitals || data
  },
}
