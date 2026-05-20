"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"

export default function DriverDetailPage() {
  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" asChild>
        <Link href="/dashboard/drivers">
          <IconArrowLeft className="size-4 mr-2" />
          Back to Drivers
        </Link>
      </Button>

      <div>
        <h1 className="font-heading text-xl font-bold">Driver Details</h1>
        <p className="text-sm text-muted-foreground">Driver Details & Violation History</p>
      </div>

      <div className="flex items-center justify-center py-20 text-center text-muted-foreground">
        <p>This page is under construction. API integration coming soon.</p>
      </div>
    </div>
  )
}