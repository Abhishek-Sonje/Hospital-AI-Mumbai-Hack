"use client";

import React, { useState } from 'react';
import { Search, MapPin, Activity, AlertTriangle, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Recommendation {
  hospital_name: string;
  speciality: string;
  distance_km: number;
  predicted_waiting_time_min: number;
  available_general_beds: number;
  available_icu_beds: number;
  available_ventilators: number;
  traffic_level: string;
  recommended_ambulance_type: string;
  ml_score: number;
}

export function HospitalRecommender() {
  const [symptom, setSymptom] = useState('');
  const [severity, setSeverity] = useState('moderate');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendations([]);

    try {
      // Mock user location (Mumbai center)
      const userLat = 19.0760;
      const userLng = 72.8777;

      const apiUrl = process.env.NEXT_PUBLIC_HOSPITAL_RECOMMENDATION_API_URL;
      
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(`${apiUrl}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_lat: userLat,
          user_lng: userLng,
          symptom,
          severity,
          top_k: 5
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setRecommendations(data.recommendations);
      } else {
        throw new Error('API returned error status');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
            <Activity className="h-5 w-5 text-indigo-600" />
            Find Best Hospital
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 space-y-2">
              <Label htmlFor="symptom">Symptom / Condition</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="symptom"
                  placeholder="e.g. Chest Pain, Fracture..."
                  className="pl-9"
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="md:col-span-4 space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Mild (Non-urgent)</SelectItem>
                  <SelectItem value="moderate">Moderate (Urgent)</SelectItem>
                  <SelectItem value="severe">Severe (Critical)</SelectItem>
                  <SelectItem value="critical">Life Threatening</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3 flex items-end">
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                {loading ? 'Analyzing...' : 'Find Hospitals'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          {error}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Recommended Hospitals</h3>
          <div className="grid gap-4">
            {recommendations.map((hospital, idx) => (
              <Card key={idx} className="overflow-hidden border-slate-200 hover:border-indigo-200 transition-colors">
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left: Hospital Info */}
                  <div className="md:col-span-5 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="text-lg font-bold text-slate-900">{hospital.hospital_name}</h4>
                      {idx === 0 && (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Best Match</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{hospital.distance_km} km away</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Activity className="h-4 w-4 text-slate-400" />
                      <span>Speciality: {hospital.speciality}</span>
                    </div>
                  </div>

                  {/* Middle: Stats */}
                  <div className="md:col-span-4 grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-500 mb-1">Est. Wait Time</p>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="font-bold text-slate-900">{hospital.predicted_waiting_time_min} min</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-500 mb-1">Traffic</p>
                      <span className={`font-bold ${
                        hospital.traffic_level === 'High' ? 'text-red-600' : 
                        hospital.traffic_level === 'Moderate' ? 'text-orange-600' : 'text-emerald-600'
                      }`}>
                        {hospital.traffic_level}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-500 mb-1">ICU Beds</p>
                      <span className="font-bold text-slate-900">{hospital.available_icu_beds}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-500 mb-1">Ambulance</p>
                      <span className="font-bold text-slate-900 text-xs">{hospital.recommended_ambulance_type}</span>
                    </div>
                  </div>

                  {/* Right: Action */}
                  <div className="md:col-span-3 flex flex-col justify-center gap-2">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                      <Navigation className="h-4 w-4 mr-2" />
                      Navigate
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
