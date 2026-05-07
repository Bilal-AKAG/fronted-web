import {
  Vehicle,
  Device,
  TelemetryPoint,
  VehicleLatestState,
  Alert,
  Trip,
  Prediction,
  DashboardSummary,
} from "@/lib/types"

export const vehicles: Vehicle[] = [
  { vehicleId: "V001", plateNumber: "AA-123-BB", label: "Toyota Hilux", tankCapacityLiters: 80, assignedDriver: "Abebe Kebede", status: "active", createdAt: "2026-01-15T08:00:00Z" },
  { vehicleId: "V002", plateNumber: "CC-456-DD", label: "Isuzu FRR", tankCapacityLiters: 120, assignedDriver: "Mekdes Hailu", status: "active", createdAt: "2026-01-20T10:00:00Z" },
  { vehicleId: "V003", plateNumber: "EE-789-FF", label: "Mitsubishi L300", tankCapacityLiters: 55, assignedDriver: "Tadesse Wondimu", status: "maintenance", createdAt: "2026-02-01T09:00:00Z" },
]

export const devices: Device[] = [
  { deviceId: "ESP32-001", vehicleId: "V001", firmwareVersion: "v2.1.0", lastSeenAt: "2026-05-07T20:30:00Z", status: "online" },
  { deviceId: "ESP32-002", vehicleId: "V002", firmwareVersion: "v2.0.3", lastSeenAt: "2026-05-07T20:30:00Z", status: "online" },
  { deviceId: "ESP32-003", vehicleId: "V003", firmwareVersion: "v2.1.0", lastSeenAt: "2026-05-06T14:00:00Z", status: "offline" },
]

function generateTelemetryHistory(): TelemetryPoint[] {
  const points: TelemetryPoint[] = []
  const now = new Date("2026-05-07T20:30:00Z")
  let id = 0

  const baseFuel: Record<string, number> = { V001: 60, V002: 85, V003: 50 }
  const baseLat: Record<string, number> = { V001: 8.5512, V002: 8.5631, V003: 8.5455 }
  const baseLng: Record<string, number> = { V001: 39.2694, V002: 39.2812, V003: 39.2589 }

  for (let hoursAgo = 48; hoursAgo >= 0; hoursAgo -= 0.0833) {
    const ts = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)
    for (const vehicleId of ["V001", "V002", "V003"]) {
      const bf = baseFuel[vehicleId]
      const bl = baseLat[vehicleId]
      const bn = baseLng[vehicleId]
      const noise = (Math.random() - 0.5) * 3
      const latNoise = (Math.random() - 0.5) * 0.01
      const lngNoise = (Math.random() - 0.5) * 0.01
      const speedBase = hoursAgo < 36 && hoursAgo > 12 ? 25 + Math.random() * 30 : Math.random() * 5

      let fuel = bf + Math.sin(hoursAgo / 12) * 15 + noise
      if (hoursAgo > 20 && hoursAgo < 20.05 && vehicleId === "V001") {
        fuel = bf + Math.sin(20 / 12) * 15 - 12 + noise
      }
      if (hoursAgo > 28 && hoursAgo < 28.05 && vehicleId === "V002") {
        fuel = bf + Math.sin(28 / 12) * 15 - 18 + noise
      }
      if (Math.abs(hoursAgo - 8) < 0.05 && vehicleId === "V001") {
        fuel = fuel + 25 + Math.random() * 3
      }

      const tank = vehicles.find((v) => v.vehicleId === vehicleId)!.tankCapacityLiters
      const pct = Math.max(0, Math.min(100, (fuel / tank) * 100))

      points.push({
        telemetryId: `tel_${id++}`,
        vehicleId,
        deviceId: `ESP32-00${vehicleId.slice(-1)}`,
        timestamp: ts.toISOString(),
        fuelLevelLiters: Math.max(0, Math.round(fuel * 10) / 10),
        fuelLevelPercent: Math.round(pct * 10) / 10,
        latitude: Math.round((bl + latNoise) * 10000) / 10000,
        longitude: Math.round((bn + lngNoise) * 10000) / 10000,
        speedKph: Math.round(speedBase * 10) / 10,
        engineStatus: speedBase > 2 ? "ON" : "OFF",
      })
    }
  }
  return points
}

