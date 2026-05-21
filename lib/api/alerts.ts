import { apiClient } from "./client"

export interface AlertItem {
  alertId: string
  vehicleId: string
  driverId: string | null
  driver: { driverId: string; fullName: string } | null
  type: string
  severity: string
  status: string
  message: string
  evidence: Record<string, unknown>
  createdAt: string
  resolvedAt: string | null
}

interface ListAlertsResponse {
  success: true
  count: number
  total: number
  alerts: AlertItem[]
}

export interface AlertDetail extends AlertItem {
  vehicle: { vehicleId: string; plateNumber: string; label: string } | null
  resolvedBy: string | null
}

export async function fetchAlert(alertId: string): Promise<{ success: true; alert: AlertDetail }> {
  return apiClient(`/api/alerts/${alertId}`)
}

export async function fetchAlerts(status?: string): Promise<ListAlertsResponse> {
  const params = status && status !== "all" ? `?status=${status}` : ""
  return apiClient<ListAlertsResponse>(`/api/alerts${params}`)
}

export async function resolveAlert(
  alertId: string,
  status: "acknowledged" | "resolved"
): Promise<{ success: true; alertId: string; status: string }> {
  return apiClient(`/api/alerts/${alertId}/resolve`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}
