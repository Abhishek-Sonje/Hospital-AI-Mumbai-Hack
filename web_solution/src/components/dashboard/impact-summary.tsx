"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

export function ImpactSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ER/OPD Load</CardTitle>
          <AlertCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Critical</div>
          <p className="text-xs text-muted-foreground mb-2">
            +45% expected load
          </p>
          <div className="flex items-center text-xs text-green-600">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Staffing plan ready
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ICU Beds</CardTitle>
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">High Risk</div>
          <p className="text-xs text-muted-foreground mb-2">
            90% occupancy predicted
          </p>
          <div className="flex items-center text-xs text-yellow-600">
            <Clock className="mr-1 h-3 w-3" />
            Plan pending approval
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pediatrics</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Normal</div>
          <p className="text-xs text-muted-foreground mb-2">
            Within capacity
          </p>
          <div className="flex items-center text-xs text-muted-foreground">
            No action needed
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Oxygen Usage</CardTitle>
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Elevated</div>
          <p className="text-xs text-muted-foreground mb-2">
            +20% consumption
          </p>
          <div className="flex items-center text-xs text-green-600">
             <CheckCircle2 className="mr-1 h-3 w-3" />
            Inventory check done
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
