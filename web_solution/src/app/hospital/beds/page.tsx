"use client";

import { useEffect, useState } from 'react';
import { getWards, subscribeToWards } from '@/lib/firestore-helpers';
import { Ward } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export default function BedsPage() {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToWards((updatedWards) => {
      setWards(updatedWards);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getOccupancyPercentage = (ward: Ward) => {
    return Math.round((ward.occupied_beds / ward.total_beds) * 100);
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return '#ef4444'; // red
    if (percentage >= 75) return '#f59e0b'; // orange
    if (percentage >= 50) return '#eab308'; // yellow
    return '#10b981'; // green
  };

  const totalBeds = wards.reduce((sum, ward) => sum + ward.total_beds, 0);
  const totalOccupied = wards.reduce((sum, ward) => sum + ward.occupied_beds, 0);
  const totalFree = totalBeds - totalOccupied;
  const overallOccupancy = totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ward data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bed & Ward Overview</h1>
        <p className="text-muted-foreground mt-2">
          Real-time bed occupancy and ward status
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBeds}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Activity className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalOccupied}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Bed className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalFree}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallOccupancy}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Occupancy Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Ward Occupancy</CardTitle>
          <CardDescription>Bed occupancy by ward</CardDescription>
        </CardHeader>
        <CardContent>
          {wards.length === 0 ? (
            <div className="text-center py-12">
              <Bed className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Ward Data</h3>
              <p className="text-muted-foreground">
                No wards found. Add ward data in Firestore to see occupancy information.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={wards}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="occupied_beds" fill="#ef4444" name="Occupied" />
                <Bar dataKey="free_beds" fill="#10b981" name="Free" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Ward Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ward Details</CardTitle>
          <CardDescription>Detailed bed information by ward</CardDescription>
        </CardHeader>
        <CardContent>
          {wards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No ward data available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Ward Name</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-right p-3">Total Beds</th>
                    <th className="text-right p-3">Occupied</th>
                    <th className="text-right p-3">Free</th>
                    <th className="text-center p-3">Occupancy</th>
                  </tr>
                </thead>
                <tbody>
                  {wards.map((ward) => {
                    const occupancyPct = getOccupancyPercentage(ward);
                    return (
                      <tr key={ward.id} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{ward.name}</td>
                        <td className="p-3 text-muted-foreground">{ward.type}</td>
                        <td className="text-right p-3">{ward.total_beds}</td>
                        <td className="text-right p-3 font-semibold text-red-600">{ward.occupied_beds}</td>
                        <td className="text-right p-3 font-semibold text-green-600">{ward.free_beds}</td>
                        <td className="text-center p-3">
                          <Badge
                            className={
                              occupancyPct >= 90
                                ? 'bg-red-100 text-red-800'
                                : occupancyPct >= 75
                                ? 'bg-orange-100 text-orange-800'
                                : occupancyPct >= 50
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }
                          >
                            {occupancyPct}%
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
