import {
  Vehicle,
  Device,
  Driver,
  TelemetryPoint,
  VehicleLatestState,
  Alert,
  Trip,
  Violation,
  DashboardSummary,
} from "@/lib/types"

export const drivers: Driver[] = [
  {
    driverId: "DRV-001",
    fullName: "Bekele Tadesse",
    licenseNumber: "ETH-2021-4532",
    phoneNumber: "+251912345678",
    status: "active",
    createdAt: "2026-01-10T08:00:00Z",
  },
  {
    driverId: "DRV-002",
    fullName: "Chaltu Gemechu",
    licenseNumber: "ETH-2022-9871",
    phoneNumber: "+251912345679",
    status: "active",
    createdAt: "2026-02-15T10:00:00Z",
  },
  {
    driverId: "DRV-003",
    fullName: "Dagmawi Negussie",
    licenseNumber: "ETH-2020-3344",
    phoneNumber: "+251912345680",
    status: "active",
    createdAt: "2025-11-20T14:00:00Z",
  },
  {
    driverId: "DRV-004",
    fullName: "Eyasu Wolde",
    licenseNumber: "ETH-2023-1122",
    phoneNumber: "+251912345681",
    status: "suspended",
    createdAt: "2026-03-01T09:00:00Z",
  },
]

export const vehicles: Vehicle[] = [
  {
    vehicleId: "V001",
    plateNumber: "ET-4321-AA",
    label: "Truck Alpha",
    tankCapacityLiters: 80,
    make: "Toyota",
    model: "Land Cruiser",
    year: 2019,
    color: "White",
    assignedDriverId: "DRV-001",
    assignedDeviceId: "ESP32-001",
    status: "active",
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-05-01T08:00:00Z",
  },
  {
    vehicleId: "V002",
    plateNumber: "ET-9876-BB",
    label: "Van Beta",
    tankCapacityLiters: 60,
    make: "Nissan",
    model: "Patrol",
    year: 2020,
    color: "Silver",
    assignedDriverId: "DRV-002",
    assignedDeviceId: "ESP32-002",
    status: "active",
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-04-15T10:00:00Z",
  },
  {
    vehicleId: "V003",
    plateNumber: "ET-1122-CC",
    label: "Truck Gamma",
    tankCapacityLiters: 100,
    make: "Isuzu",
    model: "NPR",
    year: 2021,
    color: "Blue",
    assignedDriverId: "DRV-003",
    assignedDeviceId: "ESP32-003",
    status: "maintenance",
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-05-10T09:00:00Z",
  },
]

export const devices: Device[] = [
  {
    deviceId: "ESP32-001",
    vehicleId: "V001",
    firmwareVersion: "v3.3",
    lastSeenAt: "2026-05-18T10:00:07Z",
    status: "online",
    registeredAt: "2026-01-10T08:00:00Z",
    registeredBy: "admin-001",
  },
  {
    deviceId: "ESP32-002",
    vehicleId: "V002",
    firmwareVersion: "v3.3",
    lastSeenAt: "2026-05-18T09:55:00Z",
    status: "online",
    registeredAt: "2026-01-18T10:00:00Z",
    registeredBy: "admin-001",
  },
  {
    deviceId: "ESP32-003",
    vehicleId: "V003",
    firmwareVersion: "v3.2",
    lastSeenAt: "2026-05-16T14:00:00Z",
    status: "offline",
    registeredAt: "2026-01-25T09:00:00Z",
    registeredBy: "admin-001",
  },
  {
    deviceId: "ESP32-004",
    vehicleId: null,
    firmwareVersion: "v3.3",
    lastSeenAt: null,
    status: "offline",
    registeredAt: "2026-03-01T08:00:00Z",
    registeredBy: "admin-001",
  },
]

