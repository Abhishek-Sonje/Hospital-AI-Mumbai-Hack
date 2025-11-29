"use client";

import { useEffect, useState } from 'react';
import { getAlerts, acknowledgeAlert, subscribeToAlerts } from '@/lib/firestore-helpers';
import { Alert as AlertType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time alerts
    const unsubscribe = subscribeToAlerts((updatedAlerts) => {
      setAlerts(updatedAlerts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAcknowledge = async (alertId: string) => {
    try {
      await acknowledgeAlert(alertId);
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <Badge variant="destructive">Critical</Badge>;
      case 'HIGH':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'MEDIUM':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'LOW':
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'MEDIUM':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'LOW':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const activeAlerts = alerts.filter(a => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter(a => a.acknowledged);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alerts & Advisories</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage system alerts and public advisories
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activeAlerts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{acknowledgedAlerts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>Alerts requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          {activeAlerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Alerts</h3>
              <p className="text-muted-foreground">
                All alerts have been acknowledged. Great job!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-1">{getRiskIcon(alert.risk_level)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getRiskBadge(alert.risk_level)}
                        <Badge variant="outline" className="capitalize">
                          {alert.target}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{alert.message}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAcknowledge(alert.id)}
                    >
                      Acknowledge
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acknowledged Alerts */}
      {acknowledgedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Acknowledged Alerts</CardTitle>
            <CardDescription>Previously acknowledged alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {acknowledgedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-3 border rounded-lg bg-muted/30 opacity-75"
                >
                  <div className="mt-1">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium">{alert.title}</h4>
                      <div className="flex items-center gap-2">
                        {getRiskBadge(alert.risk_level)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Acknowledged {alert.acknowledged_at && formatDistanceToNow(new Date(alert.acknowledged_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {alerts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Alerts</h3>
            <p className="text-muted-foreground text-center">
              No alerts found. Add alerts in Firestore to see them here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
