"use client"

import { useState } from "react"
import { useVehicles, useVehicleHistory } from "@/hooks/use-vehicles"
import { useAlerts } from "@/hooks/use-alerts"
import { useDevices } from "@/hooks/use-devices"
import { useLiveState } from "@/lib/store/live-state"
import { FuelLevelChart } from "@/components/dashboard/fuel-level-chart"
import { SpeedChart } from "@/components/dashboard/speed-chart"
import { VehicleCard } from "@/components/dashboard/vehicle-card"
import { IconTruck, IconBell, IconDeviceDesktop, IconRoute } from "@tabler/icons-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

export default function DashboardPage() {
  const { data: vehiclesData, isLoading: vehiclesLoading } = useVehicles()
  const { data: alertsData, isLoading: alertsLoading } = useAlerts()
  const { data: devicesData, isLoading: devicesLoading } = useDevices()
  const liveStates = useLiveState((s) => s.vehicleStates)
  const liveAlerts = useLiveState((s) => s.latestAlerts)
  const deviceChanges = useLiveState((s) => s.deviceStatusChanges)
  const connectedIds = useLiveState((s) => s.connectedVehicleIds)

  const vehicles = vehiclesData?.vehicles ?? []
  const alerts = alertsData?.alerts ?? []
  const devices = devicesData?.devices ?? []

  const [selectedChartVehicleId, setSelectedChartVehicleId] = useState<string>("")
  const chartVehicleId = selectedChartVehicleId || vehicles[0]?.vehicleId || ""
  const selectedVehicle = vehicles.find((v) => v.vehicleId === chartVehicleId)

  const { data: historyData, isLoading: historyLoading } = useVehicleHistory(chartVehicleId, { limit: 96 })
  const historyRecords = historyData?.records ?? []

  // Transform history records into chart data
  const fuelChartData = historyRecords.map((r) => ({
    time: new Date(r.receivedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    fuel: r.fuelPercent,
  }))

  const speedChartData = historyRecords.map((r) => ({
    time: new Date(r.receivedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    speed: r.speedKmh,
  }))

  const totalVehicles = vehicles.length
  const activeAlerts = alerts.filter((a) => a.status === "open").length
  const criticalAlerts = alerts.filter((a) => a.status === "open" && a.severity === "critical").length
  const devicesOnline = devices.filter((d) => d.status === "online").length

  const activeTrips = vehicles.filter((v) => {
    const live = liveStates[v.vehicleId]
    return live?.activeTripId ?? v.currentState?.activeTripId
  }).length

  const fleetFuelAvg =
    vehicles.length > 0
      ? Math.round(
          vehicles.reduce((sum, v) => {
            const live = liveStates[v.vehicleId]
            return sum + (live?.fuelPercent ?? v.currentState?.fuelPercent ?? 0)
          }, 0) / vehicles.length
        )
      : 0

  const recentLiveAlerts = liveAlerts.slice(0, 3)
  const recentDeviceChanges = deviceChanges.slice(0, 5)

  const loading = vehiclesLoading || alertsLoading || devicesLoading

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-bold">Fleet Dashboard</h1>
        <p className="text-sm text-muted-foreground">Real-time overview of your fleet</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              icon={<IconTruck className="size-5" />}
              label="Connected Vehicles"
              value={`${connectedIds.length}/${totalVehicles}`}
              sub={connectedIds.length > 0 ? "Live via WebSocket" : "No WS connection"}
            />
            <DashboardCard
              icon={<IconBell className="size-5" />}
              label="Active Alerts"
              value={String(activeAlerts)}
              sub={`${criticalAlerts} critical`}
            />
            <DashboardCard
              icon={<IconDeviceDesktop className="size-5" />}
              label="Devices Online"
              value={`${devicesOnline}/${devices.length}`}
              sub={`Avg fuel: ${fleetFuelAvg}%`}
            />
            <DashboardCard
              icon={<IconRoute className="size-5" />}
              label="Active Trips"
              value={String(activeTrips)}
            />
          </div>

          {recentLiveAlerts.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
              <div className="mb-2 flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                </span>
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  New Alerts
                </span>
              </div>
              <div className="space-y-1">
                {recentLiveAlerts.map((a) => (
                  <Link
                    key={a.alertId}
                    href={`/dashboard/alerts/${a.alertId}`}
                    className="flex items-center gap-2 text-sm hover:underline"
                  >
                    <span className="font-medium">{a.type.replace(/_/g, " ")}</span>
                    <span className="text-xs text-muted-foreground">{a.vehicleLabel}</span>
                    <span className="text-xs text-muted-foreground">{a.message}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border lg:col-span-2 lg:col-span-3">
              <div className="border-b px-4 py-3">
                <h2 className="font-heading text-sm font-semibold">Fleet Vehicles</h2>
              </div>
              <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((v) => {
                  const live = liveStates[v.vehicleId]
                  const fuelPct = live?.fuelPercent ?? v.currentState?.fuelPercent ?? 0
                  const fuelLiters = live?.fuelLiters ?? v.currentState?.fuelLiters ?? 0
                  const location = (live?.locationName ?? v.currentState?.locationName) || null
                  const latitude = live?.latitude ?? v.currentState?.latitude
                  const longitude = live?.longitude ?? v.currentState?.longitude
                  const isLive = !!live

                  return (
                    <VehicleCard
                      key={v.vehicleId}
                      vehicleId={v.vehicleId}
                      label={v.label}
                      plateNumber={v.plateNumber}
                      status={v.status}
                      fuelPercent={fuelPct}
                      fuelLiters={fuelLiters}
                      tankCapacityLiters={v.currentState?.fuelLiters ? Math.round((fuelLiters / (fuelPct || 1)) * 100) : 80}
                      driverName={v.assignedDriver?.fullName ?? null}
                      engineOn={live?.engineOn ?? v.currentState?.engineOn ?? false}
                      deviceStatus={live?.deviceStatus ?? v.currentState?.deviceStatus ?? "offline"}
                      alertsCount={null}
                      locationName={location}
                      latitude={latitude}
                      longitude={longitude}
                      isLive={isLive}
                    />
                  )
                })}
              </div>
            </div>

            {recentDeviceChanges.length > 0 && (
              <div className="rounded-lg border">
                <div className="border-b px-4 py-3">
                  <h2 className="font-heading text-sm font-semibold">Device Changes</h2>
                </div>
                <div className="divide-y">
                  {recentDeviceChanges.map((c, i) => (
                    <div key={`${c.deviceId}-${i}`} className="px-4 py-2.5 text-sm">
                      <div className="flex items-center gap-2">
                        <IconDeviceDesktop className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="font-mono text-xs font-medium">{c.deviceId}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="capitalize text-red-500">{c.prevStatus}</span>
                        <span>→</span>
                        <span className="capitalize text-green-500">{c.newStatus}</span>
                        <span>{new Date(c.lastSeenAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {chartVehicleId && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-sm font-semibold">Telemetry Charts</h2>
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
              <div className="grid gap-4 lg:grid-cols-2">
                <FuelLevelChart
                  data={fuelChartData}
                  vehicleLabel={selectedVehicle?.label ?? chartVehicleId}
                  isLoading={historyLoading}
                />
                <SpeedChart
                  data={speedChartData}
                  vehicleLabel={selectedVehicle?.label ?? chartVehicleId}
                  isLoading={historyLoading}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function DashboardCard({
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
