"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";

export function SurgeBanner() {
  return (
    <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>High Surge Predicted (6pm - 9pm)</AlertTitle>
      <AlertDescription className="flex items-center justify-between mt-2">
        <span>
          AI recommends rescheduling 20% of non-urgent OPD visits to avoid overcrowding.
        </span>
        <Button variant="outline" size="sm" className="bg-white text-red-900 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-100 dark:border-red-800">
          Apply AI Suggestion
          <ArrowRight className="ml-2 h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
