// API Response Mappers
// Transforms raw API responses into Firestore-friendly schemas

import type { SurgeAPIResponse, DiseasePrediction } from './surge-client'

// Resource name mapping for inventory comparison
export const RESOURCE_TO_INVENTORY_MAP: Record<string, string> = {
  inhalers: 'Inhaler',
  trauma_kits: 'Trauma Kit',
  blood_units: 'Blood Unit',
  bronchodilators: 'Bronchodilator',
  nebulizers: 'Nebulizer',
  masks: 'N95 Mask',
  ppe_kits: 'PPE Kit',
  oxygen_units: 'Oxygen Cylinder',
  ventilators: 'Ventilator',
}

// UI-friendly risk level type
export type UIRiskLevel = 'Low' | 'Medium' | 'High' | 'Critical'

/**
 * Compute UI risk level from API risk_level
 * "Critical" is derived when HIGH risk + multiple surges
 */
export function computeUIRiskLevel(
  apiRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH',
  totalSurges: number
): UIRiskLevel {
  if (apiRiskLevel === 'HIGH' && totalSurges >= 3) {
    return 'Critical'
  }
  
  // Map API values to UI-friendly format
  const mapping: Record<string, UIRiskLevel> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
  }
  
  return mapping[apiRiskLevel] || 'Low'
}

/**
 * Transform raw API resources into Firestore schema
 * Stores both raw API fields and derived UI fields
 */
export function mapSurgeResources(apiResponse: SurgeAPIResponse) {
  const { resources_required } = apiResponse.predictions.summary
  
  return {
    // Raw API fields (for audit/transparency)
    raw_total_beds: resources_required.total_beds,
    raw_total_oxygen_units: resources_required.total_oxygen_units,
    raw_total_ventilators: resources_required.total_ventilators,
    raw_total_ors_kits: resources_required.total_ors_kits,
    raw_total_nebulizers: resources_required.total_nebulizers,
    raw_total_masks: resources_required.total_masks,
    raw_total_ppe_kits: resources_required.total_ppe_kits,
    raw_total_staff: resources_required.total_staff,
    
    // Derived fields for UI/planning
    additional_beds: resources_required.total_beds,
    oxygen_units: resources_required.total_oxygen_units,
    ventilators: resources_required.total_ventilators,
    nebulizers: resources_required.total_nebulizers,
    masks: resources_required.total_masks,
    ppe_kits: resources_required.total_ppe_kits,
    ors_kits: resources_required.total_ors_kits,
    
    // Derived: ICU beds = ~20% of total beds
    icu_beds: Math.ceil(resources_required.total_beds * 0.2),
    
    // Derived: Staff breakdown (70% nurses, 30% doctors)
    staff_nurses: Math.ceil(resources_required.total_staff * 0.7),
    staff_doctors: Math.ceil(resources_required.total_staff * 0.3),
  }
}

/**
 * Transform complete surge API response for Firestore storage
 */
export function transformSurgeForFirestore(
  apiResponse: SurgeAPIResponse,
  city: string,
  date: string
) {
  const { predictions } = apiResponse
  const { summary, diseases } = predictions
  
  return {
    city,
    date,
    
    // Risk levels (raw + derived)
    api_risk_level: summary.risk_level,
    ui_risk_level: computeUIRiskLevel(summary.risk_level, summary.total_surges_detected),
    
    // Surge metrics
    total_surges_detected: summary.total_surges_detected,
    
    // Resources (raw + derived)
    resources_required: mapSurgeResources(apiResponse),
    
    // Diseases (unchanged from API)
    diseases: diseases.map(d => ({
      disease_name: d.disease_name,
      predicted_cases: d.predicted_cases,
      baseline_median: d.baseline_median,
      is_surge: d.is_surge,
      disease_specific_resources: d.disease_specific_resources || {},
    })),
    
    // Advisories
    advisories: summary.advisories,
    
    // Metadata
    created_at: new Date().toISOString(),
  }
}

/**
 * Compare surge predictions with inventory to find shortages
 */
export interface InventoryShortage {
  item_name: string
  disease: string
  predicted_need: number
  current_stock: number
  shortage: number
}

export function findInventoryShortages(
  diseases: DiseasePrediction[],
  inventory: Array<{ name: string; current_stock: number }>
): InventoryShortage[] {
  const shortages: InventoryShortage[] = []
  
  diseases.forEach(disease => {
    const specificRes = disease.disease_specific_resources || {}
    
    Object.entries(specificRes).forEach(([apiKey, predictedNeed]) => {
      if (typeof predictedNeed !== 'number') return
      
      // Map API key to inventory name
      const inventoryName = RESOURCE_TO_INVENTORY_MAP[apiKey]
      if (!inventoryName) return
      
      const item = inventory.find(i => i.name === inventoryName)
      if (!item) return
      
      if (predictedNeed > item.current_stock) {
        shortages.push({
          item_name: inventoryName,
          disease: disease.disease_name,
          predicted_need: predictedNeed,
          current_stock: item.current_stock,
          shortage: predictedNeed - item.current_stock,
        })
      }
    })
  })
  
  return shortages
}
