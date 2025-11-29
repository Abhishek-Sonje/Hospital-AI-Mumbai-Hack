"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Users } from "lucide-react";

export function RiskSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overtime & Risk</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4 rounded-md border p-4">
          <AlertTriangle className="mt-1 h-5 w-5 text-destructive" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              Dr. Sharma (Emergency)
            </p>
            <p className="text-sm text-muted-foreground">
              Projected 52 hours this week (Limit: 48h).
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 rounded-md border p-4">
          <Users className="mt-1 h-5 w-5 text-yellow-500" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              ICU Night Shift Coverage
            </p>
            <p className="text-sm text-muted-foreground">
              Only 2 nurses available (Min: 3).
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
