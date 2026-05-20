"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconDashboard,
  IconTruck,
  IconBell,
  IconHistory,
  IconChartBar,
  IconGasStation,
  IconDeviceDesktop,
  IconUsers,
  IconRoute,
} from "@tabler/icons-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: IconDashboard },
  { href: "/dashboard/vehicles", label: "Vehicles", icon: IconTruck },
  { href: "/dashboard/devices", label: "Devices", icon: IconDeviceDesktop },
  { href: "/dashboard/drivers", label: "Drivers", icon: IconUsers },
  { href: "/dashboard/trips", label: "Trips", icon: IconRoute },
  { href: "/dashboard/alerts", label: "Alerts", icon: IconBell },
  { href: "/dashboard/history", label: "History", icon: IconHistory },
  { href: "/dashboard/analytics", label: "Analytics", icon: IconChartBar },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1">
          <IconGasStation className="size-5 text-primary" />
          <span className="font-heading text-sm font-semibold">Fuel-Aware</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
