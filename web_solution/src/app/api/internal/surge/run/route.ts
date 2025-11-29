import { NextRequest, NextResponse } from 'next/server'
import { surgeClient } from '@/lib/api/surge-client'
import { transformSurgeForFirestore } from '@/lib/api/api-mappers'
import { db } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      city,
      aqi,
      pm25,
      pm10,
      temperature,
      humidity,
      rainfall,
      season,
      festival,
      day_type,
      city_population,
      diseases,
      surge_multiplier,
    } = body
    
    // Validate required fields
    if (!city || aqi === undefined || pm25 === undefined || pm10 === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: city, aqi, pm25, pm10' },
        { status: 400 }
      )
    }
    
    console.log('[Surge API] Calling surge prediction for city:', city)
    
    // Call external ML API
    const apiResponse = await surgeClient.predictSurge({
      city,
      aqi,
      pm25,
      pm10,
      temperature: temperature ?? 25,
      humidity: humidity ?? 60,
      rainfall: rainfall ?? 0,
      season: season || 'Winter',
      festival: festival || 'None',
      day_type: day_type || 'weekday',
      city_population,
      diseases,
      surge_multiplier,
    })
    
    console.log('[Surge API] Received response, risk level:', apiResponse.predictions.summary.risk_level)
    
    // Transform for Firestore
    const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const transformed = transformSurgeForFirestore(apiResponse, city, date)
    
    // Store in Firestore
    const docPath = `surge_forecasts/${city}_${date}`
    await setDoc(doc(db, docPath), transformed)
    
    console.log('[Surge API] Stored forecast in Firestore:', docPath)
    
    return NextResponse.json({
      success: true,
      forecast: transformed,
      firestore_path: docPath,
    })
    
  } catch (error: any) {
    console.error('[Surge API] Error:', error)
    return NextResponse.json(
      { 
        error: 'Surge prediction failed', 
        message: error.message 
      },
      { status: 500 }
    )
  }
}
