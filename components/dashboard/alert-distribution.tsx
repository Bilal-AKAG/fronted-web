"use client"

import { alerts } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell } from "recharts"

const severityColors: Record<string, string> = {
  low: "var(--color-chart-1)",
  medium: "var(--color-chart-2)",
  high: "var(--color-chart-4)",
  critical: "var(--destructive)",
}

const config: Record<string, { label: string; color: string }> = {}
for (const [sev, color] of Object.entries(severityColors)) {
  config[sev] = { label: sev.charAt(0).toUpperCase() + sev.slice(1), color }
}

const severityCounts: Record<string, number> = {}
for (const a of alerts) {
  severityCounts[a.severity] = (severityCounts[a.severity] ?? 0) + 1
}

const chartData = Object.entries(severityCounts).map(([severity, count]) => ({
  severity,
  count,
  fill: severityColors[severity],
}))

export function AlertDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Alert Severity Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto aspect-square max-h-56 w-full">
          <PieChart>
            <Pie data={chartData} dataKey="count" nameKey="severity" outerRadius={80} label>
              {chartData.map((entry) => (
                <Cell key={entry.severity} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
