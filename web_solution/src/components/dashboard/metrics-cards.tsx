"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CloudRain, Thermometer, AlertTriangle } from "lucide-react";
import { WeatherData } from "@/lib/types";

interface MetricsCardsProps {
  weather: WeatherData;
  predictedSurge: number;
}

export function MetricsCards({ weather, predictedSurge }: MetricsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Predicted Surge
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{predictedSurge}%</div>
          <p className="text-xs text-muted-foreground">
            vs baseline (Today)
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Current AQI
          </CardTitle>
          <CloudRain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{weather.aqi}</div>
          <p className="text-xs text-muted-foreground">
            {weather.aqiStatus} Risk
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weather</CardTitle>
          <Thermometer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weather.temp}°C</div>
          <p className="text-xs text-muted-foreground">
            {weather.condition}, {weather.humidity}% Hum.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Special Events
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Diwali</div>
          <p className="text-xs text-muted-foreground">
            In 2 days (High Alert)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
