"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ForecastData } from "@/lib/types";

interface SurgeChartProps {
  data: ForecastData[];
}

export function SurgeChart({ data }: SurgeChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Surge Forecast (Next 24 Hours)</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(str) => {
                const date = new Date(str);
                return date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              }}
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Predicted
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].value}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Baseline
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[1].value}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="predictedVolume"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorPredicted)"
            />
            <Area
              type="monotone"
              dataKey="baselineVolume"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorBaseline)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
