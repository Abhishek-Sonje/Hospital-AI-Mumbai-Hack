import { NextRequest, NextResponse } from 'next/server'
import { hospitalRecClient } from '@/lib/api/hospital-rec-client'

export async function GET(request: NextRequest) {
  try {
    const symptoms = await hospitalRecClient.getSymptoms()
    
    return NextResponse.json({
      success: true,
      symptoms,
    })
  } catch (error: any) {
    console.error('[Symptoms API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch symptoms', message: error.message },
      { status: 500 }
    )
  }
}
