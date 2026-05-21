"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchVehicles,
  fetchVehicle,
  fetchVehicleHistory,
  fetchVehicleAlerts,
  createVehicle,
  updateVehicle,
  type CreateVehiclePayload,
  type UpdateVehiclePayload,
} from "@/lib/api/vehicles"

export function useVehicles(status?: string, deviceStatus?: string) {
  return useQuery({
    queryKey: ["vehicles", status, deviceStatus],
    queryFn: () => fetchVehicles(status, deviceStatus),
  })
}

export function useVehicle(vehicleId: string) {
  return useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => fetchVehicle(vehicleId),
    enabled: !!vehicleId,
  })
}

export function useVehicleHistory(
  vehicleId: string,
  options?: { from?: string; to?: string; limit?: number }
) {
  return useQuery({
    queryKey: ["vehicle-history", vehicleId, options],
    queryFn: () => fetchVehicleHistory(vehicleId, options),
    enabled: !!vehicleId,
  })
}

export function useVehicleAlerts(
  vehicleId: string,
  options?: { status?: string; severity?: string; limit?: number }
) {
  return useQuery({
    queryKey: ["vehicle-alerts", vehicleId, options],
    queryFn: () => fetchVehicleAlerts(vehicleId, options),
    enabled: !!vehicleId,
  })
}

export function useCreateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateVehiclePayload) => createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
    },
  })
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ vehicleId, data }: { vehicleId: string; data: UpdateVehiclePayload }) =>
      updateVehicle(vehicleId, data),
    onSuccess: (_, { vehicleId }) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleId] })
    },
  })
}
