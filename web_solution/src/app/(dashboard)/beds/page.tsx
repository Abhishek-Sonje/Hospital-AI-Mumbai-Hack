"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BedOverviewCards } from "@/components/beds/bed-overview-cards";
import { OccupancyChart } from "@/components/beds/occupancy-chart";
import { WardTable } from "@/components/beds/ward-table";
import { getWards } from "@/lib/api";
import { Ward } from "@/lib/types";
import { BedDouble, RefreshCw } from "lucide-react";

export default function BedsPage() {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWards = async () => {
      setLoading(true);
      const data = await getWards();
      setWards(data);
      setLoading(false);
    };
    fetchWards();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bed & Ward Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Status
          </Button>
          <Button>
            <BedDouble className="mr-2 h-4 w-4" />
            Reserve ICU Beds
          </Button>
        </div>
      </div>

      <BedOverviewCards wards={wards} />

      <div className="grid gap-6 lg:grid-cols-3">
        <OccupancyChart wards={wards} />
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold leading-none tracking-tight mb-4">
              AI Suggestions
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-md border p-4 bg-blue-50 dark:bg-blue-900/20">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-blue-700 dark:text-blue-300">
                    Reserve 3 ICU beds
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Tomorrow 6pm–12am for predicted trauma cases.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-md border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Convert 5 general beds
                  </p>
                  <p className="text-sm text-muted-foreground">
                    To high-dependency unit for respiratory surge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Ward Status</h2>
        <WardTable wards={wards} />
      </div>
    </div>
  );
}
