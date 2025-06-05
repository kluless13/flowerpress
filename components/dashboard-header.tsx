"use client"

import { useState } from "react"
import { Plus, Filter, Edit2, Search, X, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AddFlowerModal from "@/components/add-flower-modal"
import ThemeToggle from "@/components/theme-toggle"
import { useAuth } from "@/hooks/useAuth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface DashboardHeaderProps {
  username?: string
  onSearchChange?: (query: string) => void
  onFilterChange?: (filters: { category?: string | null; stage?: string | null }) => void
  currentFilters?: { category?: string | null; stage?: string | null }
}

export default function DashboardHeader({ 
  username = "User", 
  onSearchChange, 
  onFilterChange,
  currentFilters = {}
}: DashboardHeaderProps) {
  const { logout } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showStagesInfo, setShowStagesInfo] = useState(false)
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [editedUsername, setEditedUsername] = useState(username)
  const [currentUsername, setCurrentUsername] = useState(username)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSaveUsername = () => {
    setCurrentUsername(editedUsername)
    setIsEditingUsername(false)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearchChange?.(value)
  }

  const clearSearch = () => {
    setSearchQuery("")
    onSearchChange?.("")
    setShowSearch(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleFilterSelect = (type: 'category' | 'stage', value: string | null) => {
    onFilterChange?.({
      ...currentFilters,
      [type]: value
    })
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-gradient-to-br from-[#F5E6E8] via-[#E8F5E6] to-[#F0F8F0] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 backdrop-blur-xl border-0 hidden md:block">
        <div className="container max-w-6xl mx-auto px-4 py-3">
          {/* Main header row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-serif italic text-[#2E4D2E] dark:text-green-300">
                Hello, @{currentUsername}
              </h1>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-500 hover:text-[#2E4D2E] dark:hover:text-green-300 border-0"
                onClick={() => setIsEditingUsername(true)}
              >
                <Edit2 className="h-3 w-3" />
                <span className="sr-only">Edit username</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#2E4D2E] dark:text-green-300 border-0 bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-600/50"
                  >
                    <User className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline-block">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl"
                >
                  <DropdownMenuLabel>Signed in as @{currentUsername}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                  <DropdownMenuItem 
                    onClick={() => setIsEditingUsername(true)}
                    className="hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                className="text-[#2E4D2E] dark:text-green-300 border-0 bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-600/50"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline-block">Search</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#2E4D2E] dark:text-green-300 border-0 bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-600/50"
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline-block">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl"
                >
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem 
                      onClick={() => handleFilterSelect('category', null)}
                      className={`hover:bg-green-50 dark:hover:bg-green-900/20 ${
                        !currentFilters.category ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                    >
                      All Flowers
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleFilterSelect('category', 'garden')}
                      className={`hover:bg-green-50 dark:hover:bg-green-900/20 ${
                        currentFilters.category === 'garden' ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                    >
                      Garden Flowers
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleFilterSelect('category', 'wild')}
                      className={`hover:bg-green-50 dark:hover:bg-green-900/20 ${
                        currentFilters.category === 'wild' ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                    >
                      Wildflowers
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleFilterSelect('category', 'herbs')}
                      className={`hover:bg-green-50 dark:hover:bg-green-900/20 ${
                        currentFilters.category === 'herbs' ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                    >
                      Herbs & Botanicals
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                  <DropdownMenuLabel>Filter by Stage</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem 
                      onClick={() => handleFilterSelect('stage', null)}
                      className={`hover:bg-green-50 dark:hover:bg-green-900/20 ${
                        !currentFilters.stage ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                    >
                      All Stages
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleFilterSelect('stage', 'fresh')}
                      className={`hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${
                        currentFilters.stage === 'fresh' ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm"></div>
                        <span>Fresh (0-7 days)</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleFilterSelect('stage', 'pressing')}
                      className={`hover:bg-amber-50 dark:hover:bg-amber-900/20 ${
                        currentFilters.stage === 'pressing' ? 'bg-amber-50 dark:bg-amber-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-sm"></div>
                        <span>Pressing (7-30 days)</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleFilterSelect('stage', 'pressed')}
                      className={`hover:bg-orange-50 dark:hover:bg-orange-900/20 ${
                        currentFilters.stage === 'pressed' ? 'bg-orange-50 dark:bg-orange-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm"></div>
                        <span>Pressed (30-90 days)</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleFilterSelect('stage', 'preserved')}
                      className={`hover:bg-rose-50 dark:hover:bg-rose-900/20 ${
                        currentFilters.stage === 'preserved' ? 'bg-rose-50 dark:bg-rose-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-sm"></div>
                        <span>Preserved (90+ days)</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-[#2E4D2E] to-[#1D3C1D] hover:from-[#1D3C1D] hover:to-[#0F2A0F] dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white border-0 shadow-lg"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline-block">Add</span>
              </Button>
            </div>
          </div>

          {/* Search bar */}
          {showSearch && (
            <div className="mb-3">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by date, note, or category..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-10 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-0 focus:bg-white/70 dark:focus:bg-gray-700/70"
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
        </div>

        {/* Pressing stages info */}
        {showStagesInfo && (
          <div className="container max-w-6xl mx-auto px-4 py-2 bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm">
            <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
              <h3 className="font-medium">Flower Pressing Stages:</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600"></div>
                  <span>Fresh (0-7 days)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-amber-600"></div>
                  <span>Pressing (7-30 days)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-600"></div>
                  <span>Pressed (30-90 days)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-rose-400 to-rose-600"></div>
                  <span>Preserved (90+ days)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Edit Username Dialog */}
      <Dialog open={isEditingUsername} onOpenChange={setIsEditingUsername}>
        <DialogContent className="sm:max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="font-serif italic text-[#2E4D2E] dark:text-green-300">
              Change Your Username
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium dark:text-gray-300">
                Username
              </Label>
              <div className="flex items-center">
                <span className="mr-1 text-gray-500 dark:text-gray-400">@</span>
                <Input
                  id="username"
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  className="dark:bg-gray-700/50 dark:border-gray-600/50 border-0 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your username"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This will be displayed throughout your flower pressing app.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditingUsername(false)}
              className="border-0 bg-gray-100/50 dark:bg-gray-700/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUsername}
              className="bg-gradient-to-r from-[#2E4D2E] to-[#1D3C1D] hover:from-[#1D3C1D] hover:to-[#0F2A0F] dark:from-green-600 dark:to-green-700 text-white border-0"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddFlowerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
