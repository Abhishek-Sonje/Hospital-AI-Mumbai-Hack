import { NextRequest, NextResponse } from 'next/server'
import { hospitalRecClient } from '@/lib/api/hospital-rec-client'
import { db } from '@/lib/firebase'
import { collection, addDoc, doc, setDoc } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      user_lat,
      user_lng,
      symptom,
      severity,
      top_k = 5,
    } = body
    
    // Validate required fields
    if (user_lat === undefined || user_lng === undefined || !symptom || !severity) {
      return NextResponse.json(
        { error: 'Missing required fields: user_lat, user_lng, symptom, severity' },
        { status: 400 }
      )
    }
    
    console.log('[Emergency API] Getting hospital recommendations for symptom:', symptom)
    
    // Call external ML API
    const apiResponse = await hospitalRecClient.recommendHospital({
      user_lat,
      user_lng,
      symptom,
      severity,
      top_k,
    })
    
    console.log('[Emergency API] Received', apiResponse.recommendations.length, 'recommendations')
    
    // Get top recommendation
    const topRecommendation = apiResponse.recommendations[0]
    
    if (!topRecommendation) {
      return NextResponse.json(
        { error: 'No hospital recommendations available' },
        { status: 404 }
      )
    }
    
    // Create emergency case in Firestore
    const caseData = {
      symptom: apiResponse.query.symptom,
      inferred_severity: apiResponse.query.inferred_severity,
      emergency_level: apiResponse.query.emergency_level,
      required_speciality: apiResponse.query.required_speciality,
      
      assigned_hospital_name: topRecommendation.hospital_name,
      distance_km: topRecommendation.distance_km,
      predicted_waiting_time_min: topRecommendation.predicted_waiting_time_min,
      traffic_level: topRecommendation.traffic_level,
      recommended_ambulance_type: topRecommendation.recommended_ambulance_type,
      
      status: 'new',
      created_at: new Date().toISOString(),
    }
    
    const caseRef = await addDoc(collection(db, 'emergency_cases'), caseData)
    console.log('[Emergency API] Created emergency case:', caseRef.id)
    
    // Create ambulance tracking entry
    const ambulanceData = {
      status: 'en_route',
      source_name: `User location (${user_lat.toFixed(4)}, ${user_lng.toFixed(4)})`,
      destination_name: topRecommendation.hospital_name,
      user_lat,
      user_lng,
      case_id: caseRef.id,
      updated_at: new Date().toISOString(),
    }
    
    const ambulanceRef = await addDoc(collection(db, 'ambulances'), ambulanceData)
    console.log('[Emergency API] Created ambulance tracking:', ambulanceRef.id)
    
    return NextResponse.json({
      success: true,
      case_id: caseRef.id,
      ambulance_id: ambulanceRef.id,
      query: apiResponse.query,
      top_recommendation: topRecommendation,
      all_recommendations: apiResponse.recommendations,
    })
    
  } catch (error: any) {
    console.error('[Emergency API] Error:', error)
    return NextResponse.json(
      { 
        error: 'Emergency recommendation failed', 
        message: error.message 
      },
      { status: 500 }
    )
  }
}
