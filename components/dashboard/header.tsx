"use client"

import { useTheme } from "next-themes"
import {
  IconMoon,
  IconSun,
  IconLogout,
  IconUser,
  IconSettings,
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

export function Header() {
  const { resolvedTheme, setTheme } = useTheme()
  const router = useRouter()

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
            <AvatarFallback className="text-xs">AD</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel className="text-xs">Admin User</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/dashboard")}>
            <IconUser className="size-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <IconSettings className="size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/login")}>
            <IconLogout className="size-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
