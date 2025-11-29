"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plan } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface PlanListProps {
  plans: Plan[];
  selectedPlan: Plan | null;
  onSelectPlan: (plan: Plan) => void;
}

export function PlanList({ plans, selectedPlan, onSelectPlan }: PlanListProps) {
  return (
    <div className="flex flex-col gap-2">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={cn(
            "cursor-pointer transition-colors hover:bg-muted/50",
            selectedPlan?.id === plan.id && "bg-muted border-primary"
          )}
          onClick={() => onSelectPlan(plan)}
        >
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">
                {plan.summary}
              </CardTitle>
              <Badge
                variant={
                  plan.status === "Active"
                    ? "default"
                    : plan.status === "Pending Approval"
                    ? "secondary" // Changed from "warning" to "secondary"
                    : "outline"
                }
                className={plan.status === "Pending Approval" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""}
              >
                {plan.status}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              {plan.type} • {formatDistanceToNow(new Date(plan.createdAt), { addSuffix: true })}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
