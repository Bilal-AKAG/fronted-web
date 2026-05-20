"use client"

import { SummaryCards } from "@/components/dashboard/summary-cards"
import { VehicleCards } from "@/components/dashboard/vehicle-cards"
import { FuelLevelChart } from "@/components/dashboard/fuel-level-chart"
import { SpeedChart } from "@/components/dashboard/speed-chart"
import { ConsumptionChart } from "@/components/dashboard/consumption-chart"
import { AlertDistribution } from "@/components/dashboard/alert-distribution"
import { AlertsTable } from "@/components/dashboard/alerts-table"
import { TripsTable } from "@/components/dashboard/trips-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-bold">Fleet Dashboard</h1>
        <p className="text-sm text-muted-foreground">Real-time overview of your fleet</p>
      </div>

      <SummaryCards />
      <VehicleCards />

      <div className="grid gap-4 lg:grid-cols-2">
        <FuelLevelChart />
        <SpeedChart />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ConsumptionChart />
        <AlertDistribution />
      </div>

      <Tabs defaultValue="alerts">
        <TabsList>
          <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
          <TabsTrigger value="trips">Recent Trips</TabsTrigger>
        </TabsList>
        <TabsContent value="alerts" className="pt-2">
          <AlertsTable />
        </TabsContent>
        <TabsContent value="trips" className="pt-2">
          <TripsTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
