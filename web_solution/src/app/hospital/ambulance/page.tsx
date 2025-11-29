"use client";

import { useEffect, useState } from 'react';
import { subscribeToActiveAmbulances } from '@/lib/firestore-helpers';
import { Ambulance } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ambulance as AmbulanceIcon, MapPin, Navigation, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AmbulancePage() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time ambulance updates
    const unsubscribe = subscribeToActiveAmbulances((updatedAmbulances) => {
      setAmbulances(updatedAmbulances);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_route':
        return <Badge className="bg-blue-100 text-blue-800">En Route</Badge>;
      case 'arrived':
        return <Badge className="bg-green-100 text-green-800">Arrived</Badge>;
      case 'idle':
        return <Badge variant="outline">Idle</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ambulance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ambulance Tracking</h1>
        <p className="text-muted-foreground mt-2">
          Real-time tracking of ambulances en route to the hospital
        </p>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ambulances</CardTitle>
            <AmbulanceIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{ambulances.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Ambulance List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Routes</CardTitle>
          <CardDescription>
            Ambulances currently en route to the hospital (updates in real-time)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ambulances.length === 0 ? (
            <div className="text-center py-12">
              <AmbulanceIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Ambulances</h3>
              <p className="text-muted-foreground mb-4">
                No ambulances are currently en route to the hospital.
              </p>
              <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg max-w-md mx-auto">
                <p className="font-semibold mb-2">How it works:</p>
                <p>
                  When a mobile app user (ambulance driver or patient) starts a route to the hospital,
                  it will appear here in real-time. The mobile app writes to Firebase, and this dashboard
                  updates automatically.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {ambulances.map((ambulance) => (
                <div
                  key={ambulance.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-1">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <AmbulanceIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">Ambulance {ambulance.id}</h4>
                        {ambulance.driver_name && (
                          <p className="text-sm text-muted-foreground">
                            Driver: {ambulance.driver_name}
                          </p>
                        )}
                      </div>
                      {getStatusBadge(ambulance.status)}
                    </div>

                    <div className="space-y-2">
                      {ambulance.source_name && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">From</p>
                            <p className="text-sm text-muted-foreground">{ambulance.source_name}</p>
                          </div>
                        </div>
                      )}

                      {ambulance.destination_name && (
                        <div className="flex items-start gap-2">
                          <Navigation className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">To</p>
                            <p className="text-sm text-muted-foreground">{ambulance.destination_name}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                        <Clock className="h-3 w-3" />
                        <span>
                          Last updated {formatDistanceToNow(new Date(ambulance.updated_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">Prototype Feature</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 dark:text-blue-200">
          <p className="mb-2">
            This is a live tracking prototype. When a mobile app (used by ambulance drivers or patients)
            updates an ambulance's route in Firebase, this dashboard reflects the changes in real-time.
          </p>
          <p>
            <strong>To test:</strong> In Firebase Console, create or update a document in the <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">ambulances</code> collection
            with fields: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">status: "en_route"</code>,{' '}
            <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">source_name</code>, and{' '}
            <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">destination_name</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
