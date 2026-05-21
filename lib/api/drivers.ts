import { apiClient } from "./client"

export interface DriverItem {
  driverId: string
  fullName: string
  licenseNumber: string
  phoneNumber: string | null
  status: string
  createdAt: string
}

interface ListDriversResponse {
  success: true
  drivers: DriverItem[]
  count: number
}

export interface DriverDetail extends DriverItem {
  assignedVehicle: { vehicleId: string; plateNumber: string; label: string } | null
  totalTrips: number
  totalViolations: number
}

export interface CreateDriverPayload {
  fullName: string
  licenseNumber: string
  phoneNumber?: string
}

export interface UpdateDriverPayload {
  fullName?: string
  phoneNumber?: string
  status?: string
}

export async function createDriver(data: CreateDriverPayload): Promise<{ success: true; driver: DriverItem }> {
  return apiClient("/api/drivers", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateDriver(
  driverId: string,
  data: UpdateDriverPayload
): Promise<{ success: true; driver: DriverItem }> {
  return apiClient(`/api/drivers/${driverId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function fetchDrivers(): Promise<ListDriversResponse> {
  return apiClient<ListDriversResponse>("/api/drivers")
}

export async function fetchDriver(
  driverId: string
): Promise<{ success: true; driver: DriverItem }> {
  return apiClient(`/api/drivers/${driverId}`)
}

export async function fetchDriverViolations(
  driverId: string
): Promise<{
  success: true
  driverId: string
  driver: DriverItem
  violations: Array<{
    violationId: string
    driverId: string
    vehicleId: string
    vehicleLabel: string
    alertId: string
    tripId: string | null
    type: string
    severity: string
    description: string
    occurredAt: string
  }>
  count: number
}> {
  return apiClient(`/api/drivers/${driverId}/violations`)
}
