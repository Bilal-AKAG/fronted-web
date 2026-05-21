"use client"

import { useQueries } from "@tanstack/react-query"
import { fetchTripsByVehicle, TripItem } from "@/lib/api/trips"
import { useVehicles } from "./use-vehicles"

export function useAllTrips(options?: { status?: string; limit?: number }) {
  const { data: vehiclesData } = useVehicles()

  const vehicleIds = vehiclesData?.vehicles?.map((v) => v.vehicleId) ?? []

  const tripQueries = useQueries({
    queries: vehicleIds.map((id) => ({
      queryKey: ["vehicle-trips", id, options],
      queryFn: () => fetchTripsByVehicle(id, options),
      enabled: !!id,
    })),
  })

  const isLoading = tripQueries.some((q) => q.isLoading)
  const allTrips: TripItem[] = []

  for (const q of tripQueries) {
    if (q.data?.trips) {
      allTrips.push(...q.data.trips)
    }
  }

  allTrips.sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  )

  return { trips: allTrips, isLoading }
}
