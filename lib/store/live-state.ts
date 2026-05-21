import { create } from "zustand"
import type { WsVehicleUpdate, WsAlertFired, WsDeviceStatusChange } from "@/hooks/use-websocket"

interface LiveStateStore {
  vehicleStates: Record<string, WsVehicleUpdate>
  latestAlerts: WsAlertFired[]
  deviceStatusChanges: WsDeviceStatusChange[]
  connectedVehicleIds: string[]
  serverTime: string | null
  updateVehicle: (state: WsVehicleUpdate) => void
  addAlert: (alert: WsAlertFired) => void
  addDeviceChange: (change: WsDeviceStatusChange) => void
  setInitialVehicles: (vehicles: WsVehicleUpdate[]) => void
  setConnected: (vehicleIds: string[], serverTime: string) => void
}

export const useLiveState = create<LiveStateStore>((set) => ({
  vehicleStates: {},
  latestAlerts: [],
  deviceStatusChanges: [],
  connectedVehicleIds: [],
  serverTime: null,
  updateVehicle: (state) =>
    set((s) => ({
      vehicleStates: { ...s.vehicleStates, [state.vehicleId]: state },
    })),
  addAlert: (alert) =>
    set((s) => ({
      latestAlerts: [alert, ...s.latestAlerts].slice(0, 50),
    })),
  addDeviceChange: (change) =>
    set((s) => ({
      deviceStatusChanges: [change, ...s.deviceStatusChanges].slice(0, 20),
    })),
  setInitialVehicles: (vehicles) =>
    set(() => {
      const map: Record<string, WsVehicleUpdate> = {}
      for (const v of vehicles) {
        map[v.vehicleId] = v
      }
      return { vehicleStates: map }
    }),
  setConnected: (vehicleIds, serverTime) =>
    set(() => ({
      connectedVehicleIds: vehicleIds,
      serverTime,
    })),
}))
