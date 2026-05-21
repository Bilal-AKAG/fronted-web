import { apiClient } from "./client"

export interface DeviceItem {
  deviceId: string
  vehicleId: string | null
  firmwareVersion: string | null
  lastSeenAt: string | null
  status: string
  registeredAt: string
  registeredBy: string
}

interface ListDevicesResponse {
  success: true
  devices: DeviceItem[]
  count: number
}

export interface DeviceDetail {
  deviceId: string
  vehicleId: string | null
  firmwareVersion: string | null
  lastSeenAt: string | null
  status: string
  registeredAt: string
  registeredBy: string
  vehicle: { vehicleId: string; plateNumber: string; label: string } | null
}

export interface CreateDevicePayload {
  deviceId: string
  vehicleId?: string
  firmwareVersion?: string
}

export interface UpdateDevicePayload {
  vehicleId?: string | null
  firmwareVersion?: string
}

interface GetDeviceResponse {
  success: true
  device: DeviceDetail
}

export async function fetchDevice(deviceId: string): Promise<GetDeviceResponse> {
  return apiClient<GetDeviceResponse>(`/api/devices/${deviceId}`)
}

export async function createDevice(data: CreateDevicePayload): Promise<{ success: true; device: DeviceDetail }> {
  return apiClient("/api/devices", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateDevice(
  deviceId: string,
  data: UpdateDevicePayload
): Promise<{ success: true; device: DeviceDetail }> {
  return apiClient(`/api/devices/${deviceId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function fetchDevices(): Promise<ListDevicesResponse> {
  return apiClient<ListDevicesResponse>("/api/devices")
}
