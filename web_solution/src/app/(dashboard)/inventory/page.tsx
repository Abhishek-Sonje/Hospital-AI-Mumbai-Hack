"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { getInventory } from "@/lib/api";
import { InventoryItem } from "@/lib/types";
import { FileText, ShoppingCart } from "lucide-react";

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      const data = await getInventory();
      setItems(data);
      setLoading(false);
    };
    fetchInventory();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Generate Purchase Plan
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center bg-muted/40 p-4 rounded-lg border">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
            <SelectItem value="icu">ICU</SelectItem>
            <SelectItem value="pharmacy">Pharmacy</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="respiratory">Respiratory</SelectItem>
            <SelectItem value="ppe">PPE</SelectItem>
            <SelectItem value="medications">Medications</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        <InventoryTable items={items} />
      </div>
    </div>
  );
}
