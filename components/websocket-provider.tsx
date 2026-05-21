"use client"

import { useWebSocket } from "@/hooks/use-websocket"
import { useLiveState } from "@/lib/store/live-state"
import type { WsMessage, WsVehicleState } from "@/hooks/use-websocket"

export function WebSocketProvider() {
  const updateVehicle = useLiveState((s) => s.updateVehicle)
  const addAlert = useLiveState((s) => s.addAlert)
  const addDeviceChange = useLiveState((s) => s.addDeviceChange)
  const setInitialVehicles = useLiveState((s) => s.setInitialVehicles)
  const setConnected = useLiveState((s) => s.setConnected)

  useWebSocket((msg: WsMessage) => {
    switch (msg.type) {
      case "CONNECTED":
        setConnected(msg.payload.connectedVehicles, msg.payload.serverTime)
        break
      case "ALL_VEHICLES_STATE": {
        const updates = msg.payload.vehicles
          .filter((v: WsVehicleState) => v.currentState)
          .map((v: WsVehicleState) => ({
            vehicleId: v.vehicleId,
            fuelPercent: v.currentState!.fuelPercent,
            fuelLiters: v.currentState!.fuelLiters,
            speedKmh: v.currentState!.speedKmh,
            engineOn: v.currentState!.engineOn,
            doorOpen: v.currentState!.doorOpen,
            tempCelsius: v.currentState!.tempCelsius,
            fuelRateLhr: v.currentState!.fuelRateLhr,
            latitude: v.currentState!.latitude,
            longitude: v.currentState!.longitude,
            locationName: v.currentState!.locationName,
            overspeedFlag: v.currentState!.overspeedFlag,
            parkingMode: v.currentState!.parkingMode,
            lastSeenAt: v.currentState!.lastSeenAt,
            deviceStatus: v.currentState!.deviceStatus,
            currentAlertLevel: v.currentState!.currentAlertLevel,
            activeTripId: v.currentState!.activeTripId,
          }))
        setInitialVehicles(updates)
        break
      }
      case "VEHICLE_UPDATE":
        updateVehicle(msg.payload)
        break
      case "ALERT_FIRED":
        addAlert(msg.payload)
        break
      case "DEVICE_STATUS_CHANGE":
        addDeviceChange(msg.payload)
        break
    }
  })

  return null
}
