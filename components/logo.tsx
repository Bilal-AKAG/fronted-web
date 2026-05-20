import { IconGasStation } from "@tabler/icons-react"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <IconGasStation className="size-7 text-primary" />
      <span className="font-heading text-xl font-bold">FuelGuard</span>
    </div>
  )
}