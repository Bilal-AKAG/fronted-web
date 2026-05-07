"use client"

import { useState } from "react"
import { alerts, vehicles } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { IconSearch, IconAlertCircle, IconCheck, IconX } from "@tabler/icons-react"

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

const alertTypeCounts: Record<string, number> = {}
for (const a of alerts) {
  const label = a.type.replace(/_/g, " ")
  alertTypeCounts[label] = (alertTypeCounts[label] ?? 0) + 1
}

const typeChartData = Object.entries(alertTypeCounts).map(([type, count]) => ({
  type,
  count,
}))

const typeConfig: Record<string, { label: string; color: string }> = {
  "SUSPECTED FUEL DROP": { label: "Fuel Drop", color: "var(--color-chart-4)" },
  "LOW FUEL": { label: "Low Fuel", color: "var(--color-chart-2)" },
  "DEVICE OFFLINE": { label: "Offline", color: "var(--color-chart-5)" },
  "FUEL REFILL": { label: "Refill", color: "var(--color-chart-1)" },
}

export default function AlertsPage() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const filtered = alerts
    .filter((a) => filterStatus === null || a.status === filterStatus)
    .filter(
      (a) =>
        a.message.toLowerCase().includes(search.toLowerCase()) ||
        a.type.toLowerCase().includes(search.toLowerCase()) ||
        a.vehicleId.toLowerCase().includes(search.toLowerCase()),
    )

  const openCount = alerts.filter((a) => a.status === "open").length
  const acknowledgedCount = alerts.filter((a) => a.status === "acknowledged").length
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-bold">Alerts</h1>
        <p className="text-sm text-muted-foreground">Monitor and manage fleet alerts</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconAlertCircle className="size-4 text-destructive" />
              Open
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold text-destructive">{openCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconCheck className="size-4 text-chart-2" />
              Acknowledged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">{acknowledgedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <IconX className="size-4 text-muted-foreground" />
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">{resolvedCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Alerts by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={typeConfig} className="aspect-[3/1] max-h-48 w-full">
              <BarChart data={typeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="type" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-chart-4)" radius={4} name="Count" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">By Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {vehicles.map((v) => {
                const count = alerts.filter(
                  (a) => a.vehicleId === v.vehicleId && a.status === "open",
                ).length
                return (
                  <div key={v.vehicleId} className="flex items-center justify-between text-sm">
                    <span>{v.label}</span>
                    <Badge variant={count > 0 ? "destructive" : "outline"} className="text-[10px]">
                      {count} {count === 1 ? "alert" : "alerts"}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <IconSearch className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {[null, "open", "acknowledged", "resolved"].map((s) => (
            <Button
              key={s ?? "all"}
              variant={filterStatus === s ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(s)}
            >
              {s ?? "All"}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Message</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="w-20">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No alerts match your filters
                </TableCell>
              </TableRow>
            )}
            {filtered.map((a) => (
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
                  {new Date(a.createdAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-xs" disabled={a.status !== "open"}>
                      <IconCheck className="size-3" />
                    </Button>
                    <Button variant="ghost" size="icon-xs" disabled={a.status === "resolved"}>
                      <IconX className="size-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
