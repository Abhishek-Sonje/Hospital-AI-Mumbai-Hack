"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const events = [
  {
    title: "Diwali Night Burns",
    time: "Nov 12, 8:00 PM",
    impact: "High",
    description: "Expected trauma & burn cases.",
  },
  {
    title: "Local Pollution Peak",
    time: "Nov 13, 6:00 AM",
    impact: "Medium",
    description: "Asthma/Respiratory surge.",
  },
  {
    title: "Weekend Traffic",
    time: "Nov 11, 5:00 PM",
    impact: "Low",
    description: "Standard accident rate.",
  },
];

export function ContextPanel() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Upcoming Context</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {events.map((event, index) => (
            <div key={index} className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {event.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {event.time} - {event.description}
                </p>
              </div>
              <div className="ml-auto font-medium">
                <Badge
                  variant={
                    event.impact === "High"
                      ? "destructive"
                      : event.impact === "Medium"
                      ? "default" // Changed from "warning" to "default" or "secondary" as "warning" might not exist in default shadcn
                      : "secondary"
                  }
                  className={event.impact === "Medium" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                >
                  {event.impact}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
