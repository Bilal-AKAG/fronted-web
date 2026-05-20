"use client"

import { useState } from "react"
import { trips, telemetryHistory, vehicles } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, Bar, BarChart } from "recharts"
import { IconTruck, IconGasStation, IconSpeedboat } from "@tabler/icons-react"

const colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)"]
const vehicleIds = vehicles.map((v) => v.vehicleId)

const fuelConfig: Record<string, { label: string; color: string }> = {}
const fuelDataMap: Record<string, { time: string; fuel: number }[]> = {}
for (const vId of vehicleIds) {
  fuelConfig[vId] = { label: vehicles.find((v) => v.vehicleId === vId)!.label, color: colors[vehicleIds.indexOf(vId)] }
  fuelDataMap[vId] = telemetryHistory
    .filter((t) => t.vehicleId === vId)
    .map((t) => ({
      time: new Date(t.receivedAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit" }),
      fuel: t.fuelLiters,
    }))
}

const maxFuelLen = Math.max(...Object.values(fuelDataMap).map((d) => d.length))
const fuelChartData = Array.from({ length: Math.min(maxFuelLen, 48) }, (_, i) => {
  const row: Record<string, string | number> = { time: fuelDataMap[vehicleIds[0]][i]?.time ?? "" }
  for (const vId of vehicleIds) {
    row[vId] = fuelDataMap[vId]?.[i]?.fuel ?? 0
  }
  return row
})

const tripConfig: Record<string, { label: string; color: string }> = {}
for (const v of vehicles) {
  tripConfig[v.vehicleId] = { label: v.label, color: colors[vehicleIds.indexOf(v.vehicleId)] }
}

const tripDistanceData = trips
  .filter((t) => t.distanceKm !== null)
  .map((t) => ({
    trip: t.tripId.replace("TRP-", "T"),
    [t.vehicleId]: t.distanceKm,
  }))

export default function HistoryPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)

  const filteredTrips = selectedVehicle
    ? trips.filter((t) => t.vehicleId === selectedVehicle)
    : trips

  const totalDistance = filteredTrips.reduce((s, t) => s + (t.distanceKm ?? 0), 0)
  const totalFuel = filteredTrips.reduce((s, t) => s + (t.fuelUsedLiters ?? 0), 0)
  const avgSpeed =
    filteredTrips.length > 0
      ? filteredTrips.reduce((s, t) => s + (t.avgSpeedKmh ?? 0), 0) / filteredTrips.filter((t) => t.avgSpeedKmh !== null).length
      : 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-bold">History</h1>
        <p className="text-sm text-muted-foreground">Trip history and telemetry timeline</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={selectedVehicle === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedVehicle(null)}
        >
          All Vehicles
        </Button>
        {vehicleIds.map((vId) => (
          <Button
            key={vId}
            variant={selectedVehicle === vId ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedVehicle(vId)}
          >
            {vehicles.find((v) => v.vehicleId === vId)?.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconTruck className="size-4" />
              Total Distance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">{totalDistance.toFixed(1)} km</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconGasStation className="size-4" />
              Total Fuel Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">{totalFuel.toFixed(1)} L</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconSpeedboat className="size-4" />
              Avg Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">{avgSpeed.toFixed(1)} km/h</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Fuel Level History (48h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={fuelConfig} className="aspect-[3/1] max-h-72 w-full">
            <LineChart data={fuelChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" tick={{ fontSize: 9 }} interval={3} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}L`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {vehicleIds.map((vId) => (
                <Line
                  key={vId}
                  type="monotone"
                  dataKey={vId}
                  stroke={fuelConfig[vId].color}
                  strokeWidth={2}
                  dot={false}
                  name={fuelConfig[vId].label}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Trip Distance</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={tripConfig} className="aspect-[3/1] max-h-64 w-full">
            <BarChart data={tripDistanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="trip" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}km`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {vehicleIds.map((vId) => (
                <Bar key={vId} dataKey={vId} fill={tripConfig[vId].color} name={tripConfig[vId].label} radius={4} />
              ))}
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-heading mb-3 font-semibold">Trips</h2>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell">Trip ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Start</TableHead>
                <TableHead className="hidden sm:table-cell">End</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Fuel Used</TableHead>
                <TableHead className="hidden sm:table-cell">Avg Speed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrips.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    No trips found
                  </TableCell>
                </TableRow>
              )}
              {filteredTrips.map((t) => (
                <TableRow key={t.tripId}>
                  <TableCell className="hidden font-mono text-xs md:table-cell">{t.tripId}</TableCell>
                  <TableCell>
                    {vehicles.find((v) => v.vehicleId === t.vehicleId)?.label ?? t.vehicleId}
                  </TableCell>
                  <TableCell>{t.driver?.fullName ?? "-"}</TableCell>
                  <TableCell className="text-xs">
                    {new Date(t.startTime).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="hidden text-xs sm:table-cell">
                    {t.endTime
                      ? new Date(t.endTime).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>{t.distanceKm ? `${t.distanceKm.toFixed(1)} km` : "-"}</TableCell>
                  <TableCell>{t.fuelUsedLiters ? `${t.fuelUsedLiters.toFixed(1)} L` : "-"}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {t.avgSpeedKmh ? `${t.avgSpeedKmh.toFixed(1)} km/h` : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}