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
import { Alert } from "@/lib/types";
import { Bell, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface StaffNotificationsProps {
  alerts: Alert[];
}

export function StaffNotifications({ alerts }: StaffNotificationsProps) {
  const staffAlerts = alerts.filter((a) => a.type === "Staff");

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffAlerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </TableCell>
              <TableCell className="font-medium">{alert.title}</TableCell>
              <TableCell className="max-w-[300px] truncate">
                {alert.message}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    alert.severity === "High" || alert.severity === "Critical"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {alert.severity}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(alert.timestamp), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell className="text-right">
                {alert.status === "Read" ? (
                  <div className="flex items-center justify-end text-green-600 text-xs">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Read
                  </div>
                ) : (
                  <Badge variant="outline">Unread</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
