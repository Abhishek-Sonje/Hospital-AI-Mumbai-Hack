"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plan } from "@/lib/types";
import { CheckCircle2, Clock, RefreshCw } from "lucide-react";

interface PlanDetailProps {
  plan: Plan | null;
}

export function PlanDetail({ plan }: PlanDetailProps) {
  if (!plan) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select a plan to view details
      </div>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>{plan.summary}</CardTitle>
            <CardDescription>ID: {plan.id}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-3 w-3" />
              Re-plan
            </Button>
            <Button size="sm">
              <CheckCircle2 className="mr-2 h-3 w-3" />
              Approve & Execute
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Timeline of Actions</h3>
          <div className="relative border-l border-muted ml-2 space-y-6 pb-2">
            <div className="ml-6 relative">
              <div className="absolute -left-[29px] mt-1.5 h-3 w-3 rounded-full border border-primary bg-background" />
              <p className="text-sm font-medium">Plan Generated</p>
              <p className="text-xs text-muted-foreground">
                AI analyzed surge data and constraints.
              </p>
            </div>
            <div className="ml-6 relative">
              <div className="absolute -left-[29px] mt-1.5 h-3 w-3 rounded-full border border-primary bg-background" />
              <p className="text-sm font-medium">Optimization Complete</p>
              <p className="text-xs text-muted-foreground">
                Staff schedules balanced for overtime risk.
              </p>
            </div>
            <div className="ml-6 relative">
              <div className="absolute -left-[29px] mt-1.5 h-3 w-3 rounded-full border border-muted bg-muted" />
              <p className="text-sm font-medium text-muted-foreground">
                Pending Approval
              </p>
              <p className="text-xs text-muted-foreground">
                Waiting for admin review.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border p-4 bg-muted/20">
          <h3 className="font-semibold text-sm mb-2">AI Reasoning</h3>
          <p className="text-sm text-muted-foreground">
            This plan prioritizes ICU coverage due to the predicted AQI spike.
            Non-critical inventory orders have been deferred to optimize budget.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
