"use client"

import { vehicles, devices, latestStates } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconTruck, IconDeviceDesktop, IconGasStation, IconUser } from "@tabler/icons-react"

export default function VehiclesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-bold">Vehicles</h1>
        <p className="text-sm text-muted-foreground">Fleet vehicle inventory and status</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconTruck className="size-4" />
              Total Fleet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">{vehicles.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconUser className="size-4" />
              Assigned Drivers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">
              {vehicles.filter((v) => v.assignedDriver).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconDeviceDesktop className="size-4" />
              Devices Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">
              {devices.filter((d) => d.status === "online").length}/{devices.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconGasStation className="size-4" />
              Fleet Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">
              {vehicles.reduce((s, v) => s + v.tankCapacityLiters, 0)}L
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Plate</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fuel Level</TableHead>
              <TableHead>Device</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((v) => {
              const state = latestStates.find((s) => s.vehicleId === v.vehicleId)
              const device = devices.find((d) => d.vehicleId === v.vehicleId)
              return (
                <TableRow key={v.vehicleId}>
                  <TableCell className="font-medium">{v.label}</TableCell>
                  <TableCell className="font-mono text-xs">{v.plateNumber}</TableCell>
                  <TableCell>{v.assignedDriver}</TableCell>
                  <TableCell>{v.tankCapacityLiters}L</TableCell>
                  <TableCell>
                    <Badge variant={v.status === "active" ? "default" : "secondary"}>
                      {v.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${state?.fuelLevelPercent ?? 0}%`,
                            backgroundColor:
                              (state?.fuelLevelPercent ?? 0) > 50
                                ? "var(--color-chart-1)"
                                : (state?.fuelLevelPercent ?? 0) > 25
                                  ? "var(--color-chart-3)"
                                  : "var(--destructive)",
                          }}
                        />
                      </div>
                      <span className="text-xs">{state?.fuelLevelPercent.toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={device?.status === "online" ? "default" : "destructive"}
                      className="text-[10px]"
                    >
                      {device?.status ?? "N/A"}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="font-heading mb-3 font-semibold">Vehicle Details</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => {
            const state = latestStates.find((s) => s.vehicleId === v.vehicleId)
            const device = devices.find((d) => d.vehicleId === v.vehicleId)
            return (
              <div key={v.vehicleId} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-heading font-semibold">{v.label}</p>
                  <Badge variant={v.status === "active" ? "default" : "secondary"}>
                    {v.status}
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Plate: </span>
                    <span className="font-mono text-xs">{v.plateNumber}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Driver: </span>
                    <span>{v.assignedDriver}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Device: </span>
                    <span className="font-mono text-xs">{device?.deviceId}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Firmware: </span>
                    <span>{device?.firmwareVersion}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tank: </span>
                    <span>{v.tankCapacityLiters}L</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fuel: </span>
                    <span>
                      {state?.fuelLevelLiters.toFixed(1)}L ({state?.fuelLevelPercent.toFixed(0)}%)
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Engine: </span>
                    <Badge variant={state?.engineStatus === "ON" ? "default" : "outline"} className="text-[10px]">
                      {state?.engineStatus}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Seen: </span>
                    <span className="text-xs">
                      {state?.lastSeenAt
                        ? new Date(state.lastSeenAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>
                {state && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    GPS: {state.location.latitude.toFixed(4)}, {state.location.longitude.toFixed(4)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
