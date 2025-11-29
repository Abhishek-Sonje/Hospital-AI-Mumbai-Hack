"use client";

import { useState } from "react";
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
import { InventoryItem } from "@/lib/types";
import { AlertTriangle, CheckCircle2, MoreHorizontal } from "lucide-react";
import { ItemDetailSheet } from "./item-detail-sheet";

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleRowClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Forecast (7d)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>AI Suggestion</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(item)}
              >
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  {item.currentStock} {item.unit}
                </TableCell>
                <TableCell>{item.forecastedUsage} {item.unit}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === "Critical"
                        ? "destructive"
                        : item.status === "At Risk"
                        ? "secondary" // Changed from "warning" to "secondary"
                        : "outline"
                    }
                    className={
                        item.status === "At Risk" ? "bg-yellow-500 hover:bg-yellow-600 text-white" :
                        item.status === "Safe" ? "bg-green-50 text-green-700 border-green-200" : ""
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.status !== "Safe" && (
                    <span className="text-xs font-medium text-blue-600">
                      Reorder +{item.reorderLevel * 1.5}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ItemDetailSheet
        item={selectedItem}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
