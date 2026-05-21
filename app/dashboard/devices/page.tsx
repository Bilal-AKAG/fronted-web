"use client"

import { useState } from "react"
import { useDevices, useCreateDevice } from "@/hooks/use-devices"
import { useVehicles } from "@/hooks/use-vehicles"
import { useLiveState } from "@/lib/store/live-state"
import { IconDeviceDesktop, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const statusStyles: Record<string, string> = {
  online: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  stale: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  offline: "bg-muted text-muted-foreground",
}

export default function DevicesPage() {
  const { data, isLoading } = useDevices()
  const { data: vehiclesData } = useVehicles()
  const createMutation = useCreateDevice()
  const deviceChanges = useLiveState((s) => s.deviceStatusChanges)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ deviceId: "", vehicleId: "", firmwareVersion: "" })

  const devices = data?.devices ?? []
  const vehicles = vehiclesData?.vehicles ?? []

  const latestDeviceStatus: Record<string, { status: string; lastSeenAt: string }> = {}
  for (const change of deviceChanges) {
    latestDeviceStatus[change.deviceId] = { status: change.newStatus, lastSeenAt: change.lastSeenAt }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await createMutation.mutateAsync({
      deviceId: form.deviceId,
      vehicleId: form.vehicleId || undefined,
      firmwareVersion: form.firmwareVersion || undefined,
    })
    setForm({ deviceId: "", vehicleId: "", firmwareVersion: "" })
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold">Devices</h1>
          <p className="text-sm text-muted-foreground">Manage ESP32 hardware devices</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus data-icon="inline-start" />
              Register Device
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>New Device</DialogTitle>
                <DialogDescription>Register a new ESP32 hardware device.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="deviceId">Device ID</Label>
                  <Input id="deviceId" value={form.deviceId} onChange={(e) => setForm({ ...form, deviceId: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="firmwareVersion">Firmware Version</Label>
                  <Input id="firmwareVersion" value={form.firmwareVersion} onChange={(e) => setForm({ ...form, firmwareVersion: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Assign to Vehicle</Label>
                  <Select value={form.vehicleId || "none"} onValueChange={(v) => setForm({ ...form, vehicleId: v === "none" ? "" : v })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unassigned</SelectItem>
                      {vehicles.map((v) => (
                        <SelectItem key={v.vehicleId} value={v.vehicleId}>{v.label} ({v.plateNumber})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Saving..." : "Save Device"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
      ) : devices.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">No devices registered.</div>
      ) : (
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Device</th>
                  <th className="px-4 py-3 font-medium">Firmware</th>
                  <th className="px-4 py-3 font-medium">Vehicle</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Last Seen</th>
                  <th className="px-4 py-3 font-medium">Registered</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((d) => {
                  const live = latestDeviceStatus[d.deviceId]
                  const status = live?.status ?? d.status
                  const lastSeenAt = live?.lastSeenAt ?? d.lastSeenAt
                  const isLive = !!live

                  return (
                  <tr key={d.deviceId} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <IconDeviceDesktop className="size-4 text-muted-foreground" />
                        <span className="font-medium">{d.deviceId}</span>
                        {isLive && (
                          <span className="relative flex size-2">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{d.firmwareVersion ?? "—"}</td>
                    <td className="px-4 py-3">{d.vehicleId ?? "Unassigned"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[status] ?? ""}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {lastSeenAt ? new Date(lastSeenAt).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(d.registeredAt).toLocaleDateString()}
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
