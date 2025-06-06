"use client"

import { useState } from "react"
import { Plus, Filter, Search, User, Edit2, Sun, Moon, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddFlowerModal from "@/components/add-flower-modal"
import FeedbackModal from "@/components/feedback-modal"
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
import { Input } from "@/components/ui/input"

interface MobileBottomNavProps {
  onSearchToggle: () => void
  onFilterChange: (filters: { category?: string | null; stage?: string | null }) => void
  currentFilters: { category?: string | null; stage?: string | null }
  username?: string
}

export default function MobileBottomNav({ 
  onSearchToggle, 
  onFilterChange, 
  currentFilters,
  username = "User"
}: MobileBottomNavProps) {
  const { logout, user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [editedUsername, setEditedUsername] = useState(username)
  const [currentUsername, setCurrentUsername] = useState(username)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)

  const handleSaveUsername = () => {
    setCurrentUsername(editedUsername)
    setIsEditingUsername(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleFilterSelect = (type: 'category' | 'stage', value: string | null) => {
    onFilterChange({
      ...currentFilters,
      [type]: value
    })
  }

  return (
    <>
      {/* Mobile Bottom Navigation - only show on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
          
          {/* Search Button */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-12 px-1 text-gray-600 dark:text-gray-400 hover:text-[#2E4D2E] dark:hover:text-green-300"
            onClick={onSearchToggle}
          >
            <Search className="w-4 h-4 mb-1" />
            <span className="text-xs">Search</span>
          </Button>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`flex-col h-12 px-1 ${
                  currentFilters.category || currentFilters.stage
                    ? 'text-[#2E4D2E] dark:text-green-300'
                    : 'text-gray-600 dark:text-gray-400'
                } hover:text-[#2E4D2E] dark:hover:text-green-300`}
              >
                <Filter className="w-4 h-4 mb-1" />
                <span className="text-xs">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              side="top"
              className="w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-0 shadow-xl mb-2"
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

          {/* Theme Toggle */}
          <div className="flex-col flex items-center">
            <ThemeToggle />
          </div>

          {/* Add Button - Center, larger */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-[#2E4D2E] to-[#1D3C1D] hover:from-[#1D3C1D] hover:to-[#0F2A0F] dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white border-0 shadow-lg rounded-full w-12 h-12 flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
          </Button>

          {/* Account Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-col h-12 px-1 text-gray-600 dark:text-gray-400 hover:text-[#2E4D2E] dark:hover:text-green-300"
              >
                <User className="w-4 h-4 mb-1" />
                <span className="text-xs">Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              side="top"
              className="w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-0 shadow-xl mb-2"
            >
              <DropdownMenuLabel>@{currentUsername}</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
              <DropdownMenuItem 
                onClick={() => setIsEditingUsername(true)}
                className="hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsFeedbackModalOpen(true)}
                className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Feedback
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      {/* Add Flower Modal */}
      <AddFlowerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        userEmail={user?.email || undefined}
        userName={currentUsername}
      />

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
    </>
  )
} 