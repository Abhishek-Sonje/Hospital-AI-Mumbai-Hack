"use client";

import { useEffect, useState } from 'react';
import { getHospitalInventory, updateInventoryItem } from '@/lib/firestore-helpers';
import { HospitalInventoryItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<HospitalInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const items = await getHospitalInventory();
      setInventory(items);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReordered = async (itemId: string) => {
    try {
      await updateInventoryItem(itemId, {
        last_restocked: new Date().toISOString(),
      });
      await loadInventory();
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  const getStatusBadge = (item: HospitalInventoryItem) => {
    if (item.is_critical || item.current_stock < item.reorder_level) {
      return <Badge variant="destructive">Critical</Badge>;
    } else if (item.current_stock < item.reorder_level * 1.5) {
      return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">OK</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  const criticalItems = inventory.filter(item => item.is_critical || item.current_stock < item.reorder_level);
  const lowStockItems = inventory.filter(item => !item.is_critical && item.current_stock >= item.reorder_level && item.current_stock < item.reorder_level * 1.5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hospital Resources & Inventory</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage medical supplies and equipment
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>All medical supplies and equipment</CardDescription>
        </CardHeader>
        <CardContent>
          {inventory.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Inventory Items</h3>
              <p className="text-muted-foreground">
                No inventory items found. Add items in Firestore to see them here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Item Name</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-right p-3">Current Stock</th>
                    <th className="text-right p-3">Reorder Level</th>
                    <th className="text-left p-3">Unit</th>
                    <th className="text-center p-3">Status</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{item.name}</td>
                      <td className="p-3 text-muted-foreground">{item.category}</td>
                      <td className="text-right p-3">
                        <span className={item.current_stock < item.reorder_level ? 'text-red-600 font-bold' : ''}>
                          {item.current_stock}
                        </span>
                      </td>
                      <td className="text-right p-3">{item.reorder_level}</td>
                      <td className="p-3">{item.unit}</td>
                      <td className="text-center p-3">{getStatusBadge(item)}</td>
                      <td className="text-right p-3">
                        {item.current_stock < item.reorder_level && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkReordered(item.id)}
                          >
                            Mark Reordered
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