function generateTelemetryHistory(): TelemetryPoint[] {
  const points: TelemetryPoint[] = []
  const now = new Date("2026-05-18T10:00:07Z")
  let id = 0

  const baseFuel: Record<string, number> = { V001: 45, V002: 38, V003: 22 }
  const baseLat: Record<string, number> = { V001: 9.0320, V002: 9.0450, V003: 9.0100 }
  const baseLng: Record<string, number> = { V001: 38.7469, V002: 38.7600, V003: 38.7300 }
  const locations: Record<string, string[]> = {
    V001: ["Home", "Office", "Warehouse", "Depot"],
    V002: ["Site A", "Site B", "Office", "Depot"],
    V003: ["Garage", "Workshop"],
  }

  for (let hoursAgo = 24; hoursAgo >= 0; hoursAgo -= 0.1) {
    const ts = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)

    for (const vehicleId of ["V001", "V002", "V003"]) {
      const bf = baseFuel[vehicleId]
      const bl = baseLat[vehicleId]
      const bn = baseLng[vehicleId]
      const locs = locations[vehicleId]

      const noise = (Math.random() - 0.5) * 2
      const latNoise = (Math.random() - 0.5) * 0.005
      const lngNoise = (Math.random() - 0.5) * 0.005

      const isMoving = hoursAgo < 20 && hoursAgo > 8
      const speedBase = isMoving ? 20 + Math.random() * 40 : Math.random() * 2

      const baseFuelConsumption = isMoving ? 0.8 : 0.0
      let fuel = bf - (24 - hoursAgo) * baseFuelConsumption + noise

      if (vehicleId === "V001" && hoursAgo > 6 && hoursAgo < 6.1) {
        fuel = fuel + 30 + Math.random() * 3
      }

      if (vehicleId === "V002" && hoursAgo > 12 && hoursAgo < 12.1) {
        fuel = fuel + 20 + Math.random() * 2
      }

      const tank = vehicles.find((v) => v.vehicleId === vehicleId)!.tankCapacityLiters
      const pct = Math.max(0, Math.min(100, (fuel / tank) * 100))

      const isParked = speedBase < 3
      const engineOn = !isParked || Math.random() > 0.3
      const doorOpen = !engineOn && Math.random() > 0.7

      const locationIdx = Math.floor((24 - hoursAgo) / 6) % locs.length

      points.push({
        telemetryId: `tel_${id++}`,
        vehicleId,
        deviceId: `ESP32-00${vehicleId.slice(-1)}`,
        receivedAt: ts.toISOString(),
        deviceUptimeMs: Math.floor(hoursAgo * 3600000 + Math.random() * 60000),
        fuelLiters: Math.max(0, Math.round(fuel * 100) / 100),
        fuelPercent: Math.round(pct),
        engineOn,
        doorOpen,
        tempCelsius: 20 + Math.random() * 8,
        accelG: (Math.random() - 0.5) * 2,
        speedKmh: Math.round(speedBase * 10) / 10,
        fuelRateLhr: engineOn ? 2 + Math.random() * 4 : 0,
        tripSeconds: engineOn ? Math.floor((24 - hoursAgo) * 3600) : 0,
        tripFuelUsed: engineOn ? (24 - hoursAgo) * (2 + Math.random() * 2) : 0,
        latitude: Math.round((bl + latNoise) * 10000) / 10000,
        longitude: Math.round((bn + lngNoise) * 10000) / 10000,
        locationName: locs[locationIdx],
        geofenceOk: Math.random() > 0.1,
        lowFuelFlag: pct < 15,
        parkingMode: isParked,
        overspeedFlag: speedBase > 80,
        deviceAlertText: pct < 15 ? "Low fuel warning" : null,
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
  {
    alertId: "ALT-0043",
    vehicleId: "V001",
    driverId: "DRV-001",
    type: "LOW_FUEL",
    severity: "warning",
    status: "open",
    message: "Fuel level at 4% (2.93 liters). Immediate refuel required.",
    evidence: { fuelLiters: 2.93, fuelPercent: 4, deviceFlag: true },
    createdAt: "2026-05-18T10:00:07Z",
    resolvedAt: null,
  },
  {
    alertId: "ALT-0042",
    vehicleId: "V002",
    driverId: "DRV-002",
    type: "OVERSPEED",
    severity: "warning",
    status: "open",
    message: "Vehicle exceeded speed limit: 95 km/h on trip TRP-0023",
    evidence: { speedKmh: 95.2, threshold: 80, deviceFlag: true, tripId: "TRP-0023" },
    createdAt: "2026-05-18T09:30:00Z",
    resolvedAt: null,
  },
  {
    alertId: "ALT-0041",
    vehicleId: "V001",
    driverId: "DRV-001",
    type: "SUSPECTED_FUEL_DROP",
    severity: "critical",
    status: "open",
    message: "Fuel dropped by 8.4 liters in 3 minutes while engine OFF and parking mode ON",
    evidence: { fuelBefore: 40.5, fuelAfter: 32.1, dropLiters: 8.4, windowMinutes: 3, engineOn: false, parkingMode: true },
    createdAt: "2026-05-17T22:15:00Z",
    resolvedAt: null,
  },
  {
    alertId: "ALT-0040",
    vehicleId: "V003",
    driverId: "DRV-003",
    type: "DEVICE_OFFLINE",
    severity: "critical",
    status: "open",
    message: "Device ESP32-003 has not reported for more than 48 hours",
    evidence: { lastSeenAt: "2026-05-16T14:00:00Z" },
    createdAt: "2026-05-16T14:00:00Z",
    resolvedAt: null,
  },
  {
    alertId: "ALT-0039",
    vehicleId: "V002",
    driverId: "DRV-002",
    type: "GEOFENCE_VIOLATION",
    severity: "warning",
    status: "acknowledged",
    message: "Vehicle left designated geofence area",
    evidence: { latitude: 9.1200, longitude: 38.8500 },
    createdAt: "2026-05-16T11:00:00Z",
    resolvedAt: null,
  },
  {
    alertId: "ALT-0038",
    vehicleId: "V001",
    driverId: "DRV-001",
    type: "REFILL_DETECTED",
    severity: "info",
    status: "resolved",
    message: "Fuel increased by 32.5 liters - refill detected",
    evidence: { fuelBefore: 15.2, fuelAfter: 47.7, increaseLiters: 32.5 },
    createdAt: "2026-05-15T16:30:00Z",
    resolvedAt: "2026-05-15T16:35:00Z",
  },
  {
    alertId: "ALT-0037",
    vehicleId: "V002",
    driverId: "DRV-002",
    type: "DOOR_OPEN_PARKED",
    severity: "warning",
    status: "resolved",
    message: "Door open while engine OFF and parking mode active",
    evidence: { doorOpen: true, engineOn: false, parkingMode: true },
    createdAt: "2026-05-15T08:00:00Z",
    resolvedAt: "2026-05-15T08:30:00Z",
  },
  {
    alertId: "ALT-0036",
    vehicleId: "V001",
    driverId: "DRV-001",
    type: "LOW_FUEL",
    severity: "warning",
    status: "resolved",
    message: "Fuel level at 18% (14.4 liters)",
    evidence: { fuelLiters: 14.4, fuelPercent: 18, deviceFlag: false },
    createdAt: "2026-05-14T14:00:00Z",
    resolvedAt: "2026-05-15T16:30:00Z",
  },
  {
    alertId: "ALT-0035",
    vehicleId: "V003",
    driverId: "DRV-003",
    type: "DEVICE_STALE",
    severity: "info",
    status: "resolved",
    message: "Device ESP32-003 has not reported for more than 5 minutes",
    evidence: { lastSeenAt: "2026-05-14T10:05:00Z" },
    createdAt: "2026-05-14T10:05:00Z",
    resolvedAt: "2026-05-14T10:10:00Z",
  },
]

export const trips: Trip[] = [
  {
    tripId: "TRP-0023",
    vehicleId: "V001",
    driver: { driverId: "DRV-001", fullName: "Bekele Tadesse" },
    startTime: "2026-05-18T07:00:00Z",
    endTime: null,
    startFuelLiters: 55.0,
    endFuelLiters: null,
    fuelUsedLiters: null,
    distanceKm: 42.3,
    avgSpeedKmh: 38.5,
    maxSpeedKmh: 67.2,
    startLat: 9.0100,
    startLon: 38.7200,
    endLat: 9.0320,
    endLon: 38.7469,
    status: "active",
  },
  {
    tripId: "TRP-0022",
    vehicleId: "V001",
    driver: { driverId: "DRV-001", fullName: "Bekele Tadesse" },
    startTime: "2026-05-17T08:00:00Z",
    endTime: "2026-05-17T12:30:00Z",
    startFuelLiters: 60.0,
    endFuelLiters: 48.5,
    fuelUsedLiters: 11.5,
    distanceKm: 85.2,
    avgSpeedKmh: 42.3,
    maxSpeedKmh: 72.5,
    startLat: 9.0050,
    startLon: 38.7100,
    endLat: 9.0500,
    endLon: 38.7700,
    status: "completed",
  },
  {
    tripId: "TRP-0021",
    vehicleId: "V002",
    driver: { driverId: "DRV-002", fullName: "Chaltu Gemechu" },
    startTime: "2026-05-18T06:30:00Z",
    endTime: null,
    startFuelLiters: 45.0,
    endFuelLiters: null,
    fuelUsedLiters: null,
    distanceKm: 28.7,
    avgSpeedKmh: 35.2,
    maxSpeedKmh: 95.2,
    startLat: 9.0400,
    startLon: 38.7500,
    endLat: 9.0450,
    endLon: 38.7600,
    status: "active",
  },
  {
    tripId: "TRP-0020",
    vehicleId: "V002",
    driver: { driverId: "DRV-002", fullName: "Chaltu Gemechu" },
    startTime: "2026-05-17T09:00:00Z",
    endTime: "2026-05-17T11:30:00Z",
    startFuelLiters: 50.0,
    endFuelLiters: 42.8,
    fuelUsedLiters: 7.2,
    distanceKm: 52.1,
    avgSpeedKmh: 44.8,
    maxSpeedKmh: 68.3,
    startLat: 9.0350,
    startLon: 38.7450,
    endLat: 9.0550,
    endLon: 38.7650,
    status: "completed",
  },
  {
    tripId: "TRP-0019",
    vehicleId: "V003",
    driver: { driverId: "DRV-003", fullName: "Dagmawi Negussie" },
    startTime: "2026-05-15T10:00:00Z",
    endTime: "2026-05-15T14:00:00Z",
    startFuelLiters: 35.0,
    endFuelLiters: 28.2,
    fuelUsedLiters: 6.8,
    distanceKm: 45.3,
    avgSpeedKmh: 32.5,
    maxSpeedKmh: 55.0,
    startLat: 9.0100,
    startLon: 38.7300,
    endLat: 9.0250,
    endLon: 38.7400,
    status: "completed",
  },
  {
    tripId: "TRP-0018",
    vehicleId: "V001",
    driver: { driverId: "DRV-001", fullName: "Bekele Tadesse" },
    startTime: "2026-05-16T14:00:00Z",
    endTime: "2026-05-16T17:00:00Z",
    startFuelLiters: 45.0,
    endFuelLiters: 38.5,
    fuelUsedLiters: 6.5,
    distanceKm: 38.9,
    avgSpeedKmh: 36.2,
    maxSpeedKmh: 58.7,
    startLat: 9.0200,
    startLon: 38.7350,
    endLat: 9.0100,
    endLon: 38.7200,
    status: "completed",
  },
]

export const violations: Violation[] = [
  {
    violationId: "VIO-0012",
    driverId: "DRV-001",
    vehicleId: "V001",
    vehicleLabel: "Truck Alpha",
    alertId: "ALT-0041",
    tripId: null,
    type: "FUEL_DROP",
    severity: "critical",
    description: "Suspected fuel theft: 8.4L dropped in 3 minutes while parked",
    occurredAt: "2026-05-17T22:15:00Z",
  },
  {
    violationId: "VIO-0011",
    driverId: "DRV-002",
    vehicleId: "V002",
    vehicleLabel: "Van Beta",
    alertId: "ALT-0042",
    tripId: "TRP-0021",
    type: "OVERSPEED",
    severity: "warning",
    description: "Vehicle recorded speed of 95 km/h during trip TRP-0021",
    occurredAt: "2026-05-18T09:30:00Z",
  },
  {
    violationId: "VIO-0010",
    driverId: "DRV-002",
    vehicleId: "V002",
    vehicleLabel: "Van Beta",
    alertId: "ALT-0039",
    tripId: "TRP-0020",
    type: "GEOFENCE_VIOLATION",
    severity: "warning",
    description: "Vehicle left designated geofence area during trip TRP-0020",
    occurredAt: "2026-05-16T11:00:00Z",
  },
  {
    violationId: "VIO-0009",
    driverId: "DRV-002",
    vehicleId: "V002",
    vehicleLabel: "Van Beta",
    alertId: "ALT-0037",
    tripId: null,
    type: "DOOR_OPEN_PARKED",
    severity: "warning",
    description: "Door open while engine OFF and parking mode active",
    occurredAt: "2026-05-15T08:00:00Z",
  },
  {
    violationId: "VIO-0008",
    driverId: "DRV-003",
    vehicleId: "V003",
    vehicleLabel: "Truck Gamma",
    alertId: "ALT-0040",
    tripId: null,
    type: "GEOFENCE_VIOLATION",
    severity: "critical",
    description: "Device offline - vehicle may be outside coverage area",
    occurredAt: "2026-05-16T14:00:00Z",
  },
]

export function getLatestState(vehicleId: string): VehicleLatestState {
  const latest = getLatestTelemetry(vehicleId)
  const vehicle = vehicles.find((v) => v.vehicleId === vehicleId)!
  const device = devices.find((d) => d.vehicleId === vehicleId)

  const vehicleAlerts = alerts.filter((a) => a.vehicleId === vehicleId && a.status === "open")
  const alertLevels = vehicleAlerts.map((a) => a.severity)
  let currentAlertLevel: "none" | "info" | "warning" | "critical" = "none"
  if (alertLevels.includes("critical")) currentAlertLevel = "critical"
  else if (alertLevels.includes("warning")) currentAlertLevel = "warning"
  else if (alertLevels.includes("info")) currentAlertLevel = "info"

  const activeTrip = trips.find((t) => t.vehicleId === vehicleId && t.status === "active")

  return {
    vehicleId,
    label: vehicle.label,
    plateNumber: vehicle.plateNumber,
    lastSeenAt: latest.receivedAt,
    fuelLiters: latest.fuelLiters,
    fuelPercent: latest.fuelPercent,
    engineOn: latest.engineOn,
    doorOpen: latest.doorOpen,
    speedKmh: latest.speedKmh,
    accelG: latest.accelG,
    tempCelsius: latest.tempCelsius,
    fuelRateLhr: latest.fuelRateLhr,
    latitude: latest.latitude,
    longitude: latest.longitude,
    locationName: latest.locationName,
    geofenceOk: latest.geofenceOk,
    parkingMode: latest.parkingMode,
    overspeedFlag: latest.overspeedFlag,
    deviceStatus: device?.status ?? "offline",
    currentAlertLevel,
    activeTripId: activeTrip?.tripId ?? null,
  }
}

export function getVehicleById(vehicleId: string) {
  const vehicle = vehicles.find((v) => v.vehicleId === vehicleId)
  if (!vehicle) return null

  const driver = vehicle.assignedDriverId
    ? drivers.find((d) => d.driverId === vehicle.assignedDriverId)
    : null
  const device = vehicle.assignedDeviceId
    ? devices.find((d) => d.deviceId === vehicle.assignedDeviceId)
    : null
  const currentState = getLatestState(vehicleId)
  const openAlertsCount = alerts.filter(
    (a) => a.vehicleId === vehicleId && a.status === "open"
  ).length

  return {
    ...vehicle,
    assignedDriver: driver
      ? { driverId: driver.driverId, fullName: driver.fullName, licenseNumber: driver.licenseNumber }
      : null,
    assignedDevice: device
      ? {
          deviceId: device.deviceId,
          firmwareVersion: device.firmwareVersion,
          status: device.status,
          lastSeenAt: device.lastSeenAt,
        }
      : null,
    currentState,
    openAlertsCount,
  }
}

export const summary: DashboardSummary = {
  totalVehicles: vehicles.length,
  activeVehicles: vehicles.filter((v) => v.status === "active").length,
  inactiveVehicles: vehicles.filter((v) => v.status === "inactive").length,
  maintenanceVehicles: vehicles.filter((v) => v.status === "maintenance").length,
  activeAlerts: alerts.filter((a) => a.status === "open").length,
  criticalAlerts: alerts.filter((a) => a.status === "open" && a.severity === "critical").length,
  warningAlerts: alerts.filter((a) => a.status === "open" && a.severity === "warning").length,
  infoAlerts: alerts.filter((a) => a.status === "open" && a.severity === "info").length,
  fleetFuelAvgPercent: Math.round(
    vehicles
      .map((v) => {
        const state = getLatestState(v.vehicleId)
        return state.fuelPercent
      })
      .reduce((a, b) => a + b, 0) / vehicles.length
  ),
  devicesOnline: devices.filter((d) => d.status === "online").length,
  devicesStale: devices.filter((d) => d.status === "stale").length,
  devicesOffline: devices.filter((d) => d.status === "offline").length,
  totalTrips: trips.length,
  activeTrips: trips.filter((t) => t.status === "active").length,
}