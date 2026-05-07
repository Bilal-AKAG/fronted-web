"use client"

import { predictions, vehicles } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function Predictions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {predictions.map((p) => {
        const vehicle = vehicles.find((v) => v.vehicleId === p.vehicleId)
        const confidencePct = Math.round(p.confidence * 100)
        return (
          <Card key={p.predictionId}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs text-muted-foreground">
                  {p.type === "FUEL_FORECAST" ? "Fuel Forecast" : "Anomaly Score"}
                </CardTitle>
                <Badge variant={confidencePct > 80 ? "default" : "secondary"} className="text-[10px]">
                  {confidencePct}% confidence
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-xl font-bold">
                {p.type === "FUEL_FORECAST" ? `${p.value.toFixed(1)}L` : `${p.value.toFixed(0)}%`}
              </p>
              <p className="text-xs text-muted-foreground">
                {vehicle?.label} &middot;{" "}
                {new Date(p.generatedAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit" })}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
