"use client";

import { useState } from 'react';
import { surgeAPI } from '@/lib/api/surge-api';
import { SurgePredictionRequest, SurgePredictionResponse } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Users, Activity, Bed, Wind } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function HospitalDashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState<SurgePredictionResponse | null>(null);

  // Form state
  const [formData, setFormData] = useState<SurgePredictionRequest>({
    city: 'Mumbai',
    aqi: 150,
    pm25: 75,
    pm10: 100,
    temperature: 28,
    humidity: 65,
    rainfall: 0,
    season: 'winter',
    festival: false,
    day_type: 'weekday',
    city_population: 20000000,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🟢 [HOSPITAL PAGE] Form submitted');
    console.log('🟢 [HOSPITAL PAGE] Form data:', formData);

    try {
      console.log('🟢 [HOSPITAL PAGE] Calling surge API...');
      const result = await surgeAPI.predictSurge(formData);
      console.log('🟢 [HOSPITAL PAGE] Prediction result received:', result);
      console.log('🟢 [HOSPITAL PAGE] Setting prediction state...');
      setPrediction(result);
      console.log('✅ [HOSPITAL PAGE] Prediction state updated successfully');
    } catch (err: any) {
      console.error('🔴 [HOSPITAL PAGE] Error occurred:', err);
      console.error('🔴 [HOSPITAL PAGE] Error message:', err.message);
      const errorMessage = err.message || 'Failed to predict surge. Please check if the API is running.';
      console.error('🔴 [HOSPITAL PAGE] Setting error message:', errorMessage);
      setError(errorMessage);
    } finally {
      console.log('🟢 [HOSPITAL PAGE] Setting loading to false');
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patient Surge Prediction</h1>
        <p className="text-muted-foreground mt-2">
          Predict patient surges based on environmental and contextual factors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prediction Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Prediction Parameters</CardTitle>
            <CardDescription>Enter current conditions to predict patient surge</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aqi">AQI</Label>
                  <Input
                    id="aqi"
                    type="number"
                    value={formData.aqi}
                    onChange={(e) => setFormData({ ...formData, aqi: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pm25">PM2.5</Label>
                  <Input
                    id="pm25"
                    type="number"
                    value={formData.pm25}
                    onChange={(e) => setFormData({ ...formData, pm25: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pm10">PM10</Label>
                  <Input
                    id="pm10"
                    type="number"
                    value={formData.pm10}
                    onChange={(e) => setFormData({ ...formData, pm10: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="humidity">Humidity (%)</Label>
                  <Input
                    id="humidity"
                    type="number"
                    value={formData.humidity}
                    onChange={(e) => setFormData({ ...formData, humidity: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rainfall">Rainfall (mm)</Label>
                  <Input
                    id="rainfall"
                    type="number"
                    value={formData.rainfall}
                    onChange={(e) => setFormData({ ...formData, rainfall: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="season">Season</Label>
                <Select value={formData.season} onValueChange={(value: any) => setFormData({ ...formData, season: value })}>
                  <SelectTrigger id="season">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="winter">Winter</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="monsoon">Monsoon</SelectItem>
                    <SelectItem value="autumn">Autumn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="day_type">Day Type</Label>
                <Select value={formData.day_type} onValueChange={(value: any) => setFormData({ ...formData, day_type: value })}>
                  <SelectTrigger id="day_type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekday">Weekday</SelectItem>
                    <SelectItem value="weekend">Weekend</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="festival"
                  checked={formData.festival}
                  onChange={(e) => setFormData({ ...formData, festival: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="festival" className="cursor-pointer">Festival Period</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="population">City Population</Label>
                <Input
                  id="population"
                  type="number"
                  value={formData.city_population}
                  onChange={(e) => setFormData({ ...formData, city_population: Number(e.target.value) })}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Predicting...' : 'Predict Surge'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Display */}
        <div className="lg:col-span-2 space-y-6">
          {prediction ? (
            <>
              {/* Risk Level Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Risk Assessment</span>
                    <Badge className={getRiskColor(prediction.summary.risk_level)}>
                      {prediction.summary.risk_level} RISK
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                      <div className="text-2xl font-bold">{prediction.summary.total_surges_detected}</div>
                      <div className="text-sm text-muted-foreground">Surges Detected</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Bed className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold">{prediction.summary.resources_required.total_beds}</div>
                      <div className="text-sm text-muted-foreground">Beds Needed</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Wind className="h-8 w-8 mx-auto mb-2 text-cyan-600" />
                      <div className="text-2xl font-bold">{prediction.summary.resources_required.total_oxygen_units}</div>
                      <div className="text-sm text-muted-foreground">Oxygen Units</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold">{prediction.summary.resources_required.total_staff}</div>
                      <div className="text-sm text-muted-foreground">Staff Required</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Disease Predictions Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Disease-wise Predictions</CardTitle>
                  <CardDescription>Predicted cases and resource requirements by disease</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Disease</th>
                          <th className="text-right p-2">Predicted Cases</th>
                          <th className="text-right p-2">Baseline</th>
                          <th className="text-center p-2">Surge?</th>
                          <th className="text-right p-2">Beds</th>
                          <th className="text-right p-2">Staff</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prediction.predictions.map((disease, idx) => (
                          <tr key={idx} className="border-b hover:bg-muted/50">
                            <td className="p-2 font-medium">{disease.disease}</td>
                            <td className="text-right p-2">{disease.predicted_cases}</td>
                            <td className="text-right p-2 text-muted-foreground">{disease.baseline_median}</td>
                            <td className="text-center p-2">
                              {disease.is_surge ? (
                                <Badge variant="destructive">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </td>
                            <td className="text-right p-2">{disease.resources.beds}</td>
                            <td className="text-right p-2">{disease.resources.staff}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Advisories */}
              {prediction.summary.advisories.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Advisories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {prediction.summary.advisories.map((advisory, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Activity className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{advisory}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Prediction Yet</h3>
                <p className="text-muted-foreground text-center">
                  Fill in the parameters and click "Predict Surge" to see results
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
