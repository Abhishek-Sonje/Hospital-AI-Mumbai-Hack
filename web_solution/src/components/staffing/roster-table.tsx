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
import { Staff } from "@/lib/types";
import { Lock, Unlock, AlertTriangle } from "lucide-react";

interface RosterTableProps {
  staffList: Staff[];
}

export function RosterTable({ staffList }: RosterTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Staff Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>08:00 - 14:00</TableHead>
            <TableHead>14:00 - 20:00</TableHead>
            <TableHead>20:00 - 08:00</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffList.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell className="font-medium">{staff.name}</TableCell>
              <TableCell>{staff.role}</TableCell>
              <TableCell>{staff.department}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    On Duty
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">Off</Badge>
              </TableCell>
              <TableCell>
                {staff.weeklyHours > 40 ? (
                  <div className="flex items-center gap-1 text-destructive text-xs font-medium">
                    <AlertTriangle className="h-3 w-3" />
                    Overtime Risk
                  </div>
                ) : (
                  <Badge variant="secondary">Off</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Unlock className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
