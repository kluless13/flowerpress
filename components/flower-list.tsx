"use client"

import { useEffect } from "react"
import Image from "next/image"
import FlowerCard from "@/components/flower-card"
import { FlowerCardSkeleton } from "@/components/loading-skeletons"
import { useFlowers } from "@/hooks/useFlowers"
import { Flower } from "@/lib/types"
import { FlowerService, ImageService } from "@/lib/firebase-services"

// Expanded mock data with different aspect ratios for asymmetrical cards
const mockFlowers = [
  // Fresh flowers (today/yesterday)
  {
    id: "1",
    imageUrl: "/fresh-tulip.png",
    note: "Just picked this tulip from my garden this morning.",
    dateTaken: new Date(2025, 2, 17), // Today
    category: "garden",
    aspectRatio: 0.8, // Tall
  },
  {
    id: "2",
    imageUrl: "/fresh-daisy.png",
    note: "Found this daisy on my morning walk.",
    dateTaken: new Date(2025, 2, 16), // Yesterday
    category: "wild",
    aspectRatio: 1.2, // Wide
  },
  {
    id: "3",
    imageUrl: "/fresh-poppy.png",
    note: "Beautiful red poppy from the meadow.",
    dateTaken: new Date(2025, 2, 17), // Today
    category: "wild",
    aspectRatio: 0.9, // Slightly tall
  },
  {
    id: "4",
    imageUrl: "/fresh-cosmos.png",
    note: "Pink cosmos from the community garden.",
    dateTaken: new Date(2025, 2, 15), // 2 days ago
    category: "garden",
    aspectRatio: 1.4, // Wide
  },

  // Week-old flowers (early pressing stage)
  {
    id: "5",
    imageUrl: "/week-old-rose.png",
    note: "Rose from last week's bouquet, starting to flatten.",
    dateTaken: new Date(2025, 2, 10), // About a week ago
    category: "garden",
    aspectRatio: 0.75, // Very tall
  },
  {
    id: "6",
    imageUrl: "/week-old-lavender.png",
    note: "Lavender from our weekend hike.",
    dateTaken: new Date(2025, 2, 9), // About 8 days ago
    category: "herbs",
    aspectRatio: 1.1, // Slightly wide
  },
  {
    id: "7",
    imageUrl: "/week-old-buttercup.png",
    note: "Yellow buttercup from the riverside path.",
    dateTaken: new Date(2025, 2, 8), // About 9 days ago
    category: "wild",
    aspectRatio: 1.0, // Square
  },
  {
    id: "8",
    imageUrl: "/week-old-bluebell.png",
    note: "Bluebells from the forest walk last weekend.",
    dateTaken: new Date(2025, 2, 7), // About 10 days ago
    category: "wild",
    aspectRatio: 0.85, // Tall
  },

  // Month-old flowers (mid-pressing stage)
  {
    id: "9",
    imageUrl: "/month-old-wildflower.png",
    note: "Spring wildflower from the meadow, nicely pressed now.",
    dateTaken: new Date(2025, 1, 17), // About a month ago
    category: "wild",
    aspectRatio: 1.3, // Wide
  },
  {
    id: "10",
    imageUrl: "/month-old-forget-me-not.png",
    note: "Forget-me-nots from the creek side, color starting to fade.",
    dateTaken: new Date(2025, 1, 15), // About a month ago
    category: "wild",
    aspectRatio: 0.9, // Slightly tall
  },
  {
    id: "11",
    imageUrl: "/month-old-pansy.png",
    note: "Purple pansy from the window box, flattening nicely.",
    dateTaken: new Date(2025, 1, 20), // About a month ago
    category: "garden",
    aspectRatio: 1.15, // Slightly wide
  },
  {
    id: "12",
    imageUrl: "/month-old-primrose.png",
    note: "Yellow primrose from the early spring garden.",
    dateTaken: new Date(2025, 1, 25), // About 3 weeks ago
    category: "garden",
    aspectRatio: 0.8, // Tall
  },

  // Several months old (fully pressed)
  {
    id: "13",
    imageUrl: "/old-pressed-sunflower.png",
    note: "Sunflower from last summer, fully pressed and preserved.",
    dateTaken: new Date(2024, 10, 15), // About 4 months ago
    category: "garden",
    aspectRatio: 1.5, // Very wide
  },
  {
    id: "14",
    imageUrl: "/old-pressed-violet.png",
    note: "Violet from early winter, completely flat and desaturated now.",
    dateTaken: new Date(2024, 9, 20), // About 5 months ago
    category: "wild",
    aspectRatio: 0.7, // Very tall
  },
  {
    id: "15",
    imageUrl: "/old-pressed-lily.png",
    note: "Lily from last fall, showing beautiful aging patterns.",
    dateTaken: new Date(2024, 7, 5), // About 7 months ago
    category: "garden",
    aspectRatio: 1.25, // Wide
  },
  {
    id: "16",
    imageUrl: "/old-pressed-dahlia.png",
    note: "Dahlia from the autumn garden, perfectly preserved.",
    dateTaken: new Date(2024, 8, 10), // About 6 months ago
    category: "garden",
    aspectRatio: 0.95, // Almost square
  },

  // Very old specimens (vintage)
  {
    id: "17",
    imageUrl: "/vintage-pressed-rose.png",
    note: "Antique rose from my grandmother's collection, over a year old.",
    dateTaken: new Date(2023, 5, 15), // About 9 months ago
    category: "garden",
    aspectRatio: 0.85, // Tall
  },
  {
    id: "18",
    imageUrl: "/vintage-pressed-fern.png",
    note: "Delicate fern frond from last spring's botanical expedition.",
    dateTaken: new Date(2023, 3, 20), // About 11 months ago
    category: "herbs",
    aspectRatio: 1.35, // Wide
  },
]

