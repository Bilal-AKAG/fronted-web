"use client"

import { useAlerts, useResolveAlert } from "@/hooks/use-alerts"
import { IconBell, IconCircleCheck, IconEye, IconExternalLink } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { useLiveState } from "@/lib/store/live-state"
import Link from "next/link"

const severityStyles: Record<string, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
}

const typeLabels: Record<string, string> = {
  SUSPECTED_FUEL_DROP: "Suspected Fuel Drop",
  LOW_FUEL: "Low Fuel",
  OVERSPEED: "Overspeed",
  DEVICE_STALE: "Device Stale",
  DEVICE_OFFLINE: "Device Offline",
  DOOR_OPEN_PARKED: "Door Open Parked",
  REFILL_DETECTED: "Refill Detected",
  GEOFENCE_VIOLATION: "Geofence Violation",
}

export default function AlertsPage() {
  const { data, isLoading } = useAlerts()
  const resolveMutation = useResolveAlert()
  const liveAlerts = useLiveState((s) => s.latestAlerts)

  const alerts = data?.alerts ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-bold">Alerts</h1>
        <p className="text-sm text-muted-foreground">Monitor and manage fleet alerts</p>
      </div>

      {liveAlerts.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">LIVE — Recent Alerts</span>
          <div className="mt-2 space-y-1">
            {liveAlerts.slice(0, 3).map((a) => (
              <div key={a.alertId} className="flex items-center gap-2 text-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                </span>
                <span className="font-medium">{a.type.replace(/_/g, " ")}</span>
                <span className="text-xs text-muted-foreground">{a.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
      ) : alerts.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">No alerts.</div>
      ) : (
        <div className="rounded-lg border">
          <div className="divide-y">
            {alerts.map((a) => (
              <div key={a.alertId} className="px-4 py-3 text-sm">
                <div className="mb-1 flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <IconBell className="mt-0.5 size-4 text-muted-foreground" />
                    <div>
                      <Link href={`/dashboard/alerts/${a.alertId}`} className="font-medium underline-offset-2 hover:underline">{typeLabels[a.type] ?? a.type.replace(/_/g, " ")}</Link>
                      <p className="text-xs text-muted-foreground">{a.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${severityStyles[a.severity] ?? ""}`}
                    >
                      {a.severity}
                    </span>
                    <span className="text-xs capitalize text-muted-foreground">{a.status}</span>
                    <Link href={`/dashboard/alerts/${a.alertId}`}>
                      <IconExternalLink className="size-3.5 text-muted-foreground hover:text-foreground" />
                    </Link>
                  </div>
                </div>
                <div className="ml-6 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Vehicle: {a.vehicleId}</span>
                  {a.driver && <span>Driver: {a.driver.fullName}</span>}
                  <span>{new Date(a.createdAt).toLocaleString()}</span>
                  {a.status === "open" && (
                    <div className="ml-auto flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.preventDefault()
                          resolveMutation.mutate({ alertId: a.alertId, status: "acknowledged" })
                        }}
                      >
                        <IconEye className="mr-1 size-3" />
                        Acknowledge
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.preventDefault()
                          resolveMutation.mutate({ alertId: a.alertId, status: "resolved" })
                        }}
                      >
                        <IconCircleCheck className="mr-1 size-3" />
                        Resolve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
