"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble, Activity, Baby } from "lucide-react";
import { Ward } from "@/lib/types";

interface BedOverviewCardsProps {
  wards: Ward[];
}

export function BedOverviewCards({ wards }: BedOverviewCardsProps) {
  const totalBeds = wards.reduce((acc, ward) => acc + ward.capacity, 0);
  const totalOccupied = wards.reduce((acc, ward) => acc + ward.occupied, 0);
  const icuWard = wards.find((w) => w.type === "ICU");
  const pedsWard = wards.find((w) => w.type === "Pediatric"); // Assuming mock data has this

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Occupancy</CardTitle>
          <BedDouble className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalOccupied} / {totalBeds}
          </div>
          <p className="text-xs text-muted-foreground">
            {Math.round((totalOccupied / totalBeds) * 100)}% capacity
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ICU Availability</CardTitle>
          <Activity className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {icuWard ? icuWard.occupied : 0} / {icuWard ? icuWard.capacity : 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {icuWard ? icuWard.capacity - icuWard.occupied : 0} beds free
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pediatrics</CardTitle>
          <Baby className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {pedsWard ? pedsWard.occupied : 12} / {pedsWard ? pedsWard.capacity : 20}
          </div>
          <p className="text-xs text-muted-foreground">
            Normal load
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
