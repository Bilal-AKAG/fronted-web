"use client"

import { telemetryHistory, vehicles, trips, alerts } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Bar,
  BarChart,
  Area,
  AreaChart,
} from "recharts"
import {
  IconTrendingUp,
  IconAlertTriangle,
  IconCalculator,
  IconRoute,
} from "@tabler/icons-react"

const vehicleIds = vehicles.map((v) => v.vehicleId)
const colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)"]

const consumptionByHour: Record<string, { hour: string; fuel: number }[]> = {}
for (const vId of vehicleIds) {
  const data = telemetryHistory
    .filter((t) => t.vehicleId === vId)
    .filter((_, i) => i % 12 === 0)
    .map((t) => ({
      hour: new Date(t.receivedAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit" }),
      fuel: t.fuelLiters,
    }))
  consumptionByHour[vId] = data
}

const consumptionConfig: Record<string, { label: string; color: string }> = {}
for (const vId of vehicleIds) {
  consumptionConfig[vId] = { label: vehicles.find((v) => v.vehicleId === vId)!.label, color: colors[vehicleIds.indexOf(vId)] }
}

const maxConsumptionLen = Math.max(...Object.values(consumptionByHour).map((d) => d.length))
const mergedConsumption = Array.from({ length: Math.min(maxConsumptionLen, 48) }, (_, i) => {
  const row: Record<string, string | number> = { hour: consumptionByHour[vehicleIds[0]][i]?.hour ?? "" }
  for (const vId of vehicleIds) {
    row[vId] = consumptionByHour[vId]?.[i]?.fuel ?? 0
  }
  return row
})

const distanceByVehicle = vehicleIds.map((vId) => {
  const vehicleTrips = trips.filter((t) => t.vehicleId === vId)
  return {
    vehicle: vehicles.find((v) => v.vehicleId === vId)!.label,
    distance: vehicleTrips.reduce((s, t) => s + (t.distanceKm ?? 0), 0),
    fuel: vehicleTrips.reduce((s, t) => s + (t.fuelUsedLiters ?? 0), 0),
  }
})

const distanceConfig: Record<string, { label: string; color: string }> = {
  distance: { label: "Distance", color: "var(--color-chart-1)" },
  fuel: { label: "Fuel Used", color: "var(--color-chart-2)" },
}

const totalFuelUsedTrips = trips.filter((t) => t.fuelUsedLiters !== null)
const totalDistanceTrips = trips.filter((t) => t.distanceKm !== null)
const avgFuelConsumption =
  totalDistanceTrips.length > 0
    ? (
        totalFuelUsedTrips.reduce((s, t) => s + (t.fuelUsedLiters ?? 0), 0) /
        totalDistanceTrips.reduce((s, t) => s + (t.distanceKm ?? 0), 0) *
        100
      ).toFixed(1)
    : "0"

const totalDistance = totalDistanceTrips.reduce((s, t) => s + (t.distanceKm ?? 0), 0).toFixed(0)
const totalFuelUsed = totalFuelUsedTrips.reduce((s, t) => s + (t.fuelUsedLiters ?? 0), 0).toFixed(1)

const openAlerts = alerts.filter((a) => a.status === "open")
const criticalAlerts = openAlerts.filter((a) => a.severity === "critical")

const vehicleEfficiency = vehicleIds.map((vId) => {
  const vehicleTrips = trips.filter((t) => t.vehicleId === vId && t.fuelUsedLiters !== null && t.distanceKm !== null)
  const totalFuel = vehicleTrips.reduce((s, t) => s + (t.fuelUsedLiters ?? 0), 0)
  const totalDist = vehicleTrips.reduce((s, t) => s + (t.distanceKm ?? 0), 0)
  const efficiency = totalDist > 0 ? (totalFuel / totalDist) * 100 : 0
  return {
    vehicle: vehicles.find((v) => v.vehicleId === vId)!.label,
    efficiency: parseFloat(efficiency.toFixed(1)),
  }
})

const efficiencyConfig: Record<string, { label: string; color: string }> = {
  efficiency: { label: "L/100km", color: "var(--color-chart-4)" },
}

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Fuel consumption insights and fleet performance metrics
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconRoute className="size-4" />
              Total Distance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">{totalDistance} km</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconCalculator className="size-4" />
              Total Fuel Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">{totalFuelUsed} L</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconTrendingUp className="size-4" />
              Avg Consumption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">{avgFuelConsumption} L/100km</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconAlertTriangle className="size-4" />
              Open Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">
              {openAlerts.length}
              {criticalAlerts.length > 0 && (
                <span className="text-destructive"> ({criticalAlerts.length} critical)</span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Fuel Level Trends (48h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={consumptionConfig} className="aspect-[3/1] max-h-72 w-full">
            <AreaChart data={mergedConsumption}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="hour" tick={{ fontSize: 9 }} interval={3} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}L`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {vehicleIds.map((vId) => (
                <Area
                  key={vId}
                  type="monotone"
                  dataKey={vId}
                  stroke={consumptionConfig[vId].color}
                  fill={consumptionConfig[vId].color}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={false}
                  name={consumptionConfig[vId].label}
                />
              ))}
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Distance & Fuel by Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={distanceConfig} className="aspect-[2/1] max-h-60 w-full">
              <BarChart data={distanceByVehicle}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="vehicle" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="distance" fill="var(--color-chart-1)" radius={4} name="Distance (km)" />
                <Bar dataKey="fuel" fill="var(--color-chart-2)" radius={4} name="Fuel Used (L)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Fuel Efficiency by Vehicle (L/100km)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={efficiencyConfig} className="aspect-[2/1] max-h-60 w-full">
              <BarChart data={vehicleEfficiency}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="vehicle" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="efficiency" fill="var(--color-chart-4)" radius={4} name="L/100km" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="font-heading mb-3 font-semibold">Open Alerts by Vehicle</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => {
            const vehicleAlerts = openAlerts.filter((a) => a.vehicleId === v.vehicleId)
            const critical = vehicleAlerts.filter((a) => a.severity === "critical").length
            const warning = vehicleAlerts.filter((a) => a.severity === "warning").length
            const info = vehicleAlerts.filter((a) => a.severity === "info").length
            return (
              <Card key={v.vehicleId}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs text-muted-foreground">{v.label}</CardTitle>
                    <Badge
                      variant={critical > 0 ? "destructive" : warning > 0 ? "secondary" : "outline"}
                      className="text-[10px]"
                    >
                      {vehicleAlerts.length} alerts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-xs">
                    {critical > 0 && (
                      <span className="text-destructive">
                        <strong>{critical}</strong> critical
                      </span>
                    )}
                    {warning > 0 && (
                      <span className="text-warning">
                        <strong>{warning}</strong> warning
                      </span>
                    )}
                    {info > 0 && (
                      <span className="text-muted-foreground">
                        <strong>{info}</strong> info
                      </span>
                    )}
                    {vehicleAlerts.length === 0 && (
                      <span className="text-muted-foreground">No open alerts</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}