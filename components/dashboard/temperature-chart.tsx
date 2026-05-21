"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

export interface TemperatureChartProps {
  data: Array<{ time: string; temp: number }>
  vehicleLabel?: string
  isLoading?: boolean
}

const config = {
  temp: {
    label: "Temperature",
    color: "var(--color-chart-3)",
  },
}

export function TemperatureChart({ data, vehicleLabel = "Vehicle", isLoading = false }: TemperatureChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Temperature Over Time (Last 8h)</CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Temperature Over Time (Last 8h)</CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          No data available for {vehicleLabel}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Temperature Over Time (Last 8h) — {vehicleLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-[3/1] max-h-64 w-full">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}°C`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="temp"
              stroke={config.temp.color}
              strokeWidth={2}
              dot={false}
              name={config.temp.label}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
