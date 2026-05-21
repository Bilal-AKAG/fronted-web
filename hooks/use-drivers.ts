"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchDrivers,
  fetchDriver,
  fetchDriverViolations,
  createDriver,
  updateDriver,
  type CreateDriverPayload,
  type UpdateDriverPayload,
} from "@/lib/api/drivers"

export function useDrivers() {
  return useQuery({
    queryKey: ["drivers"],
    queryFn: fetchDrivers,
  })
}

export function useDriver(driverId: string) {
  return useQuery({
    queryKey: ["driver", driverId],
    queryFn: () => fetchDriver(driverId),
    enabled: !!driverId,
  })
}

export function useDriverViolations(driverId: string) {
  return useQuery({
    queryKey: ["driver-violations", driverId],
    queryFn: () => fetchDriverViolations(driverId),
    enabled: !!driverId,
  })
}

export function useCreateDriver() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDriverPayload) => createDriver(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] })
    },
  })
}

export function useUpdateDriver() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ driverId, data }: { driverId: string; data: UpdateDriverPayload }) =>
      updateDriver(driverId, data),
    onSuccess: (_, { driverId }) => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] })
      queryClient.invalidateQueries({ queryKey: ["driver", driverId] })
    },
  })
}
