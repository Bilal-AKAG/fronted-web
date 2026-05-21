import { useAuthStore } from "@/lib/store/auth-store"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://fuel-aware-backend.onrender.com"

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message)
    this.name = "ApiError"
  }
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, headers: customHeaders, ...fetchOptions } = options

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  }

  if (requiresAuth) {
    const token = useAuthStore.getState().token
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(
      errorData?.error?.message || response.statusText,
      errorData?.error?.code || "UNKNOWN_ERROR",
      response.status
    )
  }

  return response.json()
}