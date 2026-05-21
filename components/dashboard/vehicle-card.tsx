"use client"

import Link from "next/link"

export interface VehicleCardProps {
  vehicleId: string
  label: string
  plateNumber: string
  status: string
  fuelPercent: number
  fuelLiters: number
  tankCapacityLiters: number | null
  driverName: string | null
  engineOn: boolean
  deviceStatus: string
  alertsCount: number | null
  locationName: string | null
  latitude?: number
  longitude?: number
  isLive?: boolean
}

export function VehicleCard({
  vehicleId,
  label,
  plateNumber,
  status,
  fuelPercent,
  fuelLiters,
  tankCapacityLiters,
  driverName,
  engineOn,
  deviceStatus,
  alertsCount,
  locationName,
  latitude,
  longitude,
  isLive,
}: VehicleCardProps) {
  const tankCapacity = tankCapacityLiters || 100

  return (
    <Link href={`/dashboard/vehicles/${vehicleId}`}>
      <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
        {/* Header: Title + Status Badge */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="font-heading text-sm font-semibold">{label}</h3>
            <p className="text-xs text-muted-foreground">{plateNumber}</p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              status === "active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : status === "maintenance"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Fuel Section */}
        <div className="mb-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Fuel</span>
            <span className="font-medium">
              {fuelLiters.toFixed(1)}L / {tankCapacity}L
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all ${
                  fuelPercent < 15
                    ? "bg-destructive"
                    : fuelPercent < 30
                      ? "bg-amber-500"
                      : "bg-[var(--color-chart-1)]"
                }`}
                style={{ width: `${Math.min(fuelPercent, 100)}%` }}
              />
            </div>
            <span
              className={`text-xs font-medium w-8 text-right ${
                fuelPercent < 15
                  ? "text-destructive"
                  : fuelPercent < 30
                    ? "text-amber-500"
                    : "text-[var(--color-chart-1)]"
              }`}
            >
              {fuelPercent}%
            </span>
          </div>
        </div>

        {/* Driver + Engine */}
        <div className="mb-3 flex items-center justify-between text-xs">
          <div>
            <span className="text-muted-foreground">Driver: </span>
            <span className="font-medium">{driverName ?? "Unassigned"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Engine:</span>
            <span
              className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${
                engineOn
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {engineOn ? "ON" : "OFF"}
            </span>
          </div>
        </div>

        {/* Device + Alerts */}
        <div className="mb-3 flex items-center gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Device: </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${
                deviceStatus === "online"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : deviceStatus === "stale"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {deviceStatus}
            </span>
          </div>
          {alertsCount != null && alertsCount > 0 && (
            <div>
              <span className="text-muted-foreground">Alerts: </span>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${
                alertsCount > 2
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              }`}>
                {alertsCount > 0 ? (alertsCount > 2 ? "critical" : "warning") : "none"}
              </span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="text-xs text-muted-foreground">
          {locationName ?? (latitude && longitude ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` : "—")}
        </div>

        {/* Live indicator */}
        {isLive && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs text-green-500">Live</span>
          </div>
        )}
      </div>
    </Link>
  )
}
