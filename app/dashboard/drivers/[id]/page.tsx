"use client"

import { useState } from "react"
import { useDriver, useDriverViolations, useUpdateDriver } from "@/hooks/use-drivers"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconArrowLeft, IconEdit } from "@tabler/icons-react"

const severityStyles: Record<string, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
}

export default function DriverDetailPage() {
  const params = useParams()
  const driverId = params.id as string
  const { data: driverData, isLoading: driverLoading } = useDriver(driverId)
  const { data: violationsData, isLoading: violationsLoading } = useDriverViolations(driverId)
  const updateMutation = useUpdateDriver()
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ fullName: "", phoneNumber: "", status: "" })

  const driver = driverData?.driver
  const violations = violationsData?.violations ?? []

  function startEditing() {
    setEditForm({
      fullName: driver?.fullName ?? "",
      phoneNumber: driver?.phoneNumber ?? "",
      status: driver?.status ?? "",
    })
    setEditing(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    await updateMutation.mutateAsync({ driverId, data: editForm })
    setEditing(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/drivers">
            <IconArrowLeft className="mr-2 size-4" />
            Back to Drivers
          </Link>
        </Button>
        {driver && !editing && (
          <Button variant="outline" size="sm" onClick={startEditing}>
            <IconEdit className="mr-2 size-4" />
            Edit
          </Button>
        )}
      </div>

      {driverLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
      ) : !driver ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">Driver not found.</div>
      ) : (
        <>
          <div>
            <h1 className="font-heading text-xl font-bold">{driver.fullName}</h1>
            <p className="text-sm text-muted-foreground">{driver.licenseNumber}</p>
          </div>

          <div className="rounded-lg border p-4">
            {editing ? (
              <form onSubmit={handleSave}>
                <h2 className="mb-4 font-heading text-sm font-semibold">Edit Driver</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-fullName">Full Name</Label>
                    <Input id="edit-fullName" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-phone">Phone Number</Label>
                    <Input id="edit-phone" value={editForm.phoneNumber} onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Status</Label>
                    <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                  <Button type="submit" size="sm" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Phone</span>
                  <p>{driver.phoneNumber ?? "—"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Status</span>
                  <p className="capitalize">{driver.status}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Registered</span>
                  <p>{new Date(driver.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Total Violations</span>
                  <p className="font-heading text-lg font-bold">{violations.length}</p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border">
            <div className="border-b px-4 py-3">
              <h2 className="font-heading text-sm font-semibold">Violation History</h2>
            </div>
            {violationsLoading ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Loading...</div>
            ) : violations.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                No violations recorded.
              </div>
            ) : (
              <div className="divide-y">
                {violations.map((v) => (
                  <div key={v.violationId} className="px-4 py-3 text-sm">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-medium">{v.type.replace(/_/g, " ")}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${severityStyles[v.severity] ?? ""}`}
                      >
                        {v.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{v.description}</p>
                    <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                      <span>Vehicle: {v.vehicleLabel}</span>
                      <span>{new Date(v.occurredAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
