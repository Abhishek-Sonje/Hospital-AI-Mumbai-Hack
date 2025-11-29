"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/lib/types";
import { Send, Edit2, Trash2 } from "lucide-react";

interface AdvisoryListProps {
  alerts: Alert[];
}

export function AdvisoryList({ alerts }: AdvisoryListProps) {
  const publicAlerts = alerts.filter((a) => a.type === "Public");

  return (
    <div className="space-y-4">
      {publicAlerts.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No public advisories drafted.
        </div>
      ) : (
        publicAlerts.map((alert) => (
          <Card key={alert.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{alert.title}</CardTitle>
                <Badge variant={alert.status === "Sent" ? "default" : "secondary"}>
                  {alert.status}
                </Badge>
              </div>
              <CardDescription>
                Target: {alert.audience || "General Public"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {alert.message}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit2 className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button size="sm">
                  <Send className="mr-2 h-3 w-3" />
                  Send Now
                </Button>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
