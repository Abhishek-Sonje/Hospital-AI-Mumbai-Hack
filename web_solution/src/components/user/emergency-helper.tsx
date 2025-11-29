"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, Ambulance, AlertTriangle, Navigation } from 'lucide-react'
import type { HospitalRecommendation } from '@/lib/api/hospital-rec-client'

interface EmergencyHelperProps {
  userLat?: number
  userLng?: number
}

export function EmergencyHelper({ userLat = 19.0760, userLng = 72.8777 }: EmergencyHelperProps) {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [selectedSymptom, setSelectedSymptom] = useState('')
  const [severity, setSeverity] = useState<string>('moderate')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recommendations, setRecommendations] = useState<HospitalRecommendation[]>([])
  const [caseId, setCaseId] = useState<string | null>(null)

  // Fetch symptoms on mount
  useEffect(() => {
    fetchSymptoms()
  }, [])

  const fetchSymptoms = async () => {
    try {
      const response = await fetch('/api/symptoms')
      const data = await response.json()
      
      if (data.success && data.symptoms) {
        setSymptoms(data.symptoms.map((s: any) => s.name || s))
      }
    } catch (err) {
      console.error('Failed to fetch symptoms:', err)
      // Fallback symptoms
      setSymptoms(['Chest Pain', 'Breathing Difficulty', 'Severe Headache', 'Abdominal Pain', 'Trauma'])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/internal/emergency/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_lat: userLat,
          user_lng: userLng,
          symptom: selectedSymptom,
          severity,
          top_k: 5,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get recommendations')
      }

      setRecommendations(data.all_recommendations || [])
      setCaseId(data.case_id)
    } catch (err: any) {
      setError(err.message || 'Failed to get hospital recommendations')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'severe': return 'bg-red-500'
      case 'moderate': return 'bg-yellow-500'
      case 'mild': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ambulance className="h-5 w-5" />
            Emergency Hospital Finder
          </CardTitle>
          <CardDescription>
            Get AI-powered hospital recommendations based on your symptoms and location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Symptom *</label>
              <Select value={selectedSymptom} onValueChange={setSelectedSymptom} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your symptom" />
                </SelectTrigger>
                <SelectContent>
                  {symptoms.map((symptom) => (
                    <SelectItem key={symptom} value={symptom}>
                      {symptom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Severity *</label>
              <Select value={severity} onValueChange={setSeverity} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Mild - Can wait</SelectItem>
                  <SelectItem value="moderate">Moderate - Needs attention soon</SelectItem>
                  <SelectItem value="severe">Severe - Immediate care needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Location: {userLat.toFixed(4)}, {userLng.toFixed(4)}</span>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading || !selectedSymptom}>
              {loading ? 'Finding Hospitals...' : 'Get Recommendations'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recommended Hospitals</h3>
            {caseId && (
              <Badge variant="outline" className="text-xs">
                Case ID: {caseId.slice(0, 8)}
              </Badge>
            )}
          </div>

          {recommendations.map((rec, idx) => (
            <Card key={idx} className={idx === 0 ? 'border-indigo-200 dark:border-indigo-800' : ''}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{rec.hospital_name}</h4>
                      <p className="text-sm text-muted-foreground">{rec.speciality}</p>
                    </div>
                    {idx === 0 && (
                      <Badge className="bg-indigo-600">Top Match</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-blue-500" />
                      <span>{rec.distance_km.toFixed(1)} km</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>~{rec.predicted_waiting_time_min} min wait</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Ambulance className="h-4 w-4 text-red-500" />
                      <span>{rec.recommended_ambulance_type}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>General Beds: {rec.available_general_beds}</span>
                    <span>ICU: {rec.available_icu_beds}</span>
                    <span>Ventilators: {rec.available_ventilators}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Traffic: {rec.traffic_level}
                    </span>
                    <span className="text-xs font-medium text-indigo-600">
                      Match Score: {(rec.ml_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
