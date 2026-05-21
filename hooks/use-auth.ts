"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { loginAdmin } from "@/lib/api/auth"
import { useAuthStore } from "@/lib/store/auth-store"
import { setAuthCookie } from "@/lib/auth-cookie"

export function useLogin() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginAdmin(username, password),
    onSuccess: (data) => {
      if (data.success && data.token && data.admin) {
        setAuthCookie(data.token)
        login(data.token, data.admin)
        router.push("/dashboard")
      }
    },
  })
}