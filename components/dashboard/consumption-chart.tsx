"use client"

import { trips, vehicles } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

const colorMap: Record<string, string> = {
  V001: "var(--color-chart-1)",
  V002: "var(--color-chart-2)",
  V003: "var(--color-chart-3)",
}

const config: Record<string, { label: string; color: string }> = {}
for (const v of vehicles) {
  config[v.vehicleId] = { label: v.label, color: colorMap[v.vehicleId] }
}

const chartData = trips
  .filter((t) => t.fuelUsedLiters !== null)
  .map((t) => ({
    trip: t.tripId.replace("TRP-", "T"),
    [t.vehicleId]: t.fuelUsedLiters,
    vehicleId: t.vehicleId,
  }))

export function ConsumptionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Fuel Consumption by Trip</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-[3/1] max-h-64 w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="trip" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}L`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {vehicles.map((v) => (
              <Bar key={v.vehicleId} dataKey={v.vehicleId} fill={colorMap[v.vehicleId]} name={v.label} radius={4} />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
