"use client"

import { useState } from "react"
import { useVehicle, useVehicleAlerts, useUpdateVehicle } from "@/hooks/use-vehicles"
import { useLiveState } from "@/lib/store/live-state"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconArrowLeft, IconTruck, IconEdit } from "@tabler/icons-react"

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

export default function VehicleDetailPage() {
  const params = useParams()
  const vehicleId = params.id as string
  const { data, isLoading } = useVehicle(vehicleId)
  const { data: alertsData, isLoading: alertsLoading } = useVehicleAlerts(vehicleId, { limit: 20 })
  const updateMutation = useUpdateVehicle()
  const liveStates = useLiveState((s) => s.vehicleStates)
  const connectedIds = useLiveState((s) => s.connectedVehicleIds)
  const deviceChanges = useLiveState((s) => s.deviceStatusChanges)
  const live = liveStates[vehicleId]

  const deviceStatusMap: Record<string, string> = {}
  for (const change of deviceChanges) {
    if (change.newStatus) deviceStatusMap[change.deviceId] = change.newStatus
  }
  const isConnected = connectedIds.includes(vehicleId)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    plateNumber: "", label: "", make: "", model: "", year: "", color: "", tankCapacityLiters: "", status: "",
  })

  const vehicle = data?.vehicle
  const alerts = alertsData?.alerts ?? []

  function startEditing() {
    setEditForm({
      plateNumber: vehicle?.plateNumber ?? "",
      label: vehicle?.label ?? "",
      make: vehicle?.make ?? "",
      model: vehicle?.model ?? "",
      year: vehicle?.year ? String(vehicle.year) : "",
      color: vehicle?.color ?? "",
      tankCapacityLiters: vehicle?.tankCapacityLiters ? String(vehicle.tankCapacityLiters) : "",
      status: vehicle?.status ?? "",
    })
    setEditing(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    await updateMutation.mutateAsync({
      vehicleId,
      data: {
        plateNumber: editForm.plateNumber || undefined,
        label: editForm.label || undefined,
        make: editForm.make || undefined,
        model: editForm.model || undefined,
        year: editForm.year ? Number(editForm.year) : undefined,
        color: editForm.color || undefined,
        tankCapacityLiters: editForm.tankCapacityLiters ? Number(editForm.tankCapacityLiters) : undefined,
        status: editForm.status || undefined,
      },
    })
    setEditing(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/vehicles">
            <IconArrowLeft className="mr-2 size-4" />
            Back to Vehicles
          </Link>
        </Button>
        {vehicle && !editing && (
          <Button variant="outline" size="sm" onClick={startEditing}>
            <IconEdit className="mr-2 size-4" />
            Edit
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
      ) : !vehicle ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">Vehicle not found.</div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <IconTruck className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl font-bold">{vehicle.label}</h1>
                {live && (
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {vehicle.plateNumber}
                {isConnected && (
                  <span className="ml-2 text-xs text-green-500">• Connected</span>
                )}
              </p>
            </div>
            <span
              className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                vehicle.status === "active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : vehicle.status === "maintenance"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {vehicle.status}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              {editing ? (
                <form onSubmit={handleSave}>
                  <h2 className="mb-4 font-heading text-sm font-semibold">Edit Vehicle</h2>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-label">Label</Label>
                      <Input id="edit-label" value={editForm.label} onChange={(e) => setEditForm({ ...editForm, label: e.target.value })} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-plate">Plate Number</Label>
                      <Input id="edit-plate" value={editForm.plateNumber} onChange={(e) => setEditForm({ ...editForm, plateNumber: e.target.value })} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-make">Make</Label>
                      <Input id="edit-make" value={editForm.make} onChange={(e) => setEditForm({ ...editForm, make: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-model">Model</Label>
                      <Input id="edit-model" value={editForm.model} onChange={(e) => setEditForm({ ...editForm, model: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-year">Year</Label>
                      <Input id="edit-year" type="number" value={editForm.year} onChange={(e) => setEditForm({ ...editForm, year: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-color">Color</Label>
                      <Input id="edit-color" value={editForm.color} onChange={(e) => setEditForm({ ...editForm, color: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-tank">Tank Capacity (L)</Label>
                      <Input id="edit-tank" type="number" value={editForm.tankCapacityLiters} onChange={(e) => setEditForm({ ...editForm, tankCapacityLiters: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Status</Label>
                      <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                    <Button type="submit" size="sm" disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">Make</span>
                    <p>{vehicle.make ?? "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Model</span>
                    <p>{vehicle.model ?? "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Year</span>
                    <p>{vehicle.year ?? "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Color</span>
                    <p>{vehicle.color ?? "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Tank Capacity</span>
                    <p>{vehicle.tankCapacityLiters ? `${vehicle.tankCapacityLiters} L` : "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Driver</span>
                    <p>{vehicle.assignedDriver?.fullName ?? "Unassigned"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Device</span>
                    <p>{vehicle.assignedDevice?.deviceId ?? "Unassigned"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Open Alerts</span>
                    <p className="font-heading text-lg font-bold text-destructive">{vehicle.openAlertsCount}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-heading text-sm font-semibold">Current State</h2>
                {live && (
                  <span className="flex items-center gap-1.5 text-xs text-green-500">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                    </span>
                    LIVE
                  </span>
                )}
              </div>
              {(() => {
                const state = live ?? vehicle.currentState
                return state ? (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground">Fuel Level</span>
                      <p
                        className={`font-heading text-lg font-bold ${
                          state.fuelPercent < 15
                            ? "text-destructive"
                            : state.fuelPercent < 30
                              ? "text-amber-500"
                              : "text-green-500"
                        }`}
                      >
                        {state.fuelPercent}%
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Fuel Volume</span>
                      <p>{state.fuelLiters.toFixed(1)} L</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Speed</span>
                      <p>{state.speedKmh} km/h</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Engine</span>
                      <p>{state.engineOn ? "On" : "Off"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Temperature</span>
                      <p>{state.tempCelsius}°C</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Device Status</span>
                      <p className="capitalize">{deviceStatusMap[vehicle.assignedDevice?.deviceId ?? ""] ?? vehicle.assignedDevice?.status ?? state.deviceStatus}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-muted-foreground">Location</span>
                      <p>{state.locationName ?? `${state.latitude}, ${state.longitude}`}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-muted-foreground">Last Seen</span>
                      <p>{new Date(state.lastSeenAt).toLocaleString()}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No telemetry data available.</p>
                )
              })()}
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="border-b px-4 py-3">
              <h2 className="font-heading text-sm font-semibold">Recent Alerts</h2>
            </div>
            {alertsLoading ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Loading...</div>
            ) : alerts.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                No alerts for this vehicle.
              </div>
            ) : (
              <div className="divide-y">
                {alerts.map((a) => (
                  <Link key={a.alertId} href={`/dashboard/alerts/${a.alertId}`} className="block px-4 py-3 text-sm transition-colors hover:bg-muted/50">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-medium">{typeLabels[a.type] ?? a.type.replace(/_/g, " ")}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${severityStyles[a.severity] ?? ""}`}
                      >
                        {a.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{a.message}</p>
                    <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                      <span className="capitalize">Status: {a.status}</span>
                      <span>{new Date(a.createdAt).toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
