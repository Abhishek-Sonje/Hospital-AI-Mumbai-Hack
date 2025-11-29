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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock Audit Logs
const logs = [
  {
    id: "1",
    timestamp: new Date().toISOString(),
    user: "Dr. Aditi Sharma",
    action: "Approved Staff Schedule",
    entity: "Staffing Plan #102",
    result: "Success",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: "System AI",
    action: "Generated Inventory Forecast",
    entity: "Inventory Plan #45",
    result: "Success",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    user: "Rahul Verma",
    action: "Modified ICU Constraints",
    entity: "Settings",
    result: "Success",
  },
];

export default function AuditLogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search logs..." className="pl-8" />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell className="font-medium">{log.user}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.entity}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {log.result}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
