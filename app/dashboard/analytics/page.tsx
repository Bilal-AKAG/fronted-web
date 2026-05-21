"use client"

import { useState } from "react"
import { useVehicles, useVehicleHistory } from "@/hooks/use-vehicles"
import { useAllTrips } from "@/hooks/use-trips"
import { useAlerts } from "@/hooks/use-alerts"
import { useDevices } from "@/hooks/use-devices"
import { useLiveState } from "@/lib/store/live-state"
import { FuelLevelChart } from "@/components/dashboard/fuel-level-chart"
import { SpeedChart } from "@/components/dashboard/speed-chart"
import { TemperatureChart } from "@/components/dashboard/temperature-chart"
import { FleetBarChart } from "@/components/dashboard/fleet-bar-chart"
import { TripDistanceChart } from "@/components/dashboard/trip-distance-chart"
import { AlertDistributionChart } from "@/components/dashboard/alert-distribution-chart"
import { IconChartBar, IconTruck, IconBell, IconDeviceDesktop, IconTemperature } from "@tabler/icons-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AnalyticsPage() {
  const { data: vehiclesData, isLoading: vehiclesLoading } = useVehicles()
  const { data: alertsData, isLoading: alertsLoading } = useAlerts()
  const { data: devicesData, isLoading: devicesLoading } = useDevices()
  const { trips, isLoading: tripsLoading } = useAllTrips({ limit: 100 })
  const liveStates = useLiveState((s) => s.vehicleStates)
  const deviceChanges = useLiveState((s) => s.deviceStatusChanges)

  const vehicles = vehiclesData?.vehicles ?? []
  const alerts = alertsData?.alerts ?? []
  const devices = devicesData?.devices ?? []

  const [selectedChartVehicleId, setSelectedChartVehicleId] = useState<string>("")
  const chartVehicleId = selectedChartVehicleId || vehicles[0]?.vehicleId || ""
  const selectedVehicle = vehicles.find((v) => v.vehicleId === chartVehicleId)

  const { data: historyData, isLoading: historyLoading } = useVehicleHistory(chartVehicleId, { limit: 96 })
  const historyRecords = historyData?.records ?? []

  const fuelChartData = historyRecords.map((r) => ({
    time: new Date(r.receivedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    fuel: r.fuelPercent,
  }))

  const speedChartData = historyRecords.map((r) => ({
    time: new Date(r.receivedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    speed: r.speedKmh,
  }))

  const tempChartData = historyRecords.map((r) => ({
    time: new Date(r.receivedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    temp: r.tempCelsius,
  }))

  const deviceStatusMap: Record<string, string> = {}
  for (const change of deviceChanges) {
    if (change.newStatus) deviceStatusMap[change.deviceId] = change.newStatus
  }

  const vehicleStates = vehicles.map((v) => {
    const live = liveStates[v.vehicleId]
    return {
      id: v.vehicleId,
      label: v.label,
      plateNumber: v.plateNumber,
      fuelPercent: live?.fuelPercent ?? v.currentState?.fuelPercent ?? 0,
      fuelLiters: live?.fuelLiters ?? v.currentState?.fuelLiters ?? 0,
      engineOn: live?.engineOn ?? v.currentState?.engineOn ?? false,
      speedKmh: live?.speedKmh ?? v.currentState?.speedKmh ?? 0,
      tempCelsius: live?.tempCelsius ?? v.currentState?.tempCelsius ?? 0,
      deviceStatus: deviceStatusMap[v.assignedDevice?.deviceId ?? ""] ?? v.assignedDevice?.status ?? live?.deviceStatus ?? "offline",
    }
  })

  const fleetFuelData = vehicleStates.map((v) => ({ label: v.label, value: v.fuelPercent }))
  const fleetSpeedData = vehicleStates.map((v) => ({ label: v.label, value: v.speedKmh }))

  const alertCounts = { critical: 0, warning: 0, info: 0 }
  for (const alert of alerts) {
    if (alert.status === "open") {
      const sev = alert.severity as keyof typeof alertCounts
      if (sev in alertCounts) alertCounts[sev]++
    }
  }
  const alertSeverityData = Object.entries(alertCounts)
    .filter(([, count]) => count > 0)
    .map(([severity, count]) => ({ severity, count }))

  const totalFuel = vehicleStates.reduce((s, v) => s + v.fuelLiters, 0)
  const avgFuelPct =
    vehicleStates.length > 0
      ? Math.round(vehicleStates.reduce((s, v) => s + v.fuelPercent, 0) / vehicleStates.length)
      : 0
  const runningVehicles = vehicleStates.filter((v) => v.engineOn).length
  const avgTemp =
    vehicleStates.length > 0
      ? (vehicleStates.reduce((s, v) => s + v.tempCelsius, 0) / vehicleStates.length).toFixed(1)
      : "—"

  const devicesOnline = devices.filter((d) => d.status === "online").length
  const devicesStale = devices.filter((d) => d.status === "stale").length
  const devicesOffline = devices.filter((d) => d.status === "offline").length

  const tripDistanceByVehicle: Record<string, number> = {}
  const fuelUsedByVehicle: Record<string, number> = {}
  for (const trip of trips) {
    const label =
      vehicles.find((v) => v.vehicleId === trip.vehicleId)?.label ?? trip.vehicleId
    tripDistanceByVehicle[label] = (tripDistanceByVehicle[label] ?? 0) + (trip.distanceKm ?? 0)
    fuelUsedByVehicle[label] = (fuelUsedByVehicle[label] ?? 0) + (trip.fuelUsedLiters ?? 0)
  }
  const tripDistanceData = Object.entries(tripDistanceByVehicle)
    .map(([vehicle, distanceKm]) => ({ vehicle, distanceKm: Math.round(distanceKm) }))
    .sort((a, b) => b.distanceKm - a.distanceKm)

  const fuelUsedData = Object.entries(fuelUsedByVehicle)
    .map(([label, value]) => ({ label, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value)

  const getFuelBarColor = (value: number) =>
    value < 15 ? "var(--color-chart-5)" : value < 30 ? "var(--color-chart-4)" : "var(--color-chart-1)"

  const loading = vehiclesLoading || alertsLoading || devicesLoading || tripsLoading

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Fuel consumption insights and fleet performance metrics</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
      ) : vehicles.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">No data available.</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              icon={<IconChartBar className="size-5" />}
              label="Fleet Avg Fuel"
              value={`${avgFuelPct}%`}
              sub={`${totalFuel.toFixed(1)}L total`}
            />
            <StatCard
              icon={<IconTruck className="size-5" />}
              label="Engines Running"
              value={`${runningVehicles}/${vehicles.length}`}
              sub={runningVehicles > 0 ? `${Math.round((runningVehicles / vehicles.length) * 100)}% active` : "All parked"}
            />
            <StatCard
              icon={<IconTemperature className="size-5" />}
              label="Avg Temperature"
              value={`${avgTemp}°C`}
            />
            <StatCard
              icon={<IconBell className="size-5" />}
              label="Open Alerts"
              value={String(alertCounts.critical + alertCounts.warning + alertCounts.info)}
              sub={`${alertCounts.critical} critical`}
            />
            <StatCard
              icon={<IconDeviceDesktop className="size-5" />}
              label="Devices Online"
              value={`${devicesOnline}/${devices.length}`}
              sub={`${devicesStale} stale, ${devicesOffline} offline`}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <FleetBarChart
              title="Fleet Fuel Levels"
              data={fleetFuelData}
              dataKey="value"
              unit="%"
              domain={[0, 100]}
              cellColors
              getBarColor={getFuelBarColor}
            />
            <FleetBarChart
              title="Fleet Current Speed"
              data={fleetSpeedData}
              dataKey="value"
              unit=" km/h"
              color="var(--color-chart-4)"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <AlertDistributionChart data={alertSeverityData} isLoading={alertsLoading} />
            <div className="rounded-lg border p-4">
              <h2 className="mb-4 font-heading text-sm font-semibold">Device Status Overview</h2>
              <div className="grid grid-cols-3 gap-3">
                <DeviceStat label="Online" count={devicesOnline} total={devices.length} color="text-emerald-500" bgColor="bg-emerald-100 dark:bg-emerald-950/40" />
                <DeviceStat label="Stale" count={devicesStale} total={devices.length} color="text-amber-500" bgColor="bg-amber-100 dark:bg-amber-950/40" />
                <DeviceStat label="Offline" count={devicesOffline} total={devices.length} color="text-red-500" bgColor="bg-red-100 dark:bg-red-950/40" />
              </div>
            </div>
          </div>

          {chartVehicleId && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-sm font-semibold">Vehicle Telemetry Trends</h2>
                <Select value={chartVehicleId} onValueChange={setSelectedChartVehicleId}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.vehicleId} value={v.vehicleId}>
                        {v.label} ({v.plateNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <FuelLevelChart data={fuelChartData} vehicleLabel={selectedVehicle?.label ?? chartVehicleId} isLoading={historyLoading} />
                <SpeedChart data={speedChartData} vehicleLabel={selectedVehicle?.label ?? chartVehicleId} isLoading={historyLoading} />
                <TemperatureChart data={tempChartData} vehicleLabel={selectedVehicle?.label ?? chartVehicleId} isLoading={historyLoading} />
              </div>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <TripDistanceChart data={tripDistanceData} isLoading={tripsLoading} />
            <FleetBarChart
              title="Fuel Used by Vehicle"
              data={fuelUsedData}
              dataKey="value"
              unit=" L"
              color="var(--color-chart-2)"
            />
          </div>

          <div className="rounded-lg border">
            <div className="border-b px-4 py-3">
              <h2 className="font-heading text-sm font-semibold">Per-Vehicle Metrics</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Vehicle</th>
                    <th className="px-4 py-3 font-medium">Fuel %</th>
                    <th className="px-4 py-3 font-medium">Fuel (L)</th>
                    <th className="px-4 py-3 font-medium">Engine</th>
                    <th className="px-4 py-3 font-medium">Speed</th>
                    <th className="px-4 py-3 font-medium">Temp</th>
                    <th className="px-4 py-3 font-medium">Device</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleStates.map((v) => (
                    <tr key={v.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{v.label}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full ${
                                v.fuelPercent < 15 ? "bg-destructive" : v.fuelPercent < 30 ? "bg-amber-500" : "bg-[var(--color-chart-1)]"
                              }`}
                              style={{ width: `${v.fuelPercent}%` }}
                            />
                          </div>
                          <span className="text-xs">{v.fuelPercent}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{v.fuelLiters.toFixed(1)}</td>
                      <td className="px-4 py-3">{v.engineOn ? "ON" : "OFF"}</td>
                      <td className="px-4 py-3">{v.speedKmh} km/h</td>
                      <td className="px-4 py-3">{v.tempCelsius.toFixed(1)}°C</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            v.deviceStatus === "online"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : v.deviceStatus === "stale"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {v.deviceStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-4">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-heading text-lg font-bold">{value}</span>
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
    </div>
  )
}

function DeviceStat({
  label,
  count,
  total,
  color,
  bgColor,
}: {
  label: string
  count: number
  total: number
  color: string
  bgColor: string
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className={`rounded-lg ${bgColor} p-3 text-center`}>
      <div className={`text-2xl font-bold ${color}`}>{count}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
        <div className={`h-full rounded-full ${color.replace("text-", "bg-")}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
