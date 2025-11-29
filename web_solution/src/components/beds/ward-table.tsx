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
import { Ward } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface WardTableProps {
  wards: Ward[];
}

export function WardTable({ wards }: WardTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ward Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Occupancy</TableHead>
            <TableHead>Predicted Peak</TableHead>
            <TableHead>AI Recommendation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wards.map((ward) => (
            <TableRow key={ward.id}>
              <TableCell className="font-medium">{ward.name}</TableCell>
              <TableCell>{ward.type}</TableCell>
              <TableCell>{ward.capacity}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden max-w-[100px]">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(ward.occupied / ward.capacity) * 100}%`,
                        backgroundColor:
                          ward.occupied / ward.capacity > 0.9
                            ? "#ef4444"
                            : ward.occupied / ward.capacity > 0.7
                            ? "#eab308"
                            : "#22c55e",
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {Math.round((ward.occupied / ward.capacity) * 100)}%
                  </span>
                </div>
              </TableCell>
              <TableCell>{ward.predictedPeak}</TableCell>
              <TableCell>
                {ward.aiRecommendation ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <ArrowRight className="mr-1 h-3 w-3" />
                    {ward.aiRecommendation}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
