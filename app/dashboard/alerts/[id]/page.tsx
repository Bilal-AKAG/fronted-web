"use client"

import { useAlert, useResolveAlert } from "@/hooks/use-alerts"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowLeft, IconBell, IconCircleCheck, IconEye } from "@tabler/icons-react"

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

export default function AlertDetailPage() {
  const params = useParams()
  const alertId = params.id as string
  const { data, isLoading } = useAlert(alertId)
  const resolveMutation = useResolveAlert()

  const alert = data?.alert

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" asChild>
        <Link href="/dashboard/alerts">
          <IconArrowLeft className="mr-2 size-4" />
          Back to Alerts
        </Link>
      </Button>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
      ) : !alert ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">Alert not found.</div>
      ) : (
        <>
          <div className="flex items-start gap-3">
            <div
              className={`flex size-10 items-center justify-center rounded-lg ${
                alert.severity === "critical"
                  ? "bg-red-100 text-red-600 dark:bg-red-900/30"
                  : alert.severity === "warning"
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
              }`}
            >
              <IconBell className="size-5" />
            </div>
            <div className="flex-1">
              <h1 className="font-heading text-xl font-bold">
                {typeLabels[alert.type] ?? alert.type.replace(/_/g, " ")}
              </h1>
              <p className="text-sm text-muted-foreground">{alert.message}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${severityStyles[alert.severity] ?? ""}`}
              >
                {alert.severity}
              </span>
              <span className="text-xs capitalize text-muted-foreground">{alert.status}</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h2 className="mb-3 font-heading text-sm font-semibold">Details</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Vehicle</span>
                  <p>
                    {alert.vehicle ? (
                      <Link href={`/dashboard/vehicles/${alert.vehicle.vehicleId}`} className="underline underline-offset-2 hover:text-primary">
                        {alert.vehicle.label}
                      </Link>
                    ) : (
                      alert.vehicleId
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Driver</span>
                  <p>{alert.driver?.fullName ?? "—"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Created</span>
                  <p>{new Date(alert.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Resolved</span>
                  <p>{alert.resolvedAt ? new Date(alert.resolvedAt).toLocaleString() : "—"}</p>
                </div>
              </div>
            </div>

            {alert.evidence && Object.keys(alert.evidence).length > 0 && (
              <div className="rounded-lg border p-4">
                <h2 className="mb-3 font-heading text-sm font-semibold">Evidence</h2>
                <pre className="overflow-auto rounded bg-muted p-3 text-xs">
                  {JSON.stringify(alert.evidence, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {alert.status === "open" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => resolveMutation.mutate({ alertId: alert.alertId, status: "acknowledged" })}
                disabled={resolveMutation.isPending}
              >
                <IconEye className="mr-2 size-4" />
                Acknowledge
              </Button>
              <Button
                onClick={() => resolveMutation.mutate({ alertId: alert.alertId, status: "resolved" })}
                disabled={resolveMutation.isPending}
              >
                <IconCircleCheck className="mr-2 size-4" />
                Resolve
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
