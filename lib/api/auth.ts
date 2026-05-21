import { apiClient } from "./client"
import type { LoginRequest, LoginResponse } from "@/lib/types"

export async function loginAdmin(
  username: string,
  password: string
): Promise<LoginResponse> {
  const body: LoginRequest = { username, password }
  return apiClient<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
    requiresAuth: false,
  })
}