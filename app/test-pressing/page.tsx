"use client"

import { useState } from "react"
import { PressedFlowerAnimation } from "@/components/animations"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
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

export default function TestPressingPage() {
  const router = useRouter()
  const [daysElapsed, setDaysElapsed] = useState([0])
  const [selectedBackground, setSelectedBackground] = useState<{ type: 'none' | 'preset' | 'custom'; value?: string }>({ type: 'none' })
  
  // Using the same logic from flower-card.tsx
  const getCurrentDays = daysElapsed[0]
  
  // Determine pressing stage with colors (same logic as flower-card.tsx)
  let pressingStage = ""
  let stageColor = ""
  let stageCircleColor = ""

  if (getCurrentDays < 7) {
    pressingStage = "Fresh"
    stageColor = "bg-gradient-to-br from-emerald-400 to-emerald-600"
    stageCircleColor = "bg-gradient-to-br from-emerald-400 to-emerald-600"
  } else if (getCurrentDays < 30) {
    pressingStage = "Pressing"
    stageColor = "bg-gradient-to-br from-amber-400 to-amber-600"
    stageCircleColor = "bg-gradient-to-br from-amber-400 to-amber-600"
  } else if (getCurrentDays < 90) {
    pressingStage = "Pressed"
    stageColor = "bg-gradient-to-br from-orange-400 to-orange-600"
    stageCircleColor = "bg-gradient-to-br from-orange-400 to-orange-600"
  } else {
    pressingStage = "Preserved"
    stageColor = "bg-gradient-to-br from-rose-400 to-rose-600"
    stageCircleColor = "bg-gradient-to-br from-rose-400 to-rose-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6E8] via-[#E8F5E6] to-[#F0F8F0] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-serif italic text-[#2E4D2E] dark:text-green-300">
            🧪 Flower Pressing Test Lab
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Test Flower Display */}
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center font-serif italic text-[#2E4D2E] dark:text-green-300">
                Test Flower Sample
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Flower Image with Effects */}
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700">
                {/* Background Paper - cropped to flower's aspect ratio */}
                {selectedBackground && selectedBackground.type !== 'none' && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <Image
                      src={selectedBackground.type === 'preset' ? getPresetImagePath(selectedBackground.value!) : selectedBackground.value!}
                      alt="Background paper"
                      fill
                      className="object-cover"
                      style={{ zIndex: 1 }}
                    />
                  </div>
                )}
                
                <div 
                  className="relative w-full h-full transition-all duration-700 ease-in-out"
                  style={{
                    transform: `scale(${Math.max(0.9, 1 - getCurrentDays * 0.0011)})`,
                    filter: `saturate(${Math.max(65, 100 - getCurrentDays * 0.39)}%) sepia(${Math.min(25, getCurrentDays * 0.21)}%)`,
                    opacity: Math.max(0.85, 1 - getCurrentDays * 0.00125),
                    zIndex: 2
                  }}
                >
                  {/* Flower Image - on top of background */}
                  <Image
                    src="/suntets.png"
                    alt="Test flower for pressing simulation"
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Stage indicator circle - top right */}
                  <div className="absolute top-3 right-3" style={{ zIndex: 3 }}>
                    <div
                      className={`w-4 h-4 rounded-full ${stageCircleColor} shadow-lg border-2 border-white/50`}
                      title={pressingStage}
                    ></div>
                  </div>
                  
                  {/* Days elapsed - top left */}
                  <div className="absolute top-3 left-3 bg-black/60 text-white text-sm font-medium px-3 py-1 rounded-lg backdrop-blur-sm" style={{ zIndex: 3 }}>
                    Day {getCurrentDays}
                  </div>
                </div>
              </div>

              {/* Stage Badge */}
              <div className="flex justify-center">
                <div className={`${stageColor} text-white text-lg font-medium px-6 py-2 rounded-full shadow-lg`}>
                  {pressingStage}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Pressing Progress</span>
                  <span>{Math.min(100, Math.round((getCurrentDays / 90) * 100))}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${Math.min(100, (getCurrentDays / 90) * 100)}%` }}
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Controls Panel */}
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center font-serif italic text-[#2E4D2E] dark:text-green-300">
                Time Control Simulator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Time Slider */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Days Elapsed: {getCurrentDays}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Drag to simulate time passing
                  </p>
                </div>
                
                <Slider
                  value={daysElapsed}
                  onValueChange={setDaysElapsed}
                  max={120}
                  min={0}
                  step={1}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Fresh (0d)</span>
                  <span>Pressing (7d)</span>
                  <span>Pressed (30d)</span>
                  <span>Preserved (90d+)</span>
                </div>
              </div>

              {/* Stage Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Current Stage Details:</h4>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stageCircleColor}`}></div>
                    <span className="font-medium">{pressingStage} Stage</span>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {getCurrentDays < 7 && "Fresh flower, full color and dimension"}
                    {getCurrentDays >= 7 && getCurrentDays < 30 && "Early pressing, slight flattening and color changes"}
                    {getCurrentDays >= 30 && getCurrentDays < 90 && "Well pressed, noticeably flatter with muted colors"}
                    {getCurrentDays >= 90 && "Fully preserved, flat with vintage sepia tones"}
                  </div>
                </div>
              </div>

              {/* Background Selector */}
              <BackgroundSelector
                selectedBackground={selectedBackground}
                onBackgroundChange={setSelectedBackground}
                previewFlowerImage="/suntets.png"
              />

              {/* Quick Test Buttons */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Quick Tests:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDaysElapsed([0])}
                    className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  >
                    Fresh (0d)
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDaysElapsed([15])}
                    className="text-amber-600 border-amber-200 hover:bg-amber-50"
                  >
                    Pressing (15d)
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDaysElapsed([60])}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    Pressed (60d)
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDaysElapsed([100])}
                    className="text-rose-600 border-rose-200 hover:bg-rose-50"
                  >
                    Preserved (100d)
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8 bg-blue-50/70 dark:bg-blue-900/20 backdrop-blur-lg border-0 shadow-xl">
          <CardContent className="p-6">
            <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
              🧪 Testing Instructions:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Use the slider to simulate time passing (0-120 days)</li>
              <li>• Watch how the flower image changes with CSS filters and transforms</li>
              <li>• Test the 4 pressing stages: Fresh → Pressing → Pressed → Preserved</li>
              <li>• Use quick test buttons to jump to specific stages</li>
              <li>• Verify the visual progression matches expectations</li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </div>
  )
} 