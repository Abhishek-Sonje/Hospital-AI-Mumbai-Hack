"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/lib/types";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ItemDetailSheetProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock usage data
const usageData = [
  { day: "Mon", usage: 40 },
  { day: "Tue", usage: 35 },
  { day: "Wed", usage: 50 },
  { day: "Thu", usage: 45 },
  { day: "Fri", usage: 60 },
  { day: "Sat", usage: 55 },
  { day: "Sun", usage: 40 },
];

export function ItemDetailSheet({ item, open, onOpenChange }: ItemDetailSheetProps) {
  if (!item) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>{item.name}</SheetTitle>
          <SheetDescription>
            Inventory details and AI forecasts for {item.category}.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Current Stock
              </p>
              <p className="text-2xl font-bold">
                {item.currentStock} {item.unit}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Reorder Level
              </p>
              <p className="text-2xl font-bold">
                {item.reorderLevel} {item.unit}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium leading-none">Usage Forecast</h4>
            <div className="h-[200px] w-full border rounded-md p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData}>
                  <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="usage"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground">
              Projected +60% usage due to AQI forecast.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button className="w-full">Accept AI Reorder (150 {item.unit})</Button>
            <Button variant="outline" className="w-full">
              Adjust Quantity
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
