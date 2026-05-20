"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconGasStation } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (!username || !password) {
      setError("Username and password are required")
      return
    }
    if (username === "admin" && password === "admin123") {
      router.push("/dashboard")
    } else {
      setError("Invalid username or password")
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
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" onClick={handleLogin}>
            Sign In
          </Button>
        </div>
      </div>
    </div>
  )
}
