"use client"

import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { EmergencyCase } from '@/lib/types'
import { Ambulance, Clock, MapPin, Activity, AlertTriangle } from 'lucide-react'

export default function EmergencyCasesPage() {
  const [cases, setCases] = useState<EmergencyCase[]>([])
  const [loading, setLoading] = useState(true)
  
  // In production, get this from hospital context/auth
  const hospitalName = "KEM Hospital"

  useEffect(() => {
    const q = query(
      collection(db, 'emergency_cases'),
      where('assigned_hospital_name', '==', hospitalName),
      orderBy('created_at', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const casesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EmergencyCase))
      
      setCases(casesData)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching emergency cases:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [hospitalName])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500'
      case 'en_route': return 'bg-yellow-500'
      case 'arrived': return 'bg-green-500'
      case 'complete': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getEmergencyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'medium': return 'text-yellow-600'
      default: return 'text-blue-600'
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading emergency queue...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Emergency Queue</h1>
        <p className="text-muted-foreground mt-2">
          Real-time emergency cases assigned to your hospital
        </p>
      </div>

      <div className="grid gap-4">
        {cases.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No Emergency Cases</h3>
                <p className="text-sm text-muted-foreground">
                  No emergency cases currently assigned to your hospital
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          cases.map((emergencyCase) => (
            <Card key={emergencyCase.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{emergencyCase.symptom}</h3>
                      <p className="text-sm text-muted-foreground">
                        {emergencyCase.required_speciality}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(emergencyCase.status)}>
                        {emergencyCase.status.toUpperCase()}
                      </Badge>
                      <span className={`text-sm font-medium ${getEmergencyColor(emergencyCase.emergency_level)}`}>
                        {emergencyCase.emergency_level}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">{emergencyCase.inferred_severity}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span>{emergencyCase.distance_km.toFixed(1)} km away</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span>~{emergencyCase.predicted_waiting_time_min} min ETA</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Ambulance className="h-4 w-4 text-red-500" />
                      <span>{emergencyCase.recommended_ambulance_type}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                    <span>Traffic: {emergencyCase.traffic_level}</span>
                    <span>Created: {new Date(emergencyCase.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
