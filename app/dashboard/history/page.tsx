"use client"

import { useState } from "react"
import { useVehicleHistory } from "@/hooks/use-vehicles"
import { useVehicles } from "@/hooks/use-vehicles"
import { useLiveState } from "@/lib/store/live-state"
import { IconRefresh } from "@tabler/icons-react"
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

  const { data, isLoading, refetch } = useVehicleHistory(vehicleId, { limit: 50 })
  const liveStates = useLiveState((s) => s.vehicleStates)

  const records = data?.records ?? []
  const live = liveStates[vehicleId]

  const selectedVehicle = vehicles.find((v) => v.vehicleId === vehicleId)

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
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                </span>
                <span className="text-xs font-medium text-muted-foreground">LIVE — {selectedVehicle?.label ?? vehicleId}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <LiveTile label="Fuel" value={`${live.fuelLiters.toFixed(1)}L`} sub={`${live.fuelPercent}%`} />
                <LiveTile label="Speed" value={`${live.speedKmh} km/h`} sub={live.engineOn ? "Engine ON" : "Engine OFF"} />
                <LiveTile label="Temperature" value={`${live.tempCelsius.toFixed(1)}°C`} />
                <LiveTile label="Location" value={live.locationName ?? "—"} sub={`${live.latitude}, ${live.longitude}`} />
              </div>
            </div>
          )}

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
