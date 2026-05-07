"use client"

import { trips, vehicles } from "@/lib/mock-data"
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
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Distance</TableHead>
            <TableHead>Fuel Used</TableHead>
            <TableHead>Avg Speed</TableHead>
            <TableHead className="hidden sm:table-cell">Duration</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentTrips.map((t) => {
            const vehicle = vehicles.find((v) => v.vehicleId === t.vehicleId)
            const durationMs = new Date(t.endTime).getTime() - new Date(t.startTime).getTime()
            const durationMin = Math.round(durationMs / 60000)
            return (
              <TableRow key={t.tripId}>
                <TableCell className="font-medium">{vehicle?.label ?? t.vehicleId}</TableCell>
                <TableCell>{t.distanceKm} km</TableCell>
                <TableCell>{t.fuelUsedLiters} L</TableCell>
                <TableCell>{t.avgSpeedKph} km/h</TableCell>
                <TableCell className="hidden sm:table-cell">{durationMin} min</TableCell>
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
