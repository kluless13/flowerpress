"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { MessageSquare, Calendar, Trash2 } from "lucide-react"
import { PressedFlowerAnimation } from "@/components/animations"
import { motion, AnimatePresence } from "framer-motion"

// Helper function to get correct file extension for preset backgrounds
const getPresetImagePath = (value: string): string => {
  const extensions: Record<string, string> = {
    'paper1': '/paper1.jpeg',
    'paper2': '/paper2.jpg',
    'anna-karenina': '/anna-karenina.jpg',
    'rabbits': '/rabbits.jpg',
  }
  return extensions[value] || `/${value}.png`
}

interface FlowerCardProps {
  id?: string
  imageUrl: string
  note: string
  dateTaken: Date
  daysElapsed: number
  category?: string
  aspectRatio?: number // New prop for different ratios
  background?: {
    type: 'none' | 'preset' | 'custom'
    value?: string
  }
  onDelete?: (id: string) => void
}

export default function FlowerCard({
  id,
  imageUrl,
  note,
  dateTaken,
  daysElapsed,
  category,
  aspectRatio = 1.33,
  background,
  onDelete,
}: FlowerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Format the date
  const formattedDate = dateTaken.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  const formattedLongDate = dateTaken.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Determine pressing stage with colors
  let pressingStage = ""
  let stageColor = ""
  let stageCircleColor = ""

  if (daysElapsed < 7) {
    pressingStage = "Fresh"
    stageColor = "bg-gradient-to-br from-emerald-400 to-emerald-600"
    stageCircleColor = "bg-gradient-to-br from-emerald-400 to-emerald-600"
  } else if (daysElapsed < 30) {
    pressingStage = "Pressing"
    stageColor = "bg-gradient-to-br from-amber-400 to-amber-600"
    stageCircleColor = "bg-gradient-to-br from-amber-400 to-amber-600"
  } else if (daysElapsed < 90) {
    pressingStage = "Pressed"
    stageColor = "bg-gradient-to-br from-orange-400 to-orange-600"
    stageCircleColor = "bg-gradient-to-br from-orange-400 to-orange-600"
  } else {
    pressingStage = "Preserved"
    stageColor = "bg-gradient-to-br from-rose-400 to-rose-600"
    stageCircleColor = "bg-gradient-to-br from-rose-400 to-rose-600"
  }

  // Get category display name
  const getCategoryDisplayName = (categoryValue?: string) => {
    const categories = {
      garden: "Garden Flowers",
      wild: "Wildflowers",
      herbs: "Herbs & Botanicals",
    }
    return categoryValue ? categories[categoryValue as keyof typeof categories] || categoryValue : "Uncategorized"
  }

  const categoryDisplayName = getCategoryDisplayName(category)

  return (
    <div className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          setIsExpanded(!isExpanded)
          setIsHovered(false) // Clear hover state when clicking
        }}
      >
        <div 
          className="transition-all duration-700 ease-in-out"
          style={{
            transform: `scale(${Math.max(0.9, 1 - daysElapsed * 0.0011)})`,
            filter: `saturate(${Math.max(65, 100 - daysElapsed * 0.39)}%) sepia(${Math.min(25, daysElapsed * 0.21)}%)`,
            opacity: Math.max(0.85, 1 - daysElapsed * 0.00125)
          }}
        >
          <div className="relative w-full" style={{ aspectRatio: aspectRatio }}>
            {/* Background Paper - cropped to flower's aspect ratio */}
            {background && background.type !== 'none' && (
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <Image
                  src={background.type === 'preset' ? getPresetImagePath(background.value!) : background.value!}
                  alt="Background paper"
                  fill
                  className="object-cover"
                  style={{ zIndex: 1 }}
                />
              </div>
            )}
            
            {/* Flower Image - on top of background */}
            <div className="relative w-full h-full" style={{ zIndex: 2 }}>
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt="Pressed flower"
                fill
                className="object-contain transition-transform duration-300 hover:scale-105 rounded-2xl"
              />
            </div>

            {/* Subtle gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 rounded-2xl" />

            {/* Date stamp - top left */}
            <div className="absolute top-2 left-2 bg-black/40 text-white text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm">
              {formattedDate}
            </div>

            {/* Pressing stage indicator - just colored circle, top right */}
            <div className="absolute top-2 right-2">
              <div
                className={`w-3 h-3 rounded-full ${stageCircleColor} shadow-lg border border-white/30`}
                title={pressingStage}
              ></div>
            </div>

            {/* Quick preview on hover (desktop only) */}
            <div
              className={`absolute bottom-0 left-0 right-0 z-10 transition-all duration-300 ease-in-out pointer-events-none hidden md:block ${
                isHovered && !isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
              style={{ zIndex: 10 }}
            >
              <div className="p-3">
                <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
                  <p className="text-white text-sm font-medium leading-relaxed">
                    {note && note.trim() ? (note.length > 80 ? `${note.substring(0, 80)}...` : note) : "No notes available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-t-2xl">
              {/* Detailed date info */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>{formattedLongDate}</span>
              </div>

              {/* Pressing stage with colored circle */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stageCircleColor} shadow-lg`}></div>
                <div className={`${stageColor} text-white text-sm font-medium px-3 py-1 rounded-full shadow-lg`}>
                  {pressingStage}
                </div>
              </div>

              {/* Days elapsed on separate row */}
              <div className="text-right">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {daysElapsed} {daysElapsed === 1 ? "day" : "days"} ago
                </span>
              </div>

              {/* Category information */}
              {category && (
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#2E4D2E] to-[#1D3C1D] dark:from-green-600 dark:to-green-700 shadow-sm"></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Category</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{categoryDisplayName}</span>
                  </div>
                </div>
              )}

              {/* Full note */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MessageSquare className="w-4 h-4" />
                  <span>Notes</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-6">{note}</p>
              </div>

              {/* Pressing progress indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Pressing Progress</span>
                  <span>{Math.min(100, Math.round((daysElapsed / 90) * 100))}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-2 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${Math.min(100, (daysElapsed / 90) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Delete button */}
              {id && onDelete && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('Are you sure you want to delete this flower? This action cannot be undone.')) {
                        onDelete(id)
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Flower
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
