import { apiClient } from "./client"

export interface TripItem {
  tripId: string
  vehicleId: string
  driver: { driverId: string; fullName: string } | null
  startTime: string
  endTime: string | null
  startFuelLiters: number
  endFuelLiters: number | null
  fuelUsedLiters: number | null
  distanceKm: number | null
  avgSpeedKmh: number | null
  maxSpeedKmh: number | null
  status: string
}

interface ListTripsResponse {
  success: true
  vehicleId: string
  count: number
  trips: TripItem[]
}

export async function fetchTripsByVehicle(
  vehicleId: string,
  options?: { status?: string; limit?: number }
): Promise<ListTripsResponse> {
  const params = new URLSearchParams()
  if (options?.status) params.set("status", options.status)
  if (options?.limit) params.set("limit", String(options.limit))
  const qs = params.toString()
  return apiClient<ListTripsResponse>(
    `/api/vehicles/${vehicleId}/trips${qs ? `?${qs}` : ""}`
  )
}
