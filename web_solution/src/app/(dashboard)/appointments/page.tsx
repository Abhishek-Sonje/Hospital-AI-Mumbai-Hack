"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AppointmentList } from "@/components/appointments/appointment-list";
import { SurgeBanner } from "@/components/appointments/surge-banner";
import { getAppointments } from "@/lib/api";
import { Appointment } from "@/lib/types";
import { Calendar, Filter } from "lucide-react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data);
      setLoading(false);
    };
    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      <SurgeBanner />

      <div className="space-y-6">
        <AppointmentList appointments={appointments} />
      </div>
    </div>
  );
}
