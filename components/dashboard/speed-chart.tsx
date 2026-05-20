"use client"

import { telemetryHistory, vehicles } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

const colors = ["var(--color-chart-4)", "var(--color-chart-5)", "var(--color-chart-1)"]

const config: Record<string, { label: string; color: string }> = {}
const dataMap: Record<string, { time: string; speed: number }[]> = {}

const vehicleIds = vehicles.map((v) => v.vehicleId)

for (const vId of vehicleIds) {
  config[vId] = { label: vehicles.find((v) => v.vehicleId === vId)!.label, color: colors[vehicleIds.indexOf(vId)] }
  dataMap[vId] = telemetryHistory
    .filter((t) => t.vehicleId === vId)
    .slice(-96)
    .map((t) => ({
      time: new Date(t.receivedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      speed: t.speedKmh,
    }))
}

const maxLen = Math.max(...Object.values(dataMap).map((d) => d.length))
const mergedData = Array.from({ length: maxLen }, (_, i) => {
  const row: Record<string, string | number> = { time: dataMap[vehicleIds[0]][i]?.time ?? "" }
  for (const vId of vehicleIds) {
    row[vId] = dataMap[vId][i]?.speed ?? 0
  }
  return row
})

export function SpeedChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Speed Over Time (Last 8h)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-[3/1] max-h-64 w-full">
          <LineChart data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v} km/h`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {vehicleIds.map((vId) => (
              <Line
                key={vId}
                type="monotone"
                dataKey={vId}
                stroke={config[vId].color}
                strokeWidth={2}
                dot={false}
                name={config[vId].label}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
