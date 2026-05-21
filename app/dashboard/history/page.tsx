"use client"

import { useState } from "react"
import { useVehicleHistory } from "@/hooks/use-vehicles"
import { useVehicles } from "@/hooks/use-vehicles"
import { useAllTrips } from "@/hooks/use-trips"
import { useLiveState } from "@/lib/store/live-state"
import { FuelLevelChart } from "@/components/dashboard/fuel-level-chart"
import { SpeedChart } from "@/components/dashboard/speed-chart"
import { TripDistanceChart } from "@/components/dashboard/trip-distance-chart"
import { IconRefresh, IconRoute } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function HistoryPage() {
  const { data: vehiclesData } = useVehicles()
  const vehicles = vehiclesData?.vehicles ?? []
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("")

  const vehicleId = selectedVehicleId || vehicles[0]?.vehicleId || ""

  const { data, isLoading, refetch } = useVehicleHistory(vehicleId, { limit: 96 })
  const liveStates = useLiveState((s) => s.vehicleStates)
  const { trips: allTrips, isLoading: tripsLoading } = useAllTrips({ limit: 10 })

  const records = data?.records ?? []
  const live = liveStates[vehicleId]

  const selectedVehicle = vehicles.find((v) => v.vehicleId === vehicleId)

  const fuelChartData = records.map((r) => ({
    time: new Date(r.receivedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    fuel: r.fuelPercent,
  }))

  const speedChartData = records.map((r) => ({
    time: new Date(r.receivedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    speed: r.speedKmh,
  }))

  const tripDistanceByVehicle = vehicles
    .map((v) => {
      const vehicleTrips = allTrips.filter((t) => t.vehicleId === v.vehicleId)
      const totalDistance = vehicleTrips.reduce((sum, t) => sum + (t.distanceKm ?? 0), 0)
      return { vehicle: v.label, distanceKm: Math.round(totalDistance * 10) / 10 }
    })
    .filter((d) => d.distanceKm > 0)
    .sort((a, b) => b.distanceKm - a.distanceKm)

  const vehicleTrips = allTrips
    .filter((t) => t.vehicleId === vehicleId)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold">Telemetry History</h1>
          <p className="text-sm text-muted-foreground">Timeline of vehicle sensor data</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={vehicleId} onValueChange={setSelectedVehicleId}>
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
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <IconRefresh className="mr-1 size-4" />
            Refresh
          </Button>
        </div>
      </div>

      {!vehicleId ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">No vehicles available.</div>
      ) : (
        <>
          {live && (
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--color-chart-1)] opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-[var(--color-chart-1)]" />
                </span>
                <span className="text-xs font-medium text-muted-foreground">LIVE — {selectedVehicle?.label ?? vehicleId}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <LiveTile label="Fuel" value={`${live.fuelLiters.toFixed(1)}L`} sub={`${live.fuelPercent}%`} />
                <LiveTile label="Speed" value={`${live.speedKmh} km/h`} sub={live.engineOn ? "Engine ON" : "Engine OFF"} />
                <LiveTile label="Temperature" value={`${live.tempCelsius.toFixed(1)}°C`} />
                <LiveTile label="Location" value={live.locationName ?? "—"} sub={`${live.latitude.toFixed(4)}, ${live.longitude.toFixed(4)}`} />
              </div>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <FuelLevelChart
              data={fuelChartData}
              vehicleLabel={selectedVehicle?.label ?? vehicleId}
              isLoading={isLoading}
            />
            <SpeedChart
              data={speedChartData}
              vehicleLabel={selectedVehicle?.label ?? vehicleId}
              isLoading={isLoading}
            />
          </div>

          <TripDistanceChart data={tripDistanceByVehicle} isLoading={tripsLoading} />

          <div className="rounded-lg border">
            <div className="border-b px-4 py-3">
              <h2 className="font-heading text-sm font-semibold">Trips — {selectedVehicle?.label ?? vehicleId}</h2>
            </div>
            {tripsLoading ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Loading...</div>
            ) : vehicleTrips.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                No trips recorded for this vehicle.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="px-4 py-2 font-medium">Trip</th>
                      <th className="px-4 py-2 font-medium">Start</th>
                      <th className="px-4 py-2 font-medium">End</th>
                      <th className="px-4 py-2 font-medium">Distance</th>
                      <th className="px-4 py-2 font-medium">Fuel Used</th>
                      <th className="px-4 py-2 font-medium">Avg Speed</th>
                      <th className="px-4 py-2 font-medium">Max Speed</th>
                      <th className="px-4 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleTrips.map((t) => (
                      <tr key={t.tripId} className="border-b last:border-0">
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-1.5">
                            <IconRoute className="size-3.5 text-muted-foreground shrink-0" />
                            <span className="font-mono text-xs font-medium">{t.tripId}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-xs">{new Date(t.startTime).toLocaleString()}</td>
                        <td className="px-4 py-2 text-xs">{t.endTime ? new Date(t.endTime).toLocaleString() : "—"}</td>
                        <td className="px-4 py-2">{t.distanceKm != null ? `${t.distanceKm.toFixed(1)} km` : "—"}</td>
                        <td className="px-4 py-2">{t.fuelUsedLiters != null ? `${t.fuelUsedLiters.toFixed(1)} L` : "—"}</td>
                        <td className="px-4 py-2">{t.avgSpeedKmh != null ? `${t.avgSpeedKmh.toFixed(1)} km/h` : "—"}</td>
                        <td className="px-4 py-2">{t.maxSpeedKmh != null ? `${t.maxSpeedKmh.toFixed(1)} km/h` : "—"}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              t.status === "active"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-lg border">
            <div className="border-b px-4 py-3">
              <h2 className="font-heading text-sm font-semibold">Historical Records — {selectedVehicle?.label ?? vehicleId}</h2>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Loading...</div>
            ) : records.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                No telemetry data available. Run the ESP32 simulator to generate data.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="px-4 py-2 font-medium">Time</th>
                      <th className="px-4 py-2 font-medium">Fuel</th>
                      <th className="px-4 py-2 font-medium">Speed</th>
                      <th className="px-4 py-2 font-medium">Engine</th>
                      <th className="px-4 py-2 font-medium">Temp</th>
                      <th className="px-4 py-2 font-medium">Fuel Rate</th>
                      <th className="px-4 py-2 font-medium">Coordinates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r.telemetryId} className="border-b last:border-0">
                        <td className="px-4 py-2 font-mono text-xs">{new Date(r.receivedAt).toLocaleTimeString()}</td>
                        <td className="px-4 py-2">{r.fuelLiters.toFixed(1)}L ({r.fuelPercent}%)</td>
                        <td className="px-4 py-2">{r.speedKmh} km/h</td>
                        <td className="px-4 py-2">{r.engineOn ? "ON" : "OFF"}</td>
                        <td className="px-4 py-2">{r.tempCelsius.toFixed(1)}°C</td>
                        <td className="px-4 py-2">{r.fuelRateLhr?.toFixed(1) ?? "—"} L/h</td>
                        <td className="px-4 py-2 font-mono text-xs">
                          {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function LiveTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <span className="text-xs text-muted-foreground">{label}</span>
      <p className="font-heading text-lg font-bold">{value}</p>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  )
}
