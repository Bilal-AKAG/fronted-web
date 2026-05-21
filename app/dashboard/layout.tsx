import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/dashboard/header"
import { AuthGuard } from "@/components/auth-guard"
import { WebSocketProvider } from "@/components/websocket-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <WebSocketProvider />
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
