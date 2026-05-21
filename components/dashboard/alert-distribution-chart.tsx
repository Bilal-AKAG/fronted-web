"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts"

export interface AlertDistributionChartProps {
  data: Array<{ severity: string; count: number }>
  isLoading?: boolean
}

const config = {
  count: {
    label: "Count",
    color: "var(--color-chart-1)",
  },
}

const severityColors: Record<string, string> = {
  critical: "var(--color-chart-5)",
  warning: "var(--color-chart-4)",
  info: "var(--color-chart-3)",
}

export function AlertDistributionChart({ data, isLoading = false }: AlertDistributionChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Alert Severity Distribution</CardTitle>
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
          <CardTitle className="text-sm">Alert Severity Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          No alerts recorded.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Alert Severity Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-[3/1] max-h-64 w-full">
          <BarChart data={data} margin={{ bottom: 0, left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="severity" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={48}>
              {data.map((entry) => (
                <Cell key={entry.severity} fill={severityColors[entry.severity] ?? "var(--color-chart-2)"} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
