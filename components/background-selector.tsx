"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface BackgroundOption {
  type: 'none' | 'preset' | 'custom'
  value?: string
  label: string
  preview?: string
}

interface BackgroundSelectorProps {
  selectedBackground?: { type: 'none' | 'preset' | 'custom'; value?: string }
  onBackgroundChange: (background: { type: 'none' | 'preset' | 'custom'; value?: string }) => void
  onCustomUpload?: (file: File) => void
  previewFlowerImage?: string // Optional flower image to show in preview
}

const PRESET_BACKGROUNDS: BackgroundOption[] = [
  { type: 'none', label: 'No Background' },
  { type: 'preset', value: 'paper1', label: 'Paper 1', preview: '/paper1.jpeg' },
  { type: 'preset', value: 'paper2', label: 'Paper 2', preview: '/paper2.jpg' },
  { type: 'preset', value: 'anna-karenina', label: 'Anna Karenina', preview: '/anna-karenina.jpg' },
  { type: 'preset', value: 'rabbits', label: 'Rabbits', preview: '/rabbits.jpg' },
]

export default function BackgroundSelector({ 
  selectedBackground, 
  onBackgroundChange, 
  onCustomUpload,
  previewFlowerImage 
}: BackgroundSelectorProps) {
  const [customPreview, setCustomPreview] = useState<string | null>(null)

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setCustomPreview(previewUrl)
      onBackgroundChange({ type: 'custom', value: previewUrl })
      onCustomUpload?.(file)
    }
  }

  const isSelected = (option: BackgroundOption) => {
    if (!selectedBackground) return option.type === 'none'
    return selectedBackground.type === option.type && selectedBackground.value === option.value
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700 dark:text-gray-300">
        Background Paper (Optional)
      </h4>
      
      <div className="grid grid-cols-3 gap-3">
        {PRESET_BACKGROUNDS.map((option, index) => (
          <Card
            key={index}
            className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
              isSelected(option) 
                ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onBackgroundChange({ type: option.type, value: option.value })}
            role="button"
            tabIndex={0}
            aria-label={`Select ${option.label} background`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onBackgroundChange({ type: option.type, value: option.value })
              }
            }}
          >
            <div className="aspect-square p-2">
              {option.type === 'none' ? (
                <div className="relative w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                  {previewFlowerImage ? (
                    <>
                      <Image
                        src={previewFlowerImage}
                        alt="Flower preview"
                        fill
                        className="object-cover rounded-lg opacity-60"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                        <X className="w-6 h-6 text-white drop-shadow-lg" />
                      </div>
                    </>
                  ) : (
                    <X className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              ) : (
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {/* Background paper */}
                  <Image
                    src={option.preview!}
                    alt={option.label}
                    fill
                    className="object-cover"
                    style={{ zIndex: 1 }}
                  />
                  
                  {/* Flower overlay preview */}
                  {previewFlowerImage && (
                    <div className="absolute inset-2 flex items-center justify-center" style={{ zIndex: 2 }}>
                      <div className="relative w-12 h-12 overflow-hidden">
                        <Image
                          src={previewFlowerImage}
                          alt="Flower preview"
                          fill
                          className="object-cover opacity-80"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="px-2 pb-2">
              <p className="text-xs text-center font-medium text-gray-600 dark:text-gray-400">
                {option.label}
              </p>
            </div>
          </Card>
        ))}
        
        {/* Custom Upload Option */}
        <Card className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
          selectedBackground?.type === 'custom' 
            ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
            : 'hover:shadow-md'
        }`}>
          <label className="block cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleCustomFileUpload}
              className="hidden"
            />
            <div className="aspect-square p-2">
              {customPreview ? (
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {/* Custom background paper */}
                  <Image
                    src={customPreview}
                    alt="Custom background"
                    fill
                    className="object-cover"
                    style={{ zIndex: 1 }}
                  />
                  
                  {/* Flower overlay preview */}
                  {previewFlowerImage && (
                    <div className="absolute inset-2 flex items-center justify-center" style={{ zIndex: 2 }}>
                      <div className="relative w-12 h-12 overflow-hidden">
                        <Image
                          src={previewFlowerImage}
                          alt="Flower preview"
                          fill
                          className="object-cover opacity-80"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:border-emerald-400 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="px-2 pb-2">
              <p className="text-xs text-center font-medium text-gray-600 dark:text-gray-400">
                Custom
              </p>
            </div>
          </label>
        </Card>
      </div>
      
      {selectedBackground?.type !== 'none' && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Background will appear behind your flower like vintage pressing paper.
        </p>
      )}
    </div>
  )
} 