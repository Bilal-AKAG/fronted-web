"use client"

import { use } from "react"
import Link from "next/link"
import { drivers, violations } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconArrowLeft } from "@tabler/icons-react"

function getViolationSeverityBadge(severity: string) {
  switch (severity) {
    case "critical":
      return <Badge className="bg-red-600">Critical</Badge>
    case "warning":
      return <Badge className="bg-yellow-500">Warning</Badge>
    case "info":
      return <Badge className="bg-blue-500">Info</Badge>
    default:
      return <Badge variant="outline">{severity}</Badge>
  }
}

function getViolationTypeBadge(type: string) {
  const typeLabels: Record<string, string> = {
    OVERSPEED: "Overspeed",
    FUEL_DROP: "Fuel Drop",
    DOOR_OPEN_PARKED: "Door Open Parked",
    GEOFENCE_VIOLATION: "Geofence Violation",
  }
  return <span>{typeLabels[type] ?? type}</span>
}

export default function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const driver = drivers.find((d) => d.driverId === id)
  const driverViolations = violations.filter((v) => v.driverId === id)

  if (!driver) {
    return (
      <div className="flex flex-col gap-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/drivers">
            <IconArrowLeft className="size-4 mr-2" />
            Back to Drivers
          </Link>
        </Button>
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold">Driver not found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" asChild>
        <Link href="/dashboard/drivers">
          <IconArrowLeft className="size-4 mr-2" />
          Back to Drivers
        </Link>
      </Button>

      <div>
        <h1 className="font-heading text-xl font-bold">{driver.fullName}</h1>
        <p className="text-sm text-muted-foreground">Driver Details & Violation History</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Driver ID</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{driver.driverId}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">License Number</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{driver.licenseNumber}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Phone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{driver.phoneNumber ?? "N/A"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              className={
                driver.status === "active"
                  ? "bg-green-500"
                  : driver.status === "suspended"
                    ? "bg-red-500"
                    : "bg-gray-500"
              }
            >
              {driver.status}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Violation History ({driverViolations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {driverViolations.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No violations found for this driver.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Violation ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {driverViolations.map((violation) => (
                  <TableRow key={violation.violationId}>
                    <TableCell className="font-medium">{violation.violationId}</TableCell>
                    <TableCell>{getViolationTypeBadge(violation.type)}</TableCell>
                    <TableCell>{getViolationSeverityBadge(violation.severity)}</TableCell>
                    <TableCell>{violation.vehicleLabel}</TableCell>
                    <TableCell className="max-w-md">{violation.description}</TableCell>
                    <TableCell>{new Date(violation.occurredAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}