"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { SurgeForecast } from '@/lib/types'
import { AlertTriangle, Activity, Users, Bed, Wind } from 'lucide-react'

interface SurgeForecastCardProps {
  forecast: SurgeForecast
}

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'Critical': return 'bg-red-600 text-white'
    case 'High': return 'bg-orange-500 text-white'
    case 'Medium': return 'bg-yellow-500 text-black'
    case 'Low': return 'bg-green-500 text-white'
    default: return 'bg-gray-500 text-white'
  }
}

export function SurgeForecastCard({ forecast }: SurgeForecastCardProps) {
  const { ui_risk_level, total_surges_detected, resources_required, diseases, advisories } = forecast
  
  return (
    <div className="space-y-4">
      {/* Risk Level Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            City Health Risk Forecast
          </CardTitle>
          <CardDescription>
            {forecast.city} - {new Date(forecast.date).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">Risk Level</span>
            <Badge className={`text-lg px-4 py-2 ${getRiskColor(ui_risk_level)}`}>
              {ui_risk_level}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {total_surges_detected} surge{total_surges_detected !== 1 ? 's' : ''} detected
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Resource Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Predicted Resource Requirements</CardTitle>
          <CardDescription>Based on AI forecast model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Total Beds</span>
              </div>
              <span className="text-2xl font-bold">{resources_required.additional_beds}</span>
              <span className="text-xs text-muted-foreground">
                ICU: {resources_required.icu_beds}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-cyan-500" />
                <span className="text-sm font-medium">Oxygen</span>
              </div>
              <span className="text-2xl font-bold">{resources_required.oxygen_units}</span>
              <span className="text-xs text-muted-foreground">units</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Ventilators</span>
              </div>
              <span className="text-2xl font-bold">{resources_required.ventilators}</span>
              <span className="text-xs text-muted-foreground">units</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Staff</span>
              </div>
              <span className="text-2xl font-bold">
                {resources_required.staff_nurses + resources_required.staff_doctors}
              </span>
              <span className="text-xs text-muted-foreground">
                {resources_required.staff_nurses}N / {resources_required.staff_doctors}D
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disease Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>Disease Surge Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {diseases.map((disease, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border ${disease.is_surge ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900' : 'bg-gray-50 dark:bg-gray-900'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {disease.is_surge && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    <span className="font-medium">{disease.disease_name}</span>
                  </div>
                  <Badge variant={disease.is_surge ? 'destructive' : 'secondary'}>
                    {disease.is_surge ? 'SURGE' : 'Normal'}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground flex gap-4">
                  <span>Predicted: {disease.predicted_cases} cases</span>
                  <span>Baseline: {disease.baseline_median}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advisories */}
      {advisories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>AI Advisories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {advisories.map((advisory, idx) => (
              <Alert key={idx}>
                <AlertDescription>{advisory}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
