"use client";

import { useEffect, useState } from "react";
import { PlanList } from "@/components/planner/plan-list";
import { PlanDetail } from "@/components/planner/plan-detail";
import { getPlans } from "@/lib/api";
import { Plan } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PlannerPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      const data = await getPlans();
      setPlans(data);
      if (data.length > 0) {
        setSelectedPlan(data[0]);
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Autonomous Planner</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Plan
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 h-full">
        <div className="lg:col-span-1 border-r pr-6 overflow-y-auto">
          <PlanList
            plans={plans}
            selectedPlan={selectedPlan}
            onSelectPlan={setSelectedPlan}
          />
        </div>
        <div className="lg:col-span-2 h-full">
          <PlanDetail plan={selectedPlan} />
        </div>
      </div>
    </div>
  );
}
