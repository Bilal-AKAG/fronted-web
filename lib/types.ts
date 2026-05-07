export interface Vehicle {
  vehicleId: string
  plateNumber: string
  label: string
  tankCapacityLiters: number
  assignedDriver: string
  status: "active" | "maintenance" | "offline"
  createdAt: string
}

export interface Device {
  deviceId: string
  vehicleId: string
  firmwareVersion: string
  lastSeenAt: string
  status: "online" | "offline"
}

export interface TelemetryPoint {
  telemetryId: string
  vehicleId: string
  deviceId: string
  timestamp: string
  fuelLevelLiters: number
  fuelLevelPercent: number
  latitude: number
  longitude: number
  speedKph: number
  engineStatus: "ON" | "OFF"
}

export interface VehicleLatestState {
  vehicleId: string
  lastSeenAt: string
  fuelLevelLiters: number
  fuelLevelPercent: number
  location: { latitude: number; longitude: number }
  engineStatus: "ON" | "OFF"
  alertStatus: "normal" | "warning" | "critical"
  deviceStatus: "online" | "offline"
}

export interface Alert {
  alertId: string
  vehicleId: string
  type: "SUSPECTED_FUEL_DROP" | "LOW_FUEL" | "DEVICE_OFFLINE" | "FUEL_REFILL"
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "acknowledged" | "resolved"
  message: string
  evidence?: string
  createdAt: string
  resolvedAt?: string
}

export interface Trip {
  tripId: string
  vehicleId: string
  startTime: string
  endTime: string
  distanceKm: number
  fuelUsedLiters: number
  avgSpeedKph: number
}

export interface Prediction {
  predictionId: string
  vehicleId: string
  type: "FUEL_FORECAST" | "ANOMALY_SCORE"
  value: number
  confidence: number
  generatedAt: string
}

export interface DashboardSummary {
  totalVehicles: number
  activeAlerts: number
  fleetFuelAvgPercent: number
  devicesOnline: number
}
