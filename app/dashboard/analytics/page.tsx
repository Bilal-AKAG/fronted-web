"use client"

import { predictions, telemetryHistory, vehicles, trips } from "@/lib/mock-data"
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
  IconChartLine,
  IconCalculator,
} from "@tabler/icons-react"

const vehicleIds = vehicles.map((v) => v.vehicleId)
const colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)"]

const consumptionByHour: Record<string, { hour: string; [key: string]: number | string }[]> = {}
for (const vId of vehicleIds) {
  const data = telemetryHistory
    .filter((t) => t.vehicleId === vId)
    .filter((_, i) => i % 12 === 0)
    .map((t) => ({
      hour: new Date(t.timestamp).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit" }),
      fuel: t.fuelLevelLiters,
    }))
  consumptionByHour[vId] = data
}

const consumptionConfig: Record<string, { label: string; color: string }> = {}
for (const vId of vehicleIds) {
  consumptionConfig[vId] = { label: vehicles.find((v) => v.vehicleId === vId)!.label, color: colors[vehicleIds.indexOf(vId)] }
}

const mergedConsumption = consumptionByHour[vehicleIds[0]]?.map((d, i) => {
  const row: Record<string, string | number> = { hour: d.hour }
  for (const vId of vehicleIds) {
    row[vId] = consumptionByHour[vId]?.[i]?.fuel ?? 0
  }
  return row
}) ?? []

const distanceByVehicle = vehicleIds.map((vId) => ({
  vehicle: vehicles.find((v) => v.vehicleId === vId)!.label,
  distance: trips.filter((t) => t.vehicleId === vId).reduce((s, t) => s + t.distanceKm, 0),
  fuel: trips.filter((t) => t.vehicleId === vId).reduce((s, t) => s + t.fuelUsedLiters, 0),
}))

const distanceConfig: Record<string, { label: string; color: string }> = {
  distance: { label: "Distance", color: "var(--color-chart-1)" },
  fuel: { label: "Fuel Used", color: "var(--color-chart-2)" },
}

const avgFuelConsumption =
  trips.length > 0
    ? (trips.reduce((s, t) => s + t.fuelUsedLiters, 0) / trips.reduce((s, t) => s + t.distanceKm, 0) * 100).toFixed(1)
    : "0"

const totalDistance = trips.reduce((s, t) => s + t.distanceKm, 0).toFixed(0)
const totalFuelUsed = trips.reduce((s, t) => s + t.fuelUsedLiters, 0).toFixed(1)
const highConfidencePredictions = predictions.filter((p) => p.confidence > 0.75)

const forecastConfig: Record<string, { label: string; color: string }> = {
  forecast: { label: "Forecast (L)", color: "var(--color-chart-1)" },
  confidence: { label: "Confidence", color: "var(--color-chart-3)" },
}

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Fuel consumption insights, forecasts, and anomaly detection
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconChartLine className="size-4" />
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
              High Conf. Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">{highConfidencePredictions.length}</p>
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
            <CardTitle className="text-sm">Fuel Forecast & Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={forecastConfig} className="aspect-[2/1] max-h-60 w-full">
              <BarChart data={predictions.filter((p) => p.type === "FUEL_FORECAST").map((p) => ({
                label: vehicles.find((v) => v.vehicleId === p.vehicleId)?.label ?? p.vehicleId,
                forecast: p.value,
                confidence: Math.round(p.confidence * 100),
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="forecast" fill="var(--color-chart-1)" radius={4} name="Forecast (L)" />
                <Bar dataKey="confidence" fill="var(--color-chart-3)" radius={4} name="Confidence (%)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="font-heading mb-3 font-semibold">Anomaly Detection</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {predictions
            .filter((p) => p.type === "ANOMALY_SCORE")
            .map((p) => {
              const vehicle = vehicles.find((v) => v.vehicleId === p.vehicleId)
              const isAnomalous = p.value > 70
              return (
                <Card key={p.predictionId}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs text-muted-foreground">
                        {vehicle?.label}
                      </CardTitle>
                      <Badge variant={isAnomalous ? "destructive" : "default"} className="text-[10px]">
                        {isAnomalous ? "Anomalous" : "Normal"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-bold">{p.value.toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">
                      Anomaly score &middot; {(p.confidence * 100).toFixed(0)}% confidence
                    </p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${p.value}%`,
                          backgroundColor: isAnomalous ? "var(--destructive)" : "var(--color-chart-2)",
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Fuel Forecast Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {predictions
              .filter((p) => p.type === "FUEL_FORECAST")
              .map((p) => {
                const vehicle = vehicles.find((v) => v.vehicleId === p.vehicleId)
                return (
                  <div key={p.predictionId} className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">{vehicle?.label}</p>
                    <p className="font-heading text-3xl font-bold">{p.value.toFixed(1)}L</p>
                    <p className="text-xs text-muted-foreground">
                      Estimated remaining fuel &middot; {(p.confidence * 100).toFixed(0)}% confidence
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <IconTrendingUp className="size-3" />
                      <span>
                        Generated{" "}
                        {new Date(p.generatedAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