export const telemetryHistory = generateTelemetryHistory()

function getLatestTelemetry(vehicleId: string): TelemetryPoint {
  return telemetryHistory.filter((t) => t.vehicleId === vehicleId).at(-1)!
}

export const alerts: Alert[] = [
  { alertId: "alt_001", vehicleId: "V001", type: "SUSPECTED_FUEL_DROP", severity: "high", status: "open", message: "Fuel dropped by 12.0 liters in 4 minutes while engine was OFF", evidence: "Fuel went from 58.4L to 46.4L in 4 min", createdAt: "2026-05-07T16:30:00Z" },
  { alertId: "alt_002", vehicleId: "V002", type: "SUSPECTED_FUEL_DROP", severity: "critical", status: "open", message: "Fuel dropped by 18.2 liters in 6 minutes while engine was OFF", evidence: "Fuel went from 82.1L to 63.9L in 6 min", createdAt: "2026-05-07T12:15:00Z" },
  { alertId: "alt_003", vehicleId: "V003", type: "DEVICE_OFFLINE", severity: "high", status: "open", message: "Device ESP32-003 has not reported for 30+ hours", evidence: "Last seen: 2026-05-06T14:00:00Z", createdAt: "2026-05-07T14:00:00Z" },
  { alertId: "alt_004", vehicleId: "V001", type: "LOW_FUEL", severity: "medium", status: "acknowledged", message: "Fuel level below 50% (43.2L / 80L)", createdAt: "2026-05-07T08:00:00Z", resolvedAt: "2026-05-07T09:30:00Z" },
  { alertId: "alt_005", vehicleId: "V002", type: "LOW_FUEL", severity: "low", status: "resolved", message: "Fuel level below 40% (46.8L / 120L)", createdAt: "2026-05-06T18:00:00Z", resolvedAt: "2026-05-07T06:00:00Z" },
  { alertId: "alt_006", vehicleId: "V001", type: "FUEL_REFILL", severity: "low", status: "acknowledged", message: "Fuel refill detected: +25.0L added", evidence: "Fuel went from 45.2L to 70.2L", createdAt: "2026-05-07T12:30:00Z" },
  { alertId: "alt_007", vehicleId: "V002", type: "LOW_FUEL", severity: "medium", status: "open", message: "Fuel level below 35% (42.0L / 120L)", createdAt: "2026-05-07T19:00:00Z" },
  { alertId: "alt_008", vehicleId: "V003", type: "LOW_FUEL", severity: "high", status: "open", message: "Fuel level below 20% (10.8L / 55L)", createdAt: "2026-05-07T18:00:00Z" },
  { alertId: "alt_009", vehicleId: "V001", type: "LOW_FUEL", severity: "low", status: "resolved", message: "Fuel level below 50% (39.8L / 80L)", createdAt: "2026-05-06T10:00:00Z", resolvedAt: "2026-05-06T14:00:00Z" },
  { alertId: "alt_010", vehicleId: "V002", type: "SUSPECTED_FUEL_DROP", severity: "medium", status: "resolved", message: "Minor fuel drop detected: -5.0L in 2 minutes", createdAt: "2026-05-06T22:00:00Z", resolvedAt: "2026-05-07T08:00:00Z" },
  { alertId: "alt_011", vehicleId: "V001", type: "SUSPECTED_FUEL_DROP", severity: "medium", status: "open", message: "Abnormal fuel loss: -3.2L in 10 minutes while driving", createdAt: "2026-05-07T20:00:00Z" },
  { alertId: "alt_012", vehicleId: "V003", type: "SUSPECTED_FUEL_DROP", severity: "critical", status: "open", message: "Fuel dropped by 8.0L while device was offline - possible tampering", createdAt: "2026-05-07T20:15:00Z" },
]

