"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvisoryList } from "@/components/alerts/advisory-list";
import { StaffNotifications } from "@/components/alerts/staff-notifications";
import { AutoDraft } from "@/components/alerts/auto-draft";
import { getAlerts } from "@/lib/api";
import { Alert } from "@/lib/types";
import { Bell, Radio, Users } from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      const data = await getAlerts();
      setAlerts(data);
      setLoading(false);
    };
    fetchAlerts();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Alert System</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="public" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="public">
                <Radio className="mr-2 h-4 w-4" />
                Public Advisories
              </TabsTrigger>
              <TabsTrigger value="staff">
                <Bell className="mr-2 h-4 w-4" />
                Staff Notifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="public" className="mt-4">
              <AdvisoryList alerts={alerts} />
            </TabsContent>
            <TabsContent value="staff" className="mt-4">
              <StaffNotifications alerts={alerts} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="space-y-6">
          <AutoDraft />
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
             <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold leading-none tracking-tight">
                  Predictive Risks
                </h3>
             </div>
             <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span>Pediatrics Overflow</span>
                    <span className="text-green-600 font-medium">Low Risk</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span>Oxygen Runout</span>
                    <span className="text-yellow-600 font-medium">Medium Risk</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span>Staff Overtime</span>
                    <span className="text-red-600 font-medium">High Risk</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
