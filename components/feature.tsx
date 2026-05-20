"use client"

import {
  IconGasStation,
  IconMapPin,
  IconBellRinging,
  IconTruck,
  IconUsers,
  IconDeviceDesktop,
} from "@tabler/icons-react"

export default function Features() {
  return (
    <section id="features" className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-4xl font-medium text-balance lg:text-5xl">
            Features
          </h2>
          <p className="text-muted-foreground">
            Comprehensive fleet management features powered by real-time telemetry from ESP32 hardware.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconGasStation className="size-5 text-primary" />
              <h3 className="text-sm font-medium">Real-Time Fuel Monitoring</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Live fuel level tracking in liters and percentage from ESP32 sensors.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <IconMapPin className="size-5 text-primary" />
              <h3 className="text-sm font-medium">GPS Location Tracking</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Real-time vehicle location with geofencing and movement history.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <IconBellRinging className="size-5 text-primary" />

              <h3 className="text-sm font-medium">Smart Alert System</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Rule-based alerts for low fuel, overspeeding, theft, and device status.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <IconTruck className="size-5 text-primary" />

              <h3 className="text-sm font-medium">Vehicle Management</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Register and manage fleet with full metadata - make, model, tank capacity.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <IconUsers className="size-5 text-primary" />

              <h3 className="text-sm font-medium">Driver Management</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Track driver assignments and maintain complete violation history.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <IconDeviceDesktop className="size-5 text-primary" />

              <h3 className="text-sm font-medium">Device Management</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Register ESP32 devices, assign to vehicles, track firmware versions.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}