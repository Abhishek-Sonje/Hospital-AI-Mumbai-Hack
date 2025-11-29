"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { SurgeChart } from "@/components/dashboard/surge-chart";
import { ContextPanel } from "@/components/dashboard/context-panel";
import { ImpactSummary } from "@/components/dashboard/impact-summary";
import { getSurgeForecast, getWeatherData } from "@/lib/api";
import { ForecastData, WeatherData } from "@/lib/types";
import { RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [forecast, weatherData] = await Promise.all([
        getSurgeForecast(),
        getWeatherData(),
      ]);
      setForecastData(forecast);
      setWeather(weatherData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunForecast = () => {
    fetchData();
  };

  if (!weather || forecastData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        Loading Dashboard...
      </div>
    );
  }

  // Calculate predicted surge percentage (mock logic)
  const currentPredicted = forecastData[0]?.predictedVolume || 0;
  const currentBaseline = forecastData[0]?.baselineVolume || 1;
  const surgePercentage = Math.round(
    ((currentPredicted - currentBaseline) / currentBaseline) * 100
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleRunForecast} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Running AI Forecast...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Run AI Forecast
              </>
            )}
          </Button>
        </div>
      </div>

      <MetricsCards weather={weather} predictedSurge={surgePercentage} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <SurgeChart data={forecastData} />
        <ContextPanel />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Projected Impact & AI Plans
        </h2>
        <ImpactSummary />
      </div>
    </div>
  );
}
