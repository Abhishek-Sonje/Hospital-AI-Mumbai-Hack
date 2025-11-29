// Surge Prediction API Client
// Matches the raw API response schema exactly

export interface SurgePredictRequest {
  city: string
  aqi: number
  pm25: number
  pm10: number
  temperature: number
  humidity: number
  rainfall: number
  season: string
  festival: string
  day_type: string
  city_population?: number
  diseases?: string[]
  surge_multiplier?: number
}

export interface DiseaseResources {
  beds: number
  oxygen_units: number
  ventilators: number
  nebulizers: number
  masks: number
  ppe_kits: number
  staff: number
}

export interface DiseaseSpecificResources {
  inhalers?: number
  trauma_kits?: number
  blood_units?: number
  bronchodilators?: number
}

export interface DiseasePrediction {
  disease_name: string
  predicted_cases: number
  baseline_median: number
  is_surge: boolean
  resources: DiseaseResources
  disease_specific_resources?: DiseaseSpecificResources
}

export interface SummaryResources {
  total_beds: number
  total_oxygen_units: number
  total_ventilators: number
  total_ors_kits: number
  total_nebulizers: number
  total_masks: number
  total_ppe_kits: number
  total_staff: number
}

export interface SurgeAPIResponse {
  status: string
  city: string
  predictions: {
    diseases: DiseasePrediction[]
    summary: {
      total_surges_detected: number
      risk_level: 'LOW' | 'MEDIUM' | 'HIGH'
      resources_required: SummaryResources
      advisories: string[]
    }
  }
}

export interface HealthCheckResponse {
  status: string
  message: string
}

const SURGE_API_URL = process.env.NEXT_PUBLIC_SURGE_API_URL || 'http://localhost:5000'

export const surgeClient = {
  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await fetch(`${SURGE_API_URL}/health`, {
      method: 'GET',
    })
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`)
    }
    
    return response.json()
  },

  async predictSurge(payload: SurgePredictRequest): Promise<SurgeAPIResponse> {
    const response = await fetch(`${SURGE_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    
    if (!response.ok) {
      throw new Error(`Surge prediction failed: ${response.statusText}`)
    }
    
    return response.json()
  },

  async predictSurgeBatch(payloads: SurgePredictRequest[]): Promise<SurgeAPIResponse[]> {
    const response = await fetch(`${SURGE_API_URL}/predict/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests: payloads }),
    })
    
    if (!response.ok) {
      throw new Error(`Batch prediction failed: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.predictions || data
  },
}
