"use client"

import { summary } from "@/lib/mock-data"
import {
  IconTruck,
  IconBell,
  IconGasStation,
  IconDeviceDesktop,
  IconAlertTriangle,
} from "@tabler/icons-react"

const devicesTotal = summary.devicesOnline + summary.devicesStale + summary.devicesOffline

const cards = [
  { label: "Total Vehicles", value: summary.totalVehicles, icon: IconTruck },
  { label: "Active Vehicles", value: summary.activeVehicles, icon: IconTruck },
  { label: "Active Alerts", value: summary.activeAlerts, icon: IconBell },
  { label: "Critical Alerts", value: summary.criticalAlerts, icon: IconAlertTriangle },
  { label: "Fleet Fuel Avg", value: `${summary.fleetFuelAvgPercent}%`, icon: IconGasStation },
  { label: "Devices Online", value: `${summary.devicesOnline}/${devicesTotal}`, icon: IconDeviceDesktop },
  { label: "Active Trips", value: summary.activeTrips, icon: IconTruck },
]

export function SummaryCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="flex items-center gap-3 rounded-lg border p-4">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            <card.icon className="size-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className="font-heading text-xl font-bold">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
