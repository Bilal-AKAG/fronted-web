export interface Vehicle {
  vehicleId: string
  plateNumber: string
  label: string
  tankCapacityLiters: number
  make: string | null
  model: string | null
  year: number | null
  color: string | null
  assignedDriverId: string | null
  assignedDeviceId: string | null
  status: "active" | "inactive" | "maintenance"
  createdAt: string
  updatedAt: string
}

export interface Device {
  deviceId: string
  vehicleId: string | null
  firmwareVersion: string | null
  lastSeenAt: string | null
  status: "online" | "stale" | "offline"
  registeredAt: string
  registeredBy: string
}

export interface Driver {
  driverId: string
  fullName: string
  licenseNumber: string
  phoneNumber: string | null
  status: "active" | "suspended" | "inactive"
  createdAt: string
}

export interface TelemetryPoint {
  telemetryId: string
  vehicleId: string
  deviceId: string
  receivedAt: string
  deviceUptimeMs: number
  fuelLiters: number
  fuelPercent: number
  engineOn: boolean
  doorOpen: boolean
  tempCelsius: number
  accelG: number
  speedKmh: number
  fuelRateLhr: number
  tripSeconds: number
  tripFuelUsed: number
  latitude: number
  longitude: number
  locationName: string | null
  geofenceOk: boolean
  lowFuelFlag: boolean
  parkingMode: boolean
  overspeedFlag: boolean
  deviceAlertText: string | null
}

export interface VehicleLatestState {
  vehicleId: string
  label: string
  plateNumber: string
  lastSeenAt: string
  fuelLiters: number
  fuelPercent: number
  engineOn: boolean
  doorOpen: boolean
  speedKmh: number
  accelG: number
  tempCelsius: number
  fuelRateLhr: number
  latitude: number
  longitude: number
  locationName: string | null
  geofenceOk: boolean
  parkingMode: boolean
  overspeedFlag: boolean
  deviceStatus: "online" | "stale" | "offline"
  currentAlertLevel: "none" | "info" | "warning" | "critical"
  activeTripId: string | null
}

export interface AssignedDriver {
  driverId: string
  fullName: string
  licenseNumber?: string
}

export interface AssignedDevice {
  deviceId: string
  firmwareVersion: string | null
  status: "online" | "stale" | "offline"
  lastSeenAt: string | null
}

export interface VehicleWithDetails extends Vehicle {
  assignedDriver: AssignedDriver | null
  assignedDevice: AssignedDevice | null
  currentState: VehicleLatestState | null
  openAlertsCount: number
}

export type AlertType =
  | "SUSPECTED_FUEL_DROP"
  | "LOW_FUEL"
  | "OVERSPEED"
  | "DEVICE_STALE"
  | "DEVICE_OFFLINE"
  | "DOOR_OPEN_PARKED"
  | "REFILL_DETECTED"
  | "GEOFENCE_VIOLATION"

export type AlertSeverity = "info" | "warning" | "critical"
export type AlertStatus = "open" | "acknowledged" | "resolved"

export interface Alert {
  alertId: string
  vehicleId: string
  driverId: string | null
  driver?: AssignedDriver
  type: AlertType
  severity: AlertSeverity
  status: AlertStatus
  message: string
  evidence: Record<string, unknown>
  createdAt: string
  resolvedAt: string | null
}

export type TripStatus = "active" | "completed"

export interface Trip {
  tripId: string
  vehicleId: string
  driver: AssignedDriver | null
  startTime: string
  endTime: string | null
  startFuelLiters: number
  endFuelLiters: number | null
  fuelUsedLiters: number | null
  distanceKm: number | null
  avgSpeedKmh: number | null
  maxSpeedKmh: number | null
  startLat: number
  startLon: number
  endLat: number | null
  endLon: number | null
  status: TripStatus
}

export type ViolationType = "OVERSPEED" | "FUEL_DROP" | "DOOR_OPEN_PARKED" | "GEOFENCE_VIOLATION"

export interface Violation {
  violationId: string
  driverId: string
  vehicleId: string
  vehicleLabel: string
  alertId: string
  tripId: string | null
  type: ViolationType
  severity: AlertSeverity
  description: string
  occurredAt: string
}

export interface DriverWithViolations extends Driver {
  violations: Violation[]
  totalViolations: number
}

export interface DashboardSummary {
  totalVehicles: number
  activeVehicles: number
  inactiveVehicles: number
  maintenanceVehicles: number
  activeAlerts: number
  criticalAlerts: number
  warningAlerts: number
  infoAlerts: number
  fleetFuelAvgPercent: number
  devicesOnline: number
  devicesStale: number
  devicesOffline: number
  totalTrips: number
  activeTrips: number
}

export interface WebSocketMessage {
  type: string
  payload: unknown
  timestamp: string
}

export type VehicleUpdatePayload = VehicleLatestState

export interface AlertFiredPayload {
  alertId: string
  vehicleId: string
  vehicleLabel: string
  driverId: string | null
  driverName: string | null
  type: AlertType
  severity: AlertSeverity
  status: AlertStatus
  message: string
  evidence: Record<string, unknown>
  createdAt: string
}

export interface DeviceStatusChangePayload {
  vehicleId: string
  deviceId: string
  prevStatus: "online" | "stale" | "offline"
  newStatus: "online" | "stale" | "offline"
  lastSeenAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  token?: string
  admin?: {
    adminId: string
    username: string
  }
  error?: {
    code: string
    message: string
  }
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
  }
}