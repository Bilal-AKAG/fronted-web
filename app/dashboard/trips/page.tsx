"use client"

import { trips, vehicles } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function getVehicleLabel(vehicleId: string) {
  const vehicle = vehicles.find((v) => v.vehicleId === vehicleId)
  return vehicle?.label ?? "Unknown"
}

function getTripStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">Active</Badge>
    case "completed":
      return <Badge className="bg-blue-500">Completed</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function TripsPage() {
  const activeTrips = trips.filter((t) => t.status === "active")
  const completedTrips = trips.filter((t) => t.status === "completed")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-bold">Trips</h1>
        <p className="text-sm text-muted-foreground">All trips across the fleet</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeTrips.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{completedTrips.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trips.reduce((sum, t) => sum + (t.distanceKm ?? 0), 0).toFixed(1)} km
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Trips</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trip ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Fuel Used</TableHead>
                <TableHead>Avg Speed</TableHead>
                <TableHead>Max Speed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map((trip) => (
                <TableRow key={trip.tripId}>
                  <TableCell className="font-medium">{trip.tripId}</TableCell>
                  <TableCell>{getVehicleLabel(trip.vehicleId)}</TableCell>
                  <TableCell>{trip.driver?.fullName ?? "Unassigned"}</TableCell>
                  <TableCell>{new Date(trip.startTime).toLocaleString()}</TableCell>
                  <TableCell>
                    {trip.endTime ? new Date(trip.endTime).toLocaleString() : "-"}
                  </TableCell>
                  <TableCell>{trip.distanceKm ? `${trip.distanceKm.toFixed(1)} km` : "-"}</TableCell>
                  <TableCell>
                    {trip.fuelUsedLiters ? `${trip.fuelUsedLiters.toFixed(1)} L` : "-"}
                  </TableCell>
                  <TableCell>{trip.avgSpeedKmh ? `${trip.avgSpeedKmh.toFixed(1)} km/h` : "-"}</TableCell>
                  <TableCell>{trip.maxSpeedKmh ? `${trip.maxSpeedKmh.toFixed(1)} km/h` : "-"}</TableCell>
                  <TableCell>{getTripStatusBadge(trip.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}