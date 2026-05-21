"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQueries } from "@tanstack/react-query"
import { useVehicles, useCreateVehicle } from "@/hooks/use-vehicles"
import { fetchVehicle } from "@/lib/api/vehicles"
import { useDrivers } from "@/hooks/use-drivers"
import { useDevices } from "@/hooks/use-devices"
import { useLiveState } from "@/lib/store/live-state"
import {
  IconDeviceDesktop,
  IconGasStation,
  IconPlus,
  IconSteeringWheel,
  IconTruck,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const UNKNOWN_VALUE = "—"

export default function VehiclesPage() {
  const router = useRouter()
  const { data, isLoading: vehiclesLoading } = useVehicles()
  const { data: driversData } = useDrivers()
  const { data: devicesData, isLoading: devicesLoading } = useDevices()
  const liveStates = useLiveState((s) => s.vehicleStates)
  const createMutation = useCreateVehicle()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    plateNumber: "",
    label: "",
    tankCapacityLiters: "",
    make: "",
    model: "",
    year: "",
    color: "",
    assignedDriverId: "",
    assignedDeviceId: "",
  })

  const vehicles = data?.vehicles ?? []
  const drivers = driversData?.drivers ?? []
  const devices = devicesData?.devices ?? []
  const devicesOnline = devices.filter(
    (device) => device.status === "online"
  ).length

  const vehicleDetailQueries = useQueries({
    queries: vehicles.map((v) => ({
      queryKey: ["vehicle", v.vehicleId],
      queryFn: () => fetchVehicle(v.vehicleId),
      enabled: vehicles.length > 0,
    })),
  })
  const totalCapacity = vehicleDetailQueries.reduce(
    (sum, q) => sum + (q.data?.vehicle?.tankCapacityLiters ?? 0),
    0
  )
  const tankCapacityMap: Record<string, number> = {}
  for (const q of vehicleDetailQueries) {
    if (q.data?.vehicle) {
      tankCapacityMap[q.data.vehicle.vehicleId] = q.data.vehicle.tankCapacityLiters
    }
  }
  const assignedDriversCount = new Set(
    vehicles.map((vehicle) => vehicle.assignedDriver?.driverId).filter(Boolean)
  ).size
  const loading = vehiclesLoading || devicesLoading

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
    setForm({
      plateNumber: "",
      label: "",
      tankCapacityLiters: "",
      make: "",
      model: "",
      year: "",
      color: "",
      assignedDriverId: "",
      assignedDeviceId: "",
    })
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold">Vehicles</h1>
          <p className="text-sm text-muted-foreground">
            Fleet vehicle inventory and status
          </p>
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
                <DialogDescription>
                  Register a new fleet vehicle.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="v-label">Label</Label>
                  <Input
                    id="v-label"
                    value={form.label}
                    onChange={(e) =>
                      setForm({ ...form, label: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-plate">Plate Number</Label>
                  <Input
                    id="v-plate"
                    value={form.plateNumber}
                    onChange={(e) =>
                      setForm({ ...form, plateNumber: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-tank">Tank Capacity (L)</Label>
                  <Input
                    id="v-tank"
                    type="number"
                    value={form.tankCapacityLiters}
                    onChange={(e) =>
                      setForm({ ...form, tankCapacityLiters: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-make">Make</Label>
                  <Input
                    id="v-make"
                    value={form.make}
                    onChange={(e) => setForm({ ...form, make: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-model">Model</Label>
                  <Input
                    id="v-model"
                    value={form.model}
                    onChange={(e) =>
                      setForm({ ...form, model: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-year">Year</Label>
                  <Input
                    id="v-year"
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-color">Color</Label>
                  <Input
                    id="v-color"
                    value={form.color}
                    onChange={(e) =>
                      setForm({ ...form, color: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Assign Driver</Label>
                  <Select
                    value={form.assignedDriverId || "none"}
                    onValueChange={(v) =>
                      setForm({
                        ...form,
                        assignedDriverId: v === "none" ? "" : v,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unassigned</SelectItem>
                      {drivers
                        .filter((d) => d.status === "active")
                        .map((d) => (
                          <SelectItem key={d.driverId} value={d.driverId}>
                            {d.fullName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="v-device">Assign Device ID</Label>
                  <Input
                    id="v-device"
                    value={form.assignedDeviceId}
                    onChange={(e) =>
                      setForm({ ...form, assignedDeviceId: e.target.value })
                    }
                  />
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

      {loading ? (
        <div className="flex items-center justify-center rounded-lg border py-20 text-muted-foreground">
          Loading vehicles...
        </div>
      ) : vehicles.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border py-20 text-muted-foreground">
          No vehicles registered.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <FleetMetricCard
              icon={<IconTruck className="size-4" />}
              label="Total Fleet"
              value={String(vehicles.length)}
            />
            <FleetMetricCard
              icon={<IconSteeringWheel className="size-4" />}
              label="Assigned Drivers"
              value={String(assignedDriversCount)}
            />
            <FleetMetricCard
              icon={<IconDeviceDesktop className="size-4" />}
              label="Devices Online"
              value={`${devicesOnline}/${devices.length}`}
            />
            <FleetMetricCard
              icon={<IconGasStation className="size-4" />}
              label="Fleet Capacity"
              value={`${totalCapacity}L`}
            />
          </div>

          <div className="overflow-hidden rounded-lg border bg-card/50">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Plate</TableHead>
                  <TableHead>Make/Model</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fuel Level</TableHead>
                  <TableHead>Device</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => {
                  const live = liveStates[vehicle.vehicleId]
                  const fuelPercent =
                    live?.fuelPercent ?? vehicle.currentState?.fuelPercent
                  const deviceStatus =
                    live?.deviceStatus ??
                    vehicle.currentState?.deviceStatus ??
                    vehicle.assignedDevice?.status ??
                    "offline"

                  return (
                    <TableRow
                      key={vehicle.vehicleId}
                      className="cursor-pointer"
                      tabIndex={0}
                      onClick={() =>
                        router.push(`/dashboard/vehicles/${vehicle.vehicleId}`)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault()
                          router.push(
                            `/dashboard/vehicles/${vehicle.vehicleId}`
                          )
                        }
                      }}
                    >
                      <TableCell className="font-medium">
                        {vehicle.label}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {vehicle.plateNumber}
                      </TableCell>
                      <TableCell>
                        {formatMakeModel(vehicle.make, vehicle.model)}
                      </TableCell>
                      <TableCell>
                        {vehicle.assignedDriver?.fullName ?? "Unassigned"}
                      </TableCell>
                      <TableCell>
                        {formatCapacity(vehicle.tankCapacityLiters)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={vehicle.status} />
                      </TableCell>
                      <TableCell>
                        <FuelLevel value={fuelPercent} />
                      </TableCell>
                      <TableCell>
                        <DeviceBadge status={deviceStatus} />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <section className="rounded-lg border bg-card/40 p-4">
            <h2 className="mb-4 font-heading text-sm font-semibold">
              Vehicle Details
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((vehicle) => {
                const live = liveStates[vehicle.vehicleId]
                const deviceStatus =
                  live?.deviceStatus ??
                  vehicle.currentState?.deviceStatus ??
                  vehicle.assignedDevice?.status ??
                  "offline"
                const fuelLiters =
                  live?.fuelLiters ?? vehicle.currentState?.fuelLiters
                const fuelPercent =
                  live?.fuelPercent ?? vehicle.currentState?.fuelPercent

                return (
                  <Link
                    key={vehicle.vehicleId}
                    href={`/dashboard/vehicles/${vehicle.vehicleId}`}
                    className="rounded-lg border bg-background/40 p-4 transition-colors hover:bg-muted/40"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="font-heading text-sm font-semibold">
                        {vehicle.label}
                      </h3>
                      <StatusBadge status={vehicle.status} />
                    </div>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <VehicleFact label="Plate" value={vehicle.plateNumber} />
                      <VehicleFact
                        label="Make/Model"
                        value={formatMakeModel(vehicle.make, vehicle.model)}
                      />
                      <VehicleFact
                        label="Year"
                        value={formatNumber(vehicle.year)}
                      />
                      <VehicleFact
                        label="Color"
                        value={vehicle.color ?? UNKNOWN_VALUE}
                      />
                      <VehicleFact
                        label="Driver"
                        value={vehicle.assignedDriver?.fullName ?? "Unassigned"}
                      />
                      <VehicleFact
                        label="Device"
                        value={
                          vehicle.assignedDevice?.deviceId ?? UNKNOWN_VALUE
                        }
                      />
                      <VehicleFact
                        label="Firmware"
                        value={findFirmware(
                          devices,
                          vehicle.assignedDevice?.deviceId
                        )}
                      />
                      <VehicleFact
                        label="Tank"
                        value={formatCapacity(tankCapacityMap[vehicle.vehicleId] ?? vehicle.tankCapacityLiters)}
                      />
                      <VehicleFact
                        label="Fuel"
                        value={formatFuel(fuelLiters, fuelPercent)}
                      />
                      <VehicleFact
                        label="Device Status"
                        value={capitalize(deviceStatus)}
                      />
                    </dl>
                  </Link>
                )
              })}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function FleetMetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-heading text-2xl font-bold tracking-tight">
        {value}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase()
  const className =
    normalized === "active"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
      : normalized === "maintenance"
        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
        : "bg-muted text-muted-foreground"

  return <Badge className={className}>{normalized}</Badge>
}

function DeviceBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase()
  const isOnline = normalized === "online"

  return (
    <Badge
      className={
        isOnline
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
      }
    >
      {normalized}
    </Badge>
  )
}

function FuelLevel({ value }: { value: number | null | undefined }) {
  if (value == null) {
    return <span className="text-muted-foreground">{UNKNOWN_VALUE}</span>
  }

  const percentage = Math.max(0, Math.min(100, Math.round(value)))
  const barColor =
    percentage < 25
      ? "bg-red-400"
      : percentage < 50
        ? "bg-amber-400"
        : "bg-fuchsia-300"

  return (
    <div className="flex min-w-28 items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-xs text-muted-foreground tabular-nums">
        {percentage}%
      </span>
    </div>
  )
}

function VehicleFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="inline text-xs font-medium text-muted-foreground">
        {label}:{" "}
      </dt>
      <dd className="inline text-xs font-semibold wrap-break-word">{value}</dd>
    </div>
  )
}

function formatMakeModel(make: string | null, model: string | null) {
  return [make, model].filter(Boolean).join(" ") || UNKNOWN_VALUE
}

function formatCapacity(capacity: number | null | undefined) {
  return capacity ? `${capacity}L` : UNKNOWN_VALUE
}

function formatNumber(value: number | null | undefined) {
  return value == null ? UNKNOWN_VALUE : String(value)
}

function formatFuel(
  liters: number | null | undefined,
  percent: number | null | undefined
) {
  if (liters == null && percent == null) return UNKNOWN_VALUE
  const litersText = liters == null ? null : `${Math.round(liters)}L`
  const percentText = percent == null ? null : `${Math.round(percent)}%`

  return [litersText, percentText].filter(Boolean).join(" / ")
}

function findFirmware(
  devices: { deviceId: string; firmwareVersion: string | null }[],
  deviceId: string | undefined
) {
  if (!deviceId) return UNKNOWN_VALUE
  return (
    devices.find((device) => device.deviceId === deviceId)?.firmwareVersion ??
    UNKNOWN_VALUE
  )
}

function capitalize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : UNKNOWN_VALUE
}
