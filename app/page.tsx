import Link from "next/link"
import {
  IconGasStation,
  IconMapPin,
  IconBellRinging,
  IconChartLine,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: IconGasStation,
    title: "Real-Time Fuel Monitoring",
    desc: "Live fuel level tracking in liters and percentage. Stay informed about every drop with sensor-fresh data.",
  },
  {
    icon: IconMapPin,
    title: "GPS Location Tracking",
    desc: "Real-time vehicle location with movement history. Know where your fleet is at all times.",
  },
  {
    icon: IconBellRinging,
    title: "Smart Theft Detection",
    desc: "Rule-based alerts for sudden fuel drops, engine-off losses, and abnormal consumption patterns.",
  },
  {
    icon: IconChartLine,
    title: "Analytics & Forecasting",
    desc: "Trip summaries, consumption trends, fuel forecasts, and anomaly scoring powered by historical data.",
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <IconGasStation className="size-6 text-primary" />
          <span className="font-heading text-lg font-semibold">Fuel-Aware</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="font-heading max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Fuel-Aware Smart Inventory System
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Monitor fuel levels, track vehicle locations, detect theft, and make data-driven decisions —
          all in one dashboard.
        </p>
        <div className="mt-8 flex gap-4">
          <Button size="lg" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="rounded-lg border p-6 text-left">
            <f.icon className="mb-3 size-8 text-primary" />
            <h3 className="font-heading mb-1 font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="border-t px-6 py-4 text-center text-sm text-muted-foreground">
        Fuel-Aware Smart Inventory System &mdash; Adama Science and Technology University
      </footer>
    </div>
  )
}
