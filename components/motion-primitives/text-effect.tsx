"use client"

import React from "react"

interface TextEffectProps {
  children: React.ReactNode
  as?: React.ElementType
  className?: string
  preset?: string
  speedSegment?: number
  delay?: number
  per?: string
}

export function TextEffect({
  children,
  as: Component = "p",
  className,
}: TextEffectProps) {
  return (
    <Component className={className}>
      {children}
    </Component>
  )
}