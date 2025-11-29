"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ward } from "@/lib/types";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface OccupancyChartProps {
  wards: Ward[];
}

export function OccupancyChart({ wards }: OccupancyChartProps) {
  const data = wards.map((ward) => ({
    name: ward.name,
    Occupied: ward.occupied,
    Free: ward.capacity - ward.occupied,
    Capacity: ward.capacity,
  }));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Ward Occupancy</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} interval={0} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Occupied" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Free" stackId="a" fill="#22c55e" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
