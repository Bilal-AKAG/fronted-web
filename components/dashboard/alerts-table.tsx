"use client"

import { alerts, vehicles } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const severityVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  low: "default",
  medium: "secondary",
  high: "destructive",
  critical: "destructive",
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  open: "destructive",
  acknowledged: "secondary",
  resolved: "outline",
}

const recentAlerts = [...alerts]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 8)

export function AlertsTable() {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Message</TableHead>
            <TableHead className="hidden sm:table-cell">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentAlerts.map((a) => (
            <TableRow key={a.alertId}>
              <TableCell className="font-medium">
                {vehicles.find((v) => v.vehicleId === a.vehicleId)?.label ?? a.vehicleId}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[10px]">
                  {a.type.replace(/_/g, " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={severityVariant[a.severity]} className="text-[10px]">
                  {a.severity}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[a.status] ?? "outline"} className="text-[10px]">
                  {a.status}
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate text-xs text-muted-foreground hidden md:table-cell">
                {a.message}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                {new Date(a.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
