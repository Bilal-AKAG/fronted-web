"use client"

import React from "react"

interface AnimatedGroupProps {
  children?: React.ReactNode
  className?: string
  variants?: {
    container?: { visible: { transition: { staggerChildren?: number; delayChildren: number } } }
    item?: { hidden: { opacity: number; y: number }; visible: { opacity: number; y: number; transition: { type: string; bounce: number; duration: number } } }
  }
}

export function AnimatedGroup({
  children,
  className,
}: AnimatedGroupProps) {
  return <div className={className}>{children}</div>
}

AnimatedGroup.displayName = "AnimatedGroup"