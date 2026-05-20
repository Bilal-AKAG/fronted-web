"use client"

import { useRouter } from "next/navigation"
import { drivers, vehicles, violations } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function getDriverStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">Active</Badge>
    case "suspended":
      return <Badge className="bg-red-500">Suspended</Badge>
    case "inactive":
      return <Badge className="bg-gray-500">Inactive</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getVehicleLabel(vehicleId: string | null) {
  if (!vehicleId) return <span className="text-muted-foreground">Unassigned</span>
  const vehicle = vehicles.find((v) => v.vehicleId === vehicleId)
  return vehicle?.label ?? "Unknown"
}

function getDriverViolationsCount(driverId: string) {
  return violations.filter((v) => v.driverId === driverId).length
}

export default function DriversPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-bold">Drivers</h1>
        <p className="text-sm text-muted-foreground">Manage driver records and assignments</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drivers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {drivers.filter((d) => d.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {drivers.filter((d) => d.status === "suspended").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{violations.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>License Number</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Assigned Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Violations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => {
                const vehicle = vehicles.find((v) => v.assignedDriverId === driver.driverId)
                const violationCount = getDriverViolationsCount(driver.driverId)
                return (
                  <TableRow
                    key={driver.driverId}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/dashboard/drivers/${driver.driverId}`)}
                  >
                    <TableCell className="font-medium">{driver.driverId}</TableCell>
                    <TableCell>{driver.fullName}</TableCell>
                    <TableCell>{driver.licenseNumber}</TableCell>
                    <TableCell>{driver.phoneNumber ?? "-"}</TableCell>
                    <TableCell>{getVehicleLabel(vehicle?.vehicleId ?? null)}</TableCell>
                    <TableCell>{getDriverStatusBadge(driver.status)}</TableCell>
                    <TableCell>
                      {violationCount > 0 ? (
                        <Badge variant="destructive">{violationCount}</Badge>
                      ) : (
                        <Badge variant="outline">0</Badge>
                      )}
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