export const latestStates: VehicleLatestState[] = vehicles.map((v) => {
  const latest = getLatestTelemetry(v.vehicleId)
  const alertCount = alerts.filter((a) => a.vehicleId === v.vehicleId && a.status === "open").length
  return {
    vehicleId: v.vehicleId,
    lastSeenAt: latest.timestamp,
    fuelLevelLiters: latest.fuelLevelLiters,
    fuelLevelPercent: latest.fuelLevelPercent,
    location: { latitude: latest.latitude, longitude: latest.longitude },
    engineStatus: latest.engineStatus,
    alertStatus: alertCount > 1 ? "critical" : alertCount === 1 ? "warning" : "normal",
    deviceStatus: devices.find((d) => d.vehicleId === v.vehicleId)?.status ?? "offline",
  }
})

export const trips: Trip[] = [
  { tripId: "trip_001", vehicleId: "V001", startTime: "2026-05-07T07:30:00Z", endTime: "2026-05-07T08:15:00Z", distanceKm: 18.2, fuelUsedLiters: 2.8, avgSpeedKph: 32.5 },
  { tripId: "trip_002", vehicleId: "V001", startTime: "2026-05-07T09:00:00Z", endTime: "2026-05-07T10:30:00Z", distanceKm: 42.1, fuelUsedLiters: 5.4, avgSpeedKph: 45.2 },
  { tripId: "trip_003", vehicleId: "V001", startTime: "2026-05-07T14:00:00Z", endTime: "2026-05-07T15:00:00Z", distanceKm: 24.5, fuelUsedLiters: 3.4, avgSpeedKph: 31.2 },
  { tripId: "trip_004", vehicleId: "V002", startTime: "2026-05-07T06:00:00Z", endTime: "2026-05-07T08:00:00Z", distanceKm: 65.8, fuelUsedLiters: 8.9, avgSpeedKph: 38.5 },
  { tripId: "trip_005", vehicleId: "V002", startTime: "2026-05-07T10:30:00Z", endTime: "2026-05-07T12:00:00Z", distanceKm: 38.4, fuelUsedLiters: 5.1, avgSpeedKph: 42.8 },
  { tripId: "trip_006", vehicleId: "V002", startTime: "2026-05-07T15:00:00Z", endTime: "2026-05-07T16:30:00Z", distanceKm: 52.3, fuelUsedLiters: 7.2, avgSpeedKph: 48.6 },
  { tripId: "trip_007", vehicleId: "V002", startTime: "2026-05-07T18:00:00Z", endTime: "2026-05-07T18:45:00Z", distanceKm: 15.1, fuelUsedLiters: 2.1, avgSpeedKph: 25.4 },
  { tripId: "trip_008", vehicleId: "V003", startTime: "2026-05-06T08:00:00Z", endTime: "2026-05-06T09:30:00Z", distanceKm: 33.7, fuelUsedLiters: 4.8, avgSpeedKph: 36.2 },
]

export const predictions: Prediction[] = [
  { predictionId: "pred_001", vehicleId: "V001", type: "FUEL_FORECAST", value: 38.2, confidence: 0.85, generatedAt: "2026-05-07T20:00:00Z" },
  { predictionId: "pred_002", vehicleId: "V001", type: "ANOMALY_SCORE", value: 72.5, confidence: 0.78, generatedAt: "2026-05-07T20:00:00Z" },
  { predictionId: "pred_003", vehicleId: "V002", type: "FUEL_FORECAST", value: 52.8, confidence: 0.82, generatedAt: "2026-05-07T20:00:00Z" },
  { predictionId: "pred_004", vehicleId: "V002", type: "ANOMALY_SCORE", value: 85.3, confidence: 0.91, generatedAt: "2026-05-07T20:00:00Z" },
  { predictionId: "pred_005", vehicleId: "V003", type: "FUEL_FORECAST", value: 8.5, confidence: 0.65, generatedAt: "2026-05-07T20:00:00Z" },
  { predictionId: "pred_006", vehicleId: "V003", type: "ANOMALY_SCORE", value: 45.1, confidence: 0.55, generatedAt: "2026-05-07T20:00:00Z" },
]

export const summary: DashboardSummary = {
  totalVehicles: vehicles.length,
  activeAlerts: alerts.filter((a) => a.status === "open").length,
  fleetFuelAvgPercent: Math.round(
    latestStates.reduce((sum, s) => sum + s.fuelLevelPercent, 0) / latestStates.length
  ),
  devicesOnline: devices.filter((d) => d.status === "online").length,
}
