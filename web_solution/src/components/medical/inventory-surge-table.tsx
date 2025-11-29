"use client"

import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { MedicalInventoryItem, SurgeForecast } from '@/lib/types'
import { findInventoryShortages, type InventoryShortage } from '@/lib/api/api-mappers'
import { AlertTriangle, Package, TrendingUp } from 'lucide-react'

export function InventorySurgeTable() {
  const [inventory, setInventory] = useState<MedicalInventoryItem[]>([])
  const [forecast, setForecast] = useState<SurgeForecast | null>(null)
  const [shortages, setShortages] = useState<InventoryShortage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Subscribe to medical inventory
    const inventoryQuery = query(collection(db, 'medical_inventory'))
    const unsubInventory = onSnapshot(inventoryQuery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MedicalInventoryItem))
      
      setInventory(items)
    })

    // Load latest surge forecast for Mumbai (or current city)
    const city = 'Mumbai'
    const date = new Date().toISOString().split('T')[0]
    const forecastPath = `surge_forecasts/${city}_${date}`
    
    const forecastQuery = query(collection(db, 'surge_forecasts'))
    const unsubForecast = onSnapshot(forecastQuery, (snapshot) => {
      if (!snapshot.empty) {
        const latestDoc = snapshot.docs[0]
        setForecast({ id: latestDoc.id, ...latestDoc.data() } as any)
      }
      setLoading(false)
    })

    return () => {
      unsubInventory()
      unsubForecast()
    }
  }, [])

  // Calculate shortages when forecast or inventory changes
  useEffect(() => {
    if (forecast && inventory.length > 0) {
      const calculatedShortages = findInventoryShortages(
        forecast.diseases,
        inventory.map(item => ({
          name: item.name,
          current_stock: item.current_stock
        }))
      )
      setShortages(calculatedShortages)
    }
  }, [forecast, inventory])

  const getStatusBadge = (item: MedicalInventoryItem, shortage?: InventoryShortage) => {
    if (shortage) {
      return <Badge variant="destructive">SHORT</Badge>
    }
    return <Badge variant={item.status === 'OK' ? 'default' : item.status === 'Low' ? 'secondary' : 'destructive'}>
      {item.status}
    </Badge>
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading inventory...</div>
  }

  const itemsWithShortages = inventory.map(item => {
    const shortage = shortages.find(s => s.item_name === item.name)
    return { ...item, shortage }
  })

  return (
    <div className="space-y-4">
      {forecast && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Surge-Aware Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm">
              <Badge className={`${forecast.ui_risk_level === 'Critical' || forecast.ui_risk_level === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                {forecast.ui_risk_level} Risk
              </Badge>
              <span className="text-muted-foreground">
                {forecast.total_surges_detected} surge(s) detected for {forecast.city}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inventory vs. Predicted Needs</CardTitle>
            {shortages.length > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {shortages.length} Shortage(s)
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Item</th>
                  <th className="text-right p-2">Current Stock</th>
                  <th className="text-right p-2">Min Required</th>
                  <th className="text-right p-2">Predicted Need</th>
                  <th className="text-right p-2">Shortage</th>
                  <th className="text-center p-2">Status</th>
                  <th className="text-left p-2">Disease Link</th>
                </tr>
              </thead>
              <tbody>
                {itemsWithShortages.map((item) => (
                  <tr key={item.id} className={`border-b hover:bg-muted/50 ${item.shortage ? 'bg-red-50 dark:bg-red-950/20' : ''}`}>
                    <td className="p-2 font-medium flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {item.name}
                    </td>
                    <td className="text-right p-2">{item.current_stock} {item.unit}</td>
                    <td className="text-right p-2 text-muted-foreground">{item.min_required}</td>
                    <td className="text-right p-2">
                      {item.shortage ? (
                        <span className="font-semibold text-orange-600">{item.shortage.predicted_need}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="text-right p-2">
                      {item.shortage ? (
                        <span className="font-semibold text-red-600">-{item.shortage.shortage}</span>
                      ) : (
                        <span className="text-green-600">✓</span>
                      )}
                    </td>
                    <td className="text-center p-2">
                      {getStatusBadge(item, item.shortage)}
                    </td>
                    <td className="text-left p-2 text-sm text-muted-foreground">
                      {item.shortage ? item.shortage.disease : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
