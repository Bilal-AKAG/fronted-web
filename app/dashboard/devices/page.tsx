"use client"

import { devices, vehicles } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function getDeviceStatusBadge(status: string) {
  switch (status) {
    case "online":
      return <Badge className="bg-green-500">Online</Badge>
    case "stale":
      return <Badge className="bg-yellow-500">Stale</Badge>
    case "offline":
      return <Badge className="bg-red-500">Offline</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getVehicleLabel(vehicleId: string | null) {
  if (!vehicleId) return <span className="text-muted-foreground">Unassigned</span>
  const vehicle = vehicles.find((v) => v.vehicleId === vehicleId)
  return vehicle?.label ?? "Unknown"
}

export default function DevicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-bold">Devices</h1>
        <p className="text-sm text-muted-foreground">Manage ESP32 hardware devices</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {devices.filter((d) => d.status === "online").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {devices.filter((d) => d.status === "offline").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device ID</TableHead>
                <TableHead>Assigned Vehicle</TableHead>
                <TableHead>Firmware</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => {
                return (
                  <TableRow key={device.deviceId}>
                    <TableCell className="font-medium">{device.deviceId}</TableCell>
                    <TableCell>{getVehicleLabel(device.vehicleId)}</TableCell>
                    <TableCell>{device.firmwareVersion ?? "Unknown"}</TableCell>
                    <TableCell>{getDeviceStatusBadge(device.status)}</TableCell>
                    <TableCell>
                      {device.lastSeenAt
                        ? new Date(device.lastSeenAt).toLocaleString()
                        : "Never"}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}