"use client"

import { trips, vehicles } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const recentTrips = [...trips]
  .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
  .slice(0, 6)

export function TripsTable() {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Distance</TableHead>
            <TableHead>Fuel Used</TableHead>
            <TableHead>Avg Speed</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentTrips.map((t) => {
            const vehicle = vehicles.find((v) => v.vehicleId === t.vehicleId)
            return (
              <TableRow key={t.tripId}>
                <TableCell className="font-medium">{vehicle?.label ?? t.vehicleId}</TableCell>
                <TableCell>{t.driver?.fullName ?? "-"}</TableCell>
                <TableCell>{t.distanceKm ? `${t.distanceKm.toFixed(1)} km` : "-"}</TableCell>
                <TableCell>{t.fuelUsedLiters ? `${t.fuelUsedLiters.toFixed(1)} L` : "-"}</TableCell>
                <TableCell>{t.avgSpeedKmh ? `${t.avgSpeedKmh.toFixed(1)} km/h` : "-"}</TableCell>
                <TableCell>
                  <Badge variant={t.status === "active" ? "default" : "outline"} className="text-[10px]">
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
                  {new Date(t.startTime).toLocaleDateString([], { month: "short", day: "numeric" })}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
