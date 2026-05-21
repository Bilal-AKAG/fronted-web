"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"

export interface TripDistanceChartProps {
  data: Array<{ vehicle: string; distanceKm: number }>
  isLoading?: boolean
}

const config = {
  distanceKm: {
    label: "Distance (km)",
    color: "var(--color-chart-2)",
  },
}

export function TripDistanceChart({ data, isLoading = false }: TripDistanceChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Trip Distance by Vehicle</CardTitle>
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
          <CardTitle className="text-sm">Trip Distance by Vehicle</CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          No trip data available.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Trip Distance by Vehicle</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-[3/1] max-h-64 w-full">
          <BarChart data={data} margin={{ bottom: 20, left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="vehicle" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v} km`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="distanceKm" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
