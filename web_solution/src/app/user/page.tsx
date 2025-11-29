"use client";

import { useEffect, useState } from 'react';
import { getTrendingDiseases, getAlerts } from '@/lib/firestore-helpers';
import { TrendingDisease, Alert as AlertType, AQIData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wind, TrendingUp, Bell, Activity, AlertTriangle, Info } from 'lucide-react';

export default function UserDashboard() {
  const [aqi, setAqi] = useState<AQIData>({
    value: 150,
    status: 'Unhealthy',
    color: '#f59e0b',
    city: 'Mumbai',
    timestamp: new Date().toISOString(),
  });
  const [diseases, setDiseases] = useState<TrendingDisease[]>([]);
  const [advisories, setAdvisories] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [diseasesData, advisoriesData] = await Promise.all([
        getTrendingDiseases(),
        getAlerts('public'),
      ]);
      setDiseases(diseasesData);
      setAdvisories(advisoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAQIColor = (status: string) => {
    switch (status) {
      case 'Good': return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Unhealthy': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Very Unhealthy': return 'bg-red-100 text-red-800 border-red-200';
      case 'Hazardous': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-green-600 rotate-180" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'HIGH': return <Badge variant="destructive">High Risk</Badge>;
      case 'MEDIUM': return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
      case 'LOW': return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>;
      default: return <Badge variant="outline">{level}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Citizen Health Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Stay informed about air quality, trending diseases, and public health advisories
        </p>
      </div>

      {/* AQI Display */}
      <Card className={`border-2 ${getAQIColor(aqi.status)}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-6 w-6" />
                Air Quality Index (AQI)
              </CardTitle>
              <CardDescription className="mt-2">
                Current air quality in {aqi.city}
              </CardDescription>
            </div>
            <Badge className={getAQIColor(aqi.status)} variant="outline">
              {aqi.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <div className="text-5xl font-bold">{aqi.value}</div>
            <div className="text-lg text-muted-foreground mb-2">AQI</div>
          </div>
          <div className="mt-4 p-3 bg-background/50 rounded-lg">
            <p className="text-sm">
              {aqi.status === 'Good' && 'Air quality is satisfactory. Enjoy outdoor activities!'}
              {aqi.status === 'Moderate' && 'Air quality is acceptable for most people.'}
              {aqi.status === 'Unhealthy' && 'Sensitive groups should limit prolonged outdoor exposure.'}
              {aqi.status === 'Very Unhealthy' && 'Everyone should avoid prolonged outdoor exposure.'}
              {aqi.status === 'Hazardous' && 'Health alert! Everyone should avoid outdoor activities.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Trending Diseases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Diseases in Your Area
          </CardTitle>
          <CardDescription>
            Current disease trends and case counts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {diseases.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No trending disease data available. Check back later.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {diseases.map((disease) => (
                <div
                  key={disease.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {getTrendIcon(disease.trend)}
                    <div>
                      <h4 className="font-semibold">{disease.name}</h4>
                      <p className="text-sm text-muted-foreground">{disease.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {disease.cases_count} reported cases
                      </p>
                    </div>
                  </div>
                  {getRiskBadge(disease.risk_level)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Public Advisories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Public Health Advisories
          </CardTitle>
          <CardDescription>
            Important health and safety information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {advisories.length === 0 ? (
            <div className="text-center py-8">
              <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No active advisories at this time. Stay safe!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {advisories.map((advisory) => (
                <Alert key={advisory.id} className={
                  advisory.risk_level === 'CRITICAL' || advisory.risk_level === 'HIGH'
                    ? 'border-red-200 bg-red-50 dark:bg-red-950'
                    : advisory.risk_level === 'MEDIUM'
                    ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950'
                    : 'border-blue-200 bg-blue-50 dark:bg-blue-950'
                }>
                  <div className="flex items-start gap-3">
                    {advisory.risk_level === 'CRITICAL' || advisory.risk_level === 'HIGH' ? (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    ) : (
                      <Info className="h-5 w-5 text-blue-600" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold">{advisory.title}</h4>
                        {getRiskBadge(advisory.risk_level)}
                      </div>
                      <AlertDescription className="text-sm">
                        {advisory.message}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
