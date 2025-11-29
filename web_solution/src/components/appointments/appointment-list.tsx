"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/lib/types";
import { Check, X, CalendarClock, AlertTriangle } from "lucide-react";

interface AppointmentListProps {
  appointments: Appointment[];
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Surge Impact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((apt) => (
            <TableRow
              key={apt.id}
              className={apt.isSurgeImpacted ? "bg-red-50 dark:bg-red-900/10" : ""}
            >
              <TableCell className="font-medium">{apt.time}</TableCell>
              <TableCell>{apt.patientName}</TableCell>
              <TableCell>{apt.doctorName}</TableCell>
              <TableCell>{apt.department}</TableCell>
              <TableCell>
                <Badge variant="outline">{apt.status}</Badge>
              </TableCell>
              <TableCell>
                {apt.isSurgeImpacted && (
                  <div className="flex items-center gap-1 text-destructive text-xs font-medium">
                    <AlertTriangle className="h-3 w-3" />
                    High Load
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {apt.isSurgeImpacted && (
                    <Button variant="secondary" size="sm">
                      <CalendarClock className="mr-2 h-3 w-3" />
                      Reschedule
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
