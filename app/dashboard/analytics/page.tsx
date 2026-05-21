"use client"

import { useVehicles } from "@/hooks/use-vehicles"
import { useLiveState } from "@/lib/store/live-state"
import { IconChartBar, IconTruck, IconBell, IconDeviceDesktop } from "@tabler/icons-react"

export default function AnalyticsPage() {
  const { data: vehiclesData, isLoading } = useVehicles()
  const liveStates = useLiveState((s) => s.vehicleStates)

  const vehicles = vehiclesData?.vehicles ?? []

  const vehicleStates = vehicles.map((v) => {
    const live = liveStates[v.vehicleId]
    return {
      id: v.vehicleId,
      label: v.label,
      fuelPercent: live?.fuelPercent ?? v.currentState?.fuelPercent ?? 0,
      fuelLiters: live?.fuelLiters ?? v.currentState?.fuelLiters ?? 0,
      engineOn: live?.engineOn ?? v.currentState?.engineOn ?? false,
      speedKmh: live?.speedKmh ?? v.currentState?.speedKmh ?? 0,
      tempCelsius: live?.tempCelsius ?? v.currentState?.tempCelsius ?? 0,
      deviceStatus: live?.deviceStatus ?? v.currentState?.deviceStatus ?? "offline",
    }
  })

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Fuel consumption insights and fleet performance metrics</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
      ) : vehicles.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">No data available.</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            />
            <StatCard
              icon={<IconDeviceDesktop className="size-5" />}
              label="Avg Temperature"
              value={`${avgTemp}°C`}
            />
            <StatCard
              icon={<IconBell className="size-5" />}
              label="Fleet Size"
              value={String(vehicles.length)}
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
                                v.fuelPercent < 15 ? "bg-destructive" : v.fuelPercent < 30 ? "bg-amber-500" : "bg-green-500"
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
