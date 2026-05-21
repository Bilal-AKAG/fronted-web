import { apiClient } from "./client"

export interface VehicleDriver {
  driverId: string
  fullName: string
}

export interface VehicleDevice {
  deviceId: string
  status: string
}

export interface VehicleCurrentState {
  vehicleId: string
  fuelPercent: number
  fuelLiters: number
  speedKmh: number
  engineOn: boolean
  doorOpen: boolean
  accelG: number
  tempCelsius: number
  fuelRateLhr: number
  latitude: number
  longitude: number
  locationName: string | null
  geofenceOk: boolean
  overspeedFlag: boolean
  parkingMode: boolean
  lastSeenAt: string
  deviceStatus: string
  currentAlertLevel: string
  activeTripId: string | null
}

export interface VehicleItem {
  vehicleId: string
  label: string
  plateNumber: string
  tankCapacityLiters?: number | null
  make: string | null
  model: string | null
  year?: number | null
  color?: string | null
  status: string
  assignedDriver: VehicleDriver | null
  assignedDevice: VehicleDevice | null
  currentState: VehicleCurrentState | null
}

export interface VehicleDetail {
  vehicleId: string
  plateNumber: string
  label: string
  tankCapacityLiters: number
  make: string | null
  model: string | null
  year: number | null
  color: string | null
  status: string
  assignedDriverId: string | null
  assignedDeviceId: string | null
  assignedDriver: VehicleDriver & { licenseNumber?: string } | null
  assignedDevice: { deviceId: string; firmwareVersion: string | null; status: string; lastSeenAt: string | null } | null
  currentState: VehicleCurrentState | null
  openAlertsCount: number
  createdAt: string
  updatedAt: string
}

interface ListVehiclesResponse {
  success: true
  count: number
  vehicles: VehicleItem[]
}

interface GetVehicleResponse {
  success: true
  vehicle: VehicleDetail
}

interface TelemetryRecord {
  telemetryId: string
  vehicleId: string
  receivedAt: string
  fuelLiters: number
  fuelPercent: number
  engineOn: boolean
  speedKmh: number
  fuelRateLhr: number
  tempCelsius: number
  latitude: number
  longitude: number
  [key: string]: unknown
}

interface VehicleHistoryResponse {
  success: true
  vehicleId: string
  count: number
  total: number
  offset: number
  records: TelemetryRecord[]
}

export interface CreateVehiclePayload {
  vehicleId?: string
  plateNumber: string
  label: string
  tankCapacityLiters: number
  make?: string
  model?: string
  year?: number
  color?: string
  assignedDriverId?: string
  assignedDeviceId?: string
}

export interface UpdateVehiclePayload {
  plateNumber?: string
  label?: string
  tankCapacityLiters?: number
  make?: string
  model?: string
  year?: number
  color?: string
  status?: string
  assignedDriverId?: string
  assignedDeviceId?: string
}

interface VehicleAlertsResponse {
  success: true
  count: number
  alerts: import("./alerts").AlertItem[]
}

export async function createVehicle(data: CreateVehiclePayload): Promise<{ success: true; vehicle: VehicleDetail }> {
  return apiClient("/api/vehicles", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateVehicle(
  vehicleId: string,
  data: UpdateVehiclePayload
): Promise<{ success: true; vehicle: VehicleDetail }> {
  return apiClient(`/api/vehicles/${vehicleId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function fetchVehicleAlerts(
  vehicleId: string,
  options?: { status?: string; severity?: string; limit?: number; offset?: number }
): Promise<VehicleAlertsResponse> {
  const params = new URLSearchParams()
  if (options?.status) params.set("status", options.status)
  if (options?.severity) params.set("severity", options.severity)
  if (options?.limit) params.set("limit", String(options.limit))
  if (options?.offset) params.set("offset", String(options.offset))
  const qs = params.toString()
  return apiClient<VehicleAlertsResponse>(`/api/vehicles/${vehicleId}/alerts${qs ? `?${qs}` : ""}`)
}

export async function fetchVehicles(
  status?: string,
  deviceStatus?: string
): Promise<ListVehiclesResponse> {
  const params = new URLSearchParams()
  if (status) params.set("status", status)
  if (deviceStatus) params.set("deviceStatus", deviceStatus)
  const qs = params.toString()
  return apiClient<ListVehiclesResponse>(`/api/vehicles${qs ? `?${qs}` : ""}`)
}

export async function fetchVehicle(vehicleId: string): Promise<GetVehicleResponse> {
  return apiClient<GetVehicleResponse>(`/api/vehicles/${vehicleId}`)
}

export async function fetchVehicleHistory(
  vehicleId: string,
  options?: { from?: string; to?: string; limit?: number; offset?: number; fields?: string }
): Promise<VehicleHistoryResponse> {
  const params = new URLSearchParams()
  if (options?.from) params.set("from", options.from)
  if (options?.to) params.set("to", options.to)
  if (options?.limit) params.set("limit", String(options.limit))
  if (options?.offset) params.set("offset", String(options.offset))
  if (options?.fields) params.set("fields", options.fields)
  const qs = params.toString()
  return apiClient<VehicleHistoryResponse>(`/api/vehicles/${vehicleId}/history${qs ? `?${qs}` : ""}`)
}
