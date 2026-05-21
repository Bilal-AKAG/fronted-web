"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchAlerts, fetchAlert, resolveAlert } from "@/lib/api/alerts"

export function useAlerts(status?: string) {
  return useQuery({
    queryKey: ["alerts", status],
    queryFn: () => fetchAlerts(status),
  })
}

export function useAlert(alertId: string) {
  return useQuery({
    queryKey: ["alert", alertId],
    queryFn: () => fetchAlert(alertId),
    enabled: !!alertId,
  })
}

export function useResolveAlert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ alertId, status }: { alertId: string; status: "acknowledged" | "resolved" }) =>
      resolveAlert(alertId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] })
    },
  })
}
