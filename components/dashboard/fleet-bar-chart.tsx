"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts"

export interface FleetBarChartProps {
  title: string
  data: Array<{ label: string; value: number }>
  dataKey: string
  unit: string
  color?: string
  domain?: [number, number]
  cellColors?: boolean
  getBarColor?: (value: number) => string
  isLoading?: boolean
}

const defaultConfig = {
  value: {
    label: "Value",
    color: "var(--color-chart-1)",
  },
}

export function FleetBarChart({
  title,
  data,
  dataKey,
  unit,
  color = "var(--color-chart-1)",
  domain,
  cellColors = false,
  getBarColor,
  isLoading = false,
}: FleetBarChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{title}</CardTitle>
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
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          No data available.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={defaultConfig} className="aspect-[3/1] max-h-64 w-full">
          <BarChart data={data} margin={{ bottom: 20, left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={50} />
            <YAxis
              domain={domain ?? [0, "auto"]}
              tick={{ fontSize: 11 }}
              tickFormatter={(v: number) => `${v}${unit}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey={dataKey} radius={[4, 4, 0, 0]} barSize={24}>
              {cellColors && data.map((entry, i) => (
                <Cell key={i} fill={getBarColor ? getBarColor(entry.value) : color} />
              ))}
              {!cellColors && data.map((_, i) => <Cell key={i} fill={color} />)}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
