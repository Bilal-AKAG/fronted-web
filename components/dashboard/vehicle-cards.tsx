"use client"

import { vehicles, latestStates } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

export function VehicleCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((v) => {
        const state = latestStates.find((s) => s.vehicleId === v.vehicleId)!
        const pct = state.fuelLevelPercent
        return (
          <div key={v.vehicleId} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading font-semibold">{v.label}</p>
                <p className="text-xs text-muted-foreground">{v.plateNumber}</p>
              </div>
              <Badge variant={v.status === "active" ? "default" : "secondary"}>
                {v.status}
              </Badge>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">Fuel</span>
                <span className="font-medium">
                  {state.fuelLevelLiters.toFixed(1)}L / {v.tankCapacityLiters}L
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: pct > 50 ? "var(--color-chart-1)" : pct > 25 ? "var(--color-chart-3)" : "var(--destructive)",
                  }}
                />
              </div>
              <p className="mt-0.5 text-right text-xs text-muted-foreground">{pct}%</p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Driver: </span>
                <span>{v.assignedDriver}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Engine: </span>
                <Badge variant={state.engineStatus === "ON" ? "default" : "outline"} className="text-[10px]">
                  {state.engineStatus}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Device: </span>
                <Badge variant={state.deviceStatus === "online" ? "default" : "destructive"} className="text-[10px]">
                  {state.deviceStatus}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Alerts: </span>
                <Badge variant={state.alertStatus === "normal" ? "outline" : state.alertStatus === "warning" ? "secondary" : "destructive"} className="text-[10px]">
                  {state.alertStatus}
                </Badge>
              </div>
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              {state.location.latitude.toFixed(4)}, {state.location.longitude.toFixed(4)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
