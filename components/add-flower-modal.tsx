"use client"

import type React from "react"
import { useState } from "react"
import { Camera, Upload, X, CheckCircle2, Loader2, Scissors, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { useFlowers } from "@/hooks/useFlowers"
import { removeBackground } from "@imgly/background-removal"
import BackgroundSelector from "@/components/background-selector"

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

interface AddFlowerModalProps {
  isOpen: boolean
  onClose: () => void
}

// Flower categories matching the filter options
const FLOWER_CATEGORIES = [
  { value: "garden", label: "Garden Flowers" },
  { value: "wild", label: "Wildflowers" },
  { value: "herbs", label: "Herbs & Botanicals" },
]

// Warm success messages from Preston
const SUCCESS_MESSAGES = [
  "We will press this for you Liyatree, have a great day!",
  "Your flower is in good hands, Liyatree. Enjoy your botanical journey!",
  "Consider it done, Liyatree! Your flower will be beautifully preserved.",
  "Another lovely addition to your collection, Liyatree. Well chosen!",
  "I'll take excellent care of this flower for you, Liyatree. Until next time!",
  "Your flower is now being pressed with care, Liyatree. Have a wonderful day!",
  "What a beautiful specimen, Liyatree! I'll ensure it's perfectly preserved.",
  "Your botanical collection grows more beautiful, Liyatree. Splendid work!",
  "This flower will make a wonderful addition, Liyatree. Leave it to me!",
  "Another treasure for your collection, Liyatree. I'm delighted to help!",
  "Your flower is safe with me, Liyatree. May your day bloom with joy!",
  "Excellent choice, Liyatree! This flower will be pressed to perfection.",
]

// Excited header messages for when adding flowers
const EXCITED_HEADER_MESSAGES = [
  "OOOH I LOVE THIS! ♥",
  "Wow this one's pretty!",
  "What a beautiful find! ✨",
  "Oh my, this is gorgeous!",
  "Absolutely stunning! 🌸",
  "This is magnificent!",
  "How lovely, Liyatree!",
  "What a treasure! 💎",
  "Simply exquisite!",
  "Oh, this is delightful!",
  "Marvelous choice! 🌺",
  "This is breathtaking!",
]

export default function AddFlowerModal({ isOpen, onClose }: AddFlowerModalProps) {
  const { user } = useAuth()
  const { addFlower } = useFlowers(user?.uid || null)
  const [activeTab, setActiveTab] = useState("camera")
  const [note, setNote] = useState("")
  const [dateTaken, setDateTaken] = useState(new Date().toISOString().split("T")[0])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [processedFile, setProcessedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showProcessed, setShowProcessed] = useState(false)
  const [category, setCategory] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [headerMessage, setHeaderMessage] = useState("Add New Flower")
  const [error, setError] = useState("")
  const [selectedBackground, setSelectedBackground] = useState<{ type: 'none' | 'preset' | 'custom'; value?: string }>({ type: 'none' })
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null)

  // Helper function to calculate image aspect ratio
  const calculateAspectRatio = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const ratio = img.width / img.height
        resolve(ratio)
        URL.revokeObjectURL(img.src)
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
      setSelectedFile(file)
      setProcessedFile(null)
      setShowProcessed(false)
      setError("")

      // Pick a random excited header message when image is added
      const randomHeader = EXCITED_HEADER_MESSAGES[Math.floor(Math.random() * EXCITED_HEADER_MESSAGES.length)]
      setHeaderMessage(randomHeader)
    }
  }

  const handleRemoveBackground = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setError("")

    try {
      // Convert file to proper format first if needed
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      // Create a promise to handle image loading
      const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = URL.createObjectURL(selectedFile)
      })
      
      const loadedImg = await imageLoadPromise
      
      // Set canvas dimensions
      canvas.width = loadedImg.width
      canvas.height = loadedImg.height
      
      // Draw image to canvas
      ctx?.drawImage(loadedImg, 0, 0)
      
      // Convert canvas to blob with proper format
      const processedBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!)
        }, 'image/png', 0.9)
      })
      
      // Try background removal with the processed blob
      const imageBlob = await removeBackground(processedBlob)
      
      // Convert blob to file
      const processedFile = new File([imageBlob], `processed_${selectedFile.name}`, {
        type: 'image/png'
      })
      
      // Create preview URL for processed image
      const processedUrl = URL.createObjectURL(imageBlob)
      
      setProcessedFile(processedFile)
      setShowProcessed(true)
      
      // Update preview to show processed image
      setPreviewImage(processedUrl)
      
      // Clean up
      URL.revokeObjectURL(img.src)
      
    } catch (error) {
      console.error('Background removal failed:', error)
      setError('Background removal failed. You can still use the original image.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleToggleProcessed = () => {
    if (processedFile && selectedFile) {
      if (showProcessed) {
        // Switch back to original
        const originalUrl = URL.createObjectURL(selectedFile)
        setPreviewImage(originalUrl)
        setShowProcessed(false)
      } else {
        // Switch to processed
        const processedUrl = URL.createObjectURL(processedFile)
        setPreviewImage(processedUrl)
        setShowProcessed(true)
      }
    }
  }

  const handleSave = async () => {
    if (!user) {
      setError("You must be signed in to add flowers")
      return
    }

    if (!previewImage || !note.trim() || !category) {
      setError("Please fill in all fields and select an image")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      // Use processed file if available, otherwise use original
      const fileToUpload = processedFile || selectedFile
      const aspectRatio = await calculateAspectRatio(fileToUpload!)

      const flowerData = {
        imageUrl: previewImage, // This will be replaced if we have a real file
        note: note.trim(),
        dateTaken: new Date(dateTaken),
        category: category as 'garden' | 'wild' | 'herbs',
        aspectRatio,
        background: selectedBackground.type !== 'none' ? selectedBackground : undefined,
      }

      await addFlower(flowerData, fileToUpload || undefined, backgroundFile || undefined)

      // Pick a random success message
      const randomMessage = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]
      setSuccessMessage(randomMessage)

      setIsSaving(false)
      setShowSuccess(true)

      // Auto close after showing success for 5-6 seconds
      setTimeout(() => {
        handleClose()
      }, 5500) // 5.5 seconds

    } catch (error: any) {
      setIsSaving(false)
      setError(error.message || "Failed to save flower. Please try again.")
    }
  }

  const handleClose = () => {
    // Reset everything when modal closes
    setPreviewImage(null)
    setSelectedFile(null)
    setProcessedFile(null)
    setShowProcessed(false)
    setNote("")
    setCategory("")
    setDateTaken(new Date().toISOString().split("T")[0])
    setShowSuccess(false)
    setSuccessMessage("")
    setHeaderMessage("Add New Flower")
    setError("")
    setSelectedBackground({ type: 'none' })
    setBackgroundFile(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif italic text-[#2E4D2E] dark:text-green-300 text-center">
            {headerMessage}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mx-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {showSuccess ? (
          <div className="px-4 py-6">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg shadow-2xl border-0 ring-1 ring-white/20 dark:ring-gray-700/20">
              <CardContent className="p-6 md:p-8">
                <div className="text-center space-y-6">
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shadow-xl">
                      <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                  </div>

                  <div className="space-y-3 text-gray-700 dark:text-gray-300">
                    <p className="text-sm md:text-base leading-relaxed font-serif italic">{successMessage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : !previewImage ? (
          <Tabs defaultValue="camera" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="camera">Camera</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="camera" className="py-4">
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl flex flex-col items-center justify-center">
                <Camera className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Camera functionality coming soon
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
                  For now, please use the upload option
                </p>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="py-4">
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl flex flex-col items-center justify-center relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                />
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Click or drag to upload a flower image</p>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <div className="aspect-square rounded-xl overflow-hidden">
                {/* Background Paper */}
                {selectedBackground && selectedBackground.type !== 'none' && (
                  <div className="absolute inset-0">
                    <img
                      src={selectedBackground.type === 'preset' ? getPresetImagePath(selectedBackground.value!) : selectedBackground.value!}
                      alt="Background paper"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Flower Image */}
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt="Flower preview"
                  className="relative w-full h-full object-contain"
                  style={{ zIndex: 2 }}
                />
                
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center" style={{ zIndex: 3 }}>
                    <div className="text-center space-y-2">
                      <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                      <p className="text-white">Removing background...</p>
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50"
                onClick={() => {
                  setPreviewImage(null)
                  setHeaderMessage("Add New Flower") // Reset header when removing image
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Background removal controls */}
            <div className="flex gap-2">
              {!processedFile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveBackground}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Removing background...
                    </>
                  ) : (
                    <>
                      <Scissors className="w-4 h-4 mr-2" />
                      Remove Background
                    </>
                  )}
                </Button>
              )}
              
              {processedFile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleProcessed}
                  className="flex-1"
                >
                  {showProcessed ? (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Show Original
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Show Processed
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium dark:text-gray-300">
                Flower Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {FLOWER_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-collected" className="text-sm font-medium dark:text-gray-300">
                Date Collected
              </Label>
              <Input
                id="date-collected"
                type="date"
                value={dateTaken}
                onChange={(e) => setDateTaken(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="flower-note" className="text-sm font-medium dark:text-gray-300">
                Add your note
              </Label>
              <Textarea
                id="flower-note"
                placeholder="Write something about this flower..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            {/* Background Selector */}
            <BackgroundSelector
              selectedBackground={selectedBackground}
              onBackgroundChange={setSelectedBackground}
              onCustomUpload={setBackgroundFile}
              previewFlowerImage={previewImage || undefined}
            />
          </div>
        )}

        <DialogFooter>
          {previewImage && !showSuccess && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-[#2E4D2E] hover:bg-[#1D3C1D] dark:bg-green-600 dark:hover:bg-green-700 text-white"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving flower...</span>
                </div>
              ) : (
                <span>Save Flower</span>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
