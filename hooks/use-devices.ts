"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchDevices,
  fetchDevice,
  createDevice,
  updateDevice,
  type CreateDevicePayload,
  type UpdateDevicePayload,
} from "@/lib/api/devices"

export function useDevices() {
  return useQuery({
    queryKey: ["devices"],
    queryFn: fetchDevices,
  })
}

export function useDevice(deviceId: string) {
  return useQuery({
    queryKey: ["device", deviceId],
    queryFn: () => fetchDevice(deviceId),
    enabled: !!deviceId,
  })
}

export function useCreateDevice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDevicePayload) => createDevice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] })
    },
  })
}

export function useUpdateDevice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ deviceId, data }: { deviceId: string; data: UpdateDevicePayload }) =>
      updateDevice(deviceId, data),
    onSuccess: (_, { deviceId }) => {
      queryClient.invalidateQueries({ queryKey: ["devices"] })
      queryClient.invalidateQueries({ queryKey: ["device", deviceId] })
    },
  })
}