interface FlowerListProps {
  searchQuery?: string
  userId?: string
  filters?: {
    category?: 'garden' | 'wild' | 'herbs' | null;
    stage?: 'fresh' | 'pressing' | 'pressed' | 'preserved' | null;
  }
}

export default function FlowerList({ searchQuery = "", userId, filters }: FlowerListProps) {
  const { flowers, loading, error, hasMore, loadMore, refresh } = useFlowers(userId || null, searchQuery, filters)

  const handleDeleteFlower = async (flowerId: string) => {
    if (!userId) return
    
    try {
      // Find the flower to get the image URL for deletion
      const flower = flowers.find(f => f.id === flowerId)
      
      // Delete the flower from Firestore
      await FlowerService.deleteFlower(flowerId)
      
      // Delete the associated image from storage if it exists
      if (flower?.imageUrl) {
        try {
          await ImageService.deleteImage(flower.imageUrl)
        } catch (imageError) {
          console.warn("Could not delete image:", imageError)
          // Continue even if image deletion fails
        }
      }
      
      // Refresh the flowers list
      refresh()
    } catch (error) {
      console.error("Error deleting flower:", error)
      alert("Failed to delete flower. Please try again.")
    }
  }

  // Handle scroll to implement infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 500 &&
        !loading &&
        !searchQuery && // Only load more if not searching
        hasMore
      ) {
        loadMore()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loading, searchQuery, hasMore, loadMore])

  // Calculate days elapsed for each flower
  const today = new Date()

  // Create masonry columns
  const createMasonryColumns = (items: Flower[], columnCount: number) => {
    const columns: Flower[][] = Array.from({ length: columnCount }, () => [])

    items.forEach((item, index) => {
      const columnIndex = index % columnCount
      columns[columnIndex].push(item)
    })

    return columns
  }

  if (error) {
    return (
      <div className="mt-6 text-center">
        <div className="text-red-600 dark:text-red-400">
          <p className="text-lg font-medium">Error loading flowers</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">Please sign in to view your flowers</p>
      </div>
    )
  }

  if (loading && flowers.length === 0) {
    return (
      <div className="mt-6">
        {/* Mobile: 2 columns */}
        <div className="block sm:hidden">
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <FlowerCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Tablet: 3 columns */}
        <div className="hidden sm:block lg:hidden">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <FlowerCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Desktop: 4 columns */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <FlowerCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (flowers.length === 0) {
    return (
      <div className="mt-6 text-center">
        <div className="text-gray-600 dark:text-gray-400">
          <p className="text-lg font-medium">No flowers found</p>
          {searchQuery ? (
            <p className="text-sm mt-2">Try a different search term</p>
          ) : (
            <p className="text-sm mt-2">Start by adding your first pressed flower!</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6">
      {/* Mobile: 2 columns */}
      <div className="block sm:hidden">
        <div className="grid grid-cols-2 gap-3">
          {createMasonryColumns(flowers, 2).map((column, columnIndex) => (
            <div key={columnIndex} className="space-y-3">
              {column.map((flower) => {
                const flowerDate = flower.dateTaken instanceof Date ? flower.dateTaken : flower.dateTaken.toDate()
                const daysElapsed = Math.floor((today.getTime() - flowerDate.getTime()) / (1000 * 60 * 60 * 24))
                return (
                  <FlowerCard
                    key={flower.id}
                    id={flower.id}
                    imageUrl={flower.imageUrl}
                    note={flower.note}
                    dateTaken={flowerDate}
                    daysElapsed={daysElapsed}
                    category={flower.category}
                    aspectRatio={flower.aspectRatio}
                    background={flower.background}
                    onDelete={handleDeleteFlower}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tablet: 3 columns */}
      <div className="hidden sm:block lg:hidden">
        <div className="grid grid-cols-3 gap-4">
          {createMasonryColumns(flowers, 3).map((column, columnIndex) => (
            <div key={columnIndex} className="space-y-4">
              {column.map((flower) => {
                const flowerDate = flower.dateTaken instanceof Date ? flower.dateTaken : flower.dateTaken.toDate()
                const daysElapsed = Math.floor((today.getTime() - flowerDate.getTime()) / (1000 * 60 * 60 * 24))
                return (
                  <FlowerCard
                    key={flower.id}
                    id={flower.id}
                    imageUrl={flower.imageUrl}
                    note={flower.note}
                    dateTaken={flowerDate}
                    daysElapsed={daysElapsed}
                    category={flower.category}
                    aspectRatio={flower.aspectRatio}
                    background={flower.background}
                    onDelete={handleDeleteFlower}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: 4 columns */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-4 gap-6">
          {createMasonryColumns(flowers, 4).map((column, columnIndex) => (
            <div key={columnIndex} className="space-y-6">
              {column.map((flower) => {
                const flowerDate = flower.dateTaken instanceof Date ? flower.dateTaken : flower.dateTaken.toDate()
                const daysElapsed = Math.floor((today.getTime() - flowerDate.getTime()) / (1000 * 60 * 60 * 24))
                return (
                  <FlowerCard
                    key={flower.id}
                    id={flower.id}
                    imageUrl={flower.imageUrl}
                    note={flower.note}
                    dateTaken={flowerDate}
                    daysElapsed={daysElapsed}
                    category={flower.category}
                    aspectRatio={flower.aspectRatio}
                    background={flower.background}
                    onDelete={handleDeleteFlower}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Loading indicator for infinite scroll */}
      {loading && flowers.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span>Loading more flowers...</span>
          </div>
        </div>
      )}

      {/* End indicator */}
      {!hasMore && flowers.length > 0 && !searchQuery && (
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
          <p>You've reached the end of your collection!</p>
        </div>
      )}
    </div>
  )
}
