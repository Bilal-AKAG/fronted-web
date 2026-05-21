"use client"

import { useEffect, useRef } from "react"
import { useAuthStore } from "@/lib/store/auth-store"

export interface WsConnectedPayload {
  connectedVehicles: string[]
  serverTime: string
}

export interface WsVehicleState {
  vehicleId: string
  label: string
  plateNumber: string
  make: string | null
  model: string | null
  status: string
  assignedDriver: { driverId: string; fullName: string } | null
  assignedDevice: { deviceId: string; status: string } | null
  currentState: {
    vehicleId: string
    fuelPercent: number
    fuelLiters: number
    speedKmh: number
    engineOn: boolean
    doorOpen: boolean
    tempCelsius: number
    fuelRateLhr: number
    latitude: number
    longitude: number
    locationName: string | null
    overspeedFlag: boolean
    parkingMode: boolean
    lastSeenAt: string
    deviceStatus: string
    currentAlertLevel: string
    activeTripId: string | null
  } | null
}

export interface WsVehicleUpdate {
  vehicleId: string
  fuelPercent: number
  fuelLiters: number
  speedKmh: number
  engineOn: boolean
  doorOpen: boolean
  tempCelsius: number
  fuelRateLhr: number
  latitude: number
  longitude: number
  locationName: string | null
  overspeedFlag: boolean
  parkingMode: boolean
  lastSeenAt: string
  deviceStatus: string
  currentAlertLevel: string
  activeTripId: string | null
}

export interface WsAlertFired {
  alertId: string
  vehicleId: string
  vehicleLabel: string
  driverId: string | null
  driverName: string | null
  type: string
  severity: string
  status: string
  message: string
  evidence: Record<string, unknown>
  createdAt: string
}

export interface WsDeviceStatusChange {
  vehicleId: string
  deviceId: string
  prevStatus: string
  newStatus: string
  lastSeenAt: string
}

export type WsMessage =
  | { type: "CONNECTED"; payload: WsConnectedPayload; timestamp: string }
  | { type: "ALL_VEHICLES_STATE"; payload: { vehicles: WsVehicleState[] }; timestamp: string }
  | { type: "VEHICLE_UPDATE"; payload: WsVehicleUpdate; timestamp: string }
  | { type: "ALERT_FIRED"; payload: WsAlertFired; timestamp: string }
  | { type: "DEVICE_STATUS_CHANGE"; payload: WsDeviceStatusChange; timestamp: string }

type WsHandler = (msg: WsMessage) => void

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://fuel-aware-backend.onrender.com"
const WS_URL = API_BASE.replace(/^http/, "ws") + "/ws"

export function useWebSocket(onMessage: WsHandler) {
  const wsRef = useRef<WebSocket | null>(null)
  const token = useAuthStore((state) => state.token)
  const handlerRef = useRef(onMessage)

  useEffect(() => {
    handlerRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    if (!token) return

    function connect() {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        console.log("[WS] Connected")
      }

      ws.onmessage = (event) => {
        try {
          const msg: WsMessage = JSON.parse(event.data)
          handlerRef.current(msg)
        } catch (e) {
          console.error("[WS] Parse error", e)
        }
      }

      ws.onclose = () => {
        console.log("[WS] Disconnected, reconnecting in 3s...")
        wsRef.current = null
        setTimeout(connect, 3000)
      }

      ws.onerror = () => {
        ws.close()
      }
    }

    connect()

    return () => {
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [token])
}
