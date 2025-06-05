import { Skeleton } from "@/components/ui/skeleton"

export function FlowerCardSkeleton() {
  // Random aspect ratios for skeleton cards to match the asymmetrical design
  const aspectRatios = [0.8, 0.9, 1.0, 1.1, 1.2, 1.3]
  const randomAspectRatio = aspectRatios[Math.floor(Math.random() * aspectRatios.length)]

  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg border-0">
      <div style={{ aspectRatio: randomAspectRatio }}>
        <Skeleton className="w-full h-full rounded-2xl" />
      </div>
    </div>
  )
}

export function FlowerListSkeleton() {
  return (
    <div className="mt-6">
      {/* Mobile skeleton */}
      <div className="block sm:hidden">
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <FlowerCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Tablet skeleton */}
      <div className="hidden sm:block lg:hidden">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <FlowerCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Desktop skeleton */}
      <div className="hidden lg:block xl:hidden">
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <FlowerCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Large desktop skeleton */}
      <div className="hidden xl:block">
        <div className="grid grid-cols-6 gap-5">
          {Array.from({ length: 18 }).map((_, i) => (
            <FlowerCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
