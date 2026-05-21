"use client"

import { useState } from "react"
import { useVehicles, useCreateVehicle } from "@/hooks/use-vehicles"
import { useDrivers } from "@/hooks/use-drivers"
import { useLiveState } from "@/lib/store/live-state"
import { IconTruck, IconPlus } from "@tabler/icons-react"
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
import Link from "next/link"

export default function VehiclesPage() {
  const { data, isLoading } = useVehicles()
  const { data: driversData } = useDrivers()
  const liveStates = useLiveState((s) => s.vehicleStates)
  const createMutation = useCreateVehicle()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    plateNumber: "", label: "", tankCapacityLiters: "", make: "", model: "", year: "", color: "", assignedDriverId: "", assignedDeviceId: "",
  })

  const vehicles = data?.vehicles ?? []
  const drivers = driversData?.drivers ?? []

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await createMutation.mutateAsync({
      plateNumber: form.plateNumber,
      label: form.label,
      tankCapacityLiters: Number(form.tankCapacityLiters),
      make: form.make || undefined,
      model: form.model || undefined,
      year: form.year ? Number(form.year) : undefined,
      color: form.color || undefined,
      assignedDriverId: form.assignedDriverId || undefined,
      assignedDeviceId: form.assignedDeviceId || undefined,
    })
    setForm({ plateNumber: "", label: "", tankCapacityLiters: "", make: "", model: "", year: "", color: "", assignedDriverId: "", assignedDeviceId: "" })
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold">Vehicles</h1>
          <p className="text-sm text-muted-foreground">Fleet vehicle inventory and status</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus data-icon="inline-start" />
              Register Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>New Vehicle</DialogTitle>
                <DialogDescription>Register a new fleet vehicle.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="v-label">Label</Label>
                  <Input id="v-label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-plate">Plate Number</Label>
                  <Input id="v-plate" value={form.plateNumber} onChange={(e) => setForm({ ...form, plateNumber: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-tank">Tank Capacity (L)</Label>
                  <Input id="v-tank" type="number" value={form.tankCapacityLiters} onChange={(e) => setForm({ ...form, tankCapacityLiters: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-make">Make</Label>
                  <Input id="v-make" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-model">Model</Label>
                  <Input id="v-model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-year">Year</Label>
                  <Input id="v-year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-color">Color</Label>
                  <Input id="v-color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Assign Driver</Label>
                  <Select value={form.assignedDriverId || "none"} onValueChange={(v) => setForm({ ...form, assignedDriverId: v === "none" ? "" : v })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unassigned</SelectItem>
                      {drivers.filter((d) => d.status === "active").map((d) => (
                        <SelectItem key={d.driverId} value={d.driverId}>{d.fullName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-device">Assign Device ID</Label>
                  <Input id="v-device" value={form.assignedDeviceId} onChange={(e) => setForm({ ...form, assignedDeviceId: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Saving..." : "Save Vehicle"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
      ) : vehicles.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">No vehicles registered.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => {
            const live = liveStates[v.vehicleId]
            const fuelPct = live?.fuelPercent ?? v.currentState?.fuelPercent
            const speed = live?.speedKmh ?? v.currentState?.speedKmh
            const location = live?.locationName ?? v.currentState?.locationName
            const isLive = !!live

            return (
              <Link key={v.vehicleId} href={`/dashboard/vehicles/${v.vehicleId}`} className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconTruck className="size-4 text-muted-foreground" />
                    <span className="font-heading text-sm font-semibold">{v.label}</span>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      v.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : v.status === "maintenance"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {v.status}
                  </span>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plate</span>
                    <span className="font-medium">{v.plateNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Driver</span>
                    <span>{v.assignedDriver?.fullName ?? "Unassigned"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel</span>
                    <span
                      className={`font-medium ${
                        fuelPct != null && fuelPct < 15
                          ? "text-destructive"
                          : fuelPct != null && fuelPct < 30
                            ? "text-amber-500"
                            : ""
                      }`}
                    >
                      {fuelPct != null ? `${fuelPct}%` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Speed</span>
                    <span>{speed != null ? `${speed} km/h` : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="text-right">{location ?? "—"}</span>
                  </div>
                </div>

                {isLive && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                    </span>
                    <span className="text-xs text-green-500">Live</span>
                  </div>
                )}
            </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
