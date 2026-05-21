"use client"
import { useState } from "react"
import { IconGasStation } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLogin } from "@/hooks/use-auth"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const loginMutation = useLogin()

  const handleLogin = () => {
    if (!username || !password) {
      return
    }
    loginMutation.mutate(
      { username, password },
      {
        onError: () => {
          setUsername("")
          setPassword("")
        },
        onSuccess: (data) => {
          if (!data.success) {
            setUsername("")
            setPassword("")
          }
        },
      }
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <IconGasStation className="size-8 text-primary" />
          <h1 className="font-heading text-2xl font-bold">FuelGuard Admin</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loginMutation.isPending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loginMutation.isPending}
            />
          </div>
          {loginMutation.isError && (
            <p className="text-sm text-destructive">
              {loginMutation.error.message || "Invalid username or password"}
            </p>
          )}
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </div>
    </div>
  )
}