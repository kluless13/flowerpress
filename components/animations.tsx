"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function FadeIn({ children, className = "", delay = 0 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface PressedFlowerAnimationProps {
  children: ReactNode
  className?: string
  daysElapsed: number
}

// Enhance the PressedFlowerAnimation component to make the effects more noticeable
export function PressedFlowerAnimation({ children, className = "", daysElapsed }: PressedFlowerAnimationProps) {
  // Calculate animation values based on days elapsed
  // Make the effects more pronounced for demonstration purposes

  // Scale: gradually flatten from 1.0 to 0.9 over 90 days (less extreme)
  const scale = Math.max(0.9, 1 - daysElapsed * 0.0011)

  // Saturation: gradually reduce from 100% to 65% over 90 days
  const saturation = Math.max(65, 100 - daysElapsed * 0.39)

  // Opacity: gradually reduce from 1.0 to 0.85 over 120 days (less extreme)
  const opacity = Math.max(0.85, 1 - daysElapsed * 0.00125)

  // Sepia: add a sepia tone, maxing out at 25%
  const sepia = Math.min(25, daysElapsed * 0.21)

  console.log('Animation values:', { daysElapsed, scale, saturation, opacity, sepia })

  return (
    <motion.div
      className={className}
      style={{
        scale,
        filter: `saturate(${saturation}%) sepia(${sepia}%)`,
        opacity,
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}
