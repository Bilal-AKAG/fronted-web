"use client"

import { useTheme } from "next-themes"
import {
  IconMoon,
  IconSun,
  IconLogout,
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuthStore } from "@/lib/store/auth-store"
import { clearAuthCookie } from "@/lib/auth-cookie"

export function Header() {
  const { resolvedTheme, setTheme } = useTheme()
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "AD"
  const displayName = user?.username ?? "Admin User"

  const handleLogout = () => {
    clearAuthCookie()
    logout()
    router.push("/login")
  }

  return (
    <header className="flex h-12 items-center gap-3 border-b px-4">
      <SidebarTrigger />
      <div className="flex-1" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        {resolvedTheme === "dark" ? <IconSun className="size-4" /> : <IconMoon className="size-4" />}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-7 cursor-pointer">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel className="text-xs">{displayName}</DropdownMenuLabel>
          <DropdownMenuSeparator /> 
          <DropdownMenuItem onClick={handleLogout}>
            <IconLogout className="size-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
