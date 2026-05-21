"use client"

import { useAllTrips } from "@/hooks/use-trips"
import { IconRoute } from "@tabler/icons-react"

const statusStyles: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-muted text-muted-foreground",
}

export default function TripsPage() {
  const { trips, isLoading } = useAllTrips({ limit: 10 })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-bold">Trips</h1>
        <p className="text-sm text-muted-foreground">All trips across the fleet</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
      ) : trips.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">No trips recorded.</div>
      ) : (
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Trip</th>
                  <th className="px-4 py-3 font-medium">Vehicle</th>
                  <th className="px-4 py-3 font-medium">Driver</th>
                  <th className="px-4 py-3 font-medium">Start</th>
                  <th className="px-4 py-3 font-medium">End</th>
                  <th className="px-4 py-3 font-medium">Fuel Used</th>
                  <th className="px-4 py-3 font-medium">Distance</th>
                  <th className="px-4 py-3 font-medium">Avg Speed</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((t) => (
                  <tr key={t.tripId} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <IconRoute className="size-4 text-muted-foreground" />
                        <span className="font-mono text-xs font-medium">{t.tripId}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{t.vehicleId}</td>
                    <td className="px-4 py-3">{t.driver?.fullName ?? "—"}</td>
                    <td className="px-4 py-3 text-xs">{new Date(t.startTime).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs">{t.endTime ? new Date(t.endTime).toLocaleString() : "—"}</td>
                    <td className="px-4 py-3">{t.fuelUsedLiters != null ? `${t.fuelUsedLiters.toFixed(1)}L` : "—"}</td>
                    <td className="px-4 py-3">{t.distanceKm != null ? `${t.distanceKm.toFixed(1)} km` : "—"}</td>
                    <td className="px-4 py-3">{t.avgSpeedKmh != null ? `${t.avgSpeedKmh.toFixed(1)} km/h` : "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[t.status] ?? ""}`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
