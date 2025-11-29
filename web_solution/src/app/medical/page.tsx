"use client";

import { useEffect, useState } from 'react';
import { getMedicalInventory, requestRestock } from '@/lib/firestore-helpers';
import { MedicalInventoryItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pill, AlertTriangle, CheckCircle, Search } from 'lucide-react';

export default function MedicalDashboard() {
  const [inventory, setInventory] = useState<MedicalInventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<MedicalInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, categoryFilter]);

  const loadInventory = async () => {
    try {
      const items = await getMedicalInventory();
      setInventory(items);
    } catch (error) {
      console.error('Error loading medical inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInventory = () => {
    let filtered = inventory;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredInventory(filtered);
  };

  const handleRequestRestock = async (itemId: string) => {
    try {
      await requestRestock(itemId);
      await loadInventory();
    } catch (error) {
      console.error('Error requesting restock:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'Low':
        return <Badge className="bg-yellow-100 text-yellow-800">Low</Badge>;
      case 'OK':
        return <Badge className="bg-green-100 text-green-800">OK</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const categories = Array.from(new Set(inventory.map(item => item.category)));
  const criticalItems = inventory.filter(item => item.status === 'Critical');
  const lowStockItems = inventory.filter(item => item.status === 'Low');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading medication stock...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Medication Stock Management</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage pharmaceutical inventory
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Stock</CardTitle>
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search medications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Medication Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle>Medication Inventory</CardTitle>
          <CardDescription>
            {filteredInventory.length} items {searchTerm || categoryFilter !== 'all' ? '(filtered)' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredInventory.length === 0 ? (
            <div className="text-center py-12">
              <Pill className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Items Found</h3>
              <p className="text-muted-foreground">
                {inventory.length === 0
                  ? 'No medication inventory found. Add items in Firestore to see them here.'
                  : 'No items match your search criteria. Try adjusting your filters.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Medication Name</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-right p-3">Current Stock</th>
                    <th className="text-right p-3">Min Required</th>
                    <th className="text-center p-3">Status</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{item.name}</td>
                      <td className="p-3 text-muted-foreground capitalize">{item.type.replace('_', ' ')}</td>
                      <td className="p-3 text-muted-foreground">{item.category}</td>
                      <td className="text-right p-3">
                        <span className={item.status === 'Critical' || item.status === 'Low' ? 'text-red-600 font-bold' : ''}>
                          {item.current_stock} {item.unit}
                        </span>
                      </td>
                      <td className="text-right p-3">{item.min_required} {item.unit}</td>
                      <td className="text-center p-3">{getStatusBadge(item.status)}</td>
                      <td className="text-right p-3">
                        {(item.status === 'Critical' || item.status === 'Low') && !item.restock_requested ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRequestRestock(item.id)}
                          >
                            Request Restock
                          </Button>
                        ) : item.restock_requested ? (
                          <Badge variant="outline" className="bg-blue-50">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Requested
                          </Badge>
                        ) : null}
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
