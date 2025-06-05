"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import DashboardHeader from "@/components/dashboard-header"
import FlowerList from "@/components/flower-list"
import { FlowerListSkeleton } from "@/components/loading-skeletons"
import BackToTopButton from "@/components/back-to-top-button"
import DateNavigation from "@/components/date-navigation"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [filters, setFilters] = useState<{
    category?: 'garden' | 'wild' | 'herbs' | null;
    stage?: 'fresh' | 'pressing' | 'pressed' | 'preserved' | null;
  }>({})
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const handleSearchToggle = () => {
    setShowSearch(!showSearch)
    if (showSearch) {
      setSearchQuery("")
    }
  }

  const handleFilterChange = (newFilters: { category?: string | null; stage?: string | null }) => {
    setFilters({
      category: newFilters.category as 'garden' | 'wild' | 'herbs' | null,
      stage: newFilters.stage as 'fresh' | 'pressing' | 'pressed' | 'preserved' | null
    })
  }

  const clearSearch = () => {
    setSearchQuery("")
    setShowSearch(false)
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated lava lamp background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5E6E8] via-[#E8F5E6] to-[#F0F8F0] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

        {/* Lava lamp blobs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-rose-300/30 dark:from-pink-800/20 dark:to-rose-700/20 rounded-full blur-xl animate-lava-1"></div>
        <div className="absolute top-1/3 right-20 w-40 h-40 bg-gradient-to-br from-green-200/30 to-emerald-300/30 dark:from-green-800/20 dark:to-emerald-700/20 rounded-full blur-xl animate-lava-2"></div>
        <div className="absolute bottom-1/4 left-1/4 w-36 h-36 bg-gradient-to-br from-purple-200/30 to-violet-300/30 dark:from-purple-800/20 dark:to-violet-700/20 rounded-full blur-xl animate-lava-3"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-gradient-to-br from-yellow-200/30 to-amber-300/30 dark:from-yellow-800/20 dark:to-amber-700/20 rounded-full blur-xl animate-lava-4"></div>
        <div className="absolute top-2/3 left-1/2 w-44 h-44 bg-gradient-to-br from-blue-200/30 to-cyan-300/30 dark:from-blue-800/20 dark:to-cyan-700/20 rounded-full blur-xl animate-lava-5"></div>
      </div>

      <div className="relative z-10">
        <DashboardHeader 
          username={user.displayName || user.email || "User"} 
          onSearchChange={setSearchQuery}
          onFilterChange={handleFilterChange}
          currentFilters={filters}
        />

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 p-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search flowers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 bg-white/70 dark:bg-gray-700/70 border-0 focus:bg-white dark:focus:bg-gray-700"
                autoFocus
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
                  onClick={clearSearch}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="container max-w-6xl mx-auto px-4 pb-20 md:pb-8 relative" style={{ paddingTop: showSearch ? '80px' : '0' }}>
          <DateNavigation />

          <Suspense fallback={<FlowerListSkeleton />}>
            <FlowerList 
              searchQuery={searchQuery} 
              userId={user.uid} 
              filters={filters}
            />
          </Suspense>

          <BackToTopButton />
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav 
          onSearchToggle={handleSearchToggle}
          onFilterChange={handleFilterChange}
          currentFilters={filters}
          username={user.displayName || user.email || "User"}
        />
      </div>
    </main>
  )
}
