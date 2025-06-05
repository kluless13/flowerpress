"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FadeIn } from "@/components/animations"
import ThemeToggle from "@/components/theme-toggle"
import { useAuth } from "@/hooks/useAuth"

export default function OnboardingPage() {
  const router = useRouter()
  const { signInWithGoogle, loading, error } = useAuth()
  const [greeting, setGreeting] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours()

      if (hour >= 5 && hour < 12) {
        return "Good morning"
      } else if (hour >= 12 && hour < 17) {
        return "Good afternoon"
      } else {
        return "Good evening"
      }
    }

    setGreeting(getTimeBasedGreeting())
  }, [])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)

    try {
      await signInWithGoogle()
      // Router push will be handled by useAuth hook in parent component
    } catch (error: any) {
      console.error("Authentication error:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-[#F5E6E8] via-[#E8F5E6] to-[#F0F8F0] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Money plant leaves pattern background - with adjusted opacity and positioning */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Diagonal money plant pattern - more translucent and away from center */}
        {Array.from({ length: 25 }).map((_, i) => {
          // Calculate position to keep leaves away from center
          const leftPos = (i % 5) * 20 + Math.random() * 10
          const topPos = Math.floor(i / 5) * 20 + Math.random() * 10

          // Check if leaf would be in center area (where welcome box is)
          const isInCenter = leftPos > 30 && leftPos < 70 && topPos > 30 && topPos < 70

          return (
            <div
              key={`money-plant-${i}`}
              className={`absolute ${isInCenter ? "opacity-5" : "opacity-10"} dark:opacity-5`}
              style={{
                left: `${leftPos}%`,
                top: `${topPos}%`,
                transform: `rotate(${i * 15 + Math.random() * 30}deg)`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <div className="text-4xl animate-money-plant-float">🍃</div>
            </div>
          )
        })}

        {/* Additional scattered money plant leaves - more translucent */}
        {Array.from({ length: 15 }).map((_, i) => {
          const leftPos = Math.random() * 100
          const topPos = Math.random() * 100
          const isInCenter = leftPos > 30 && leftPos < 70 && topPos > 30 && topPos < 70

          return (
            <div
              key={`scattered-leaf-${i}`}
              className={`absolute ${isInCenter ? "opacity-5" : "opacity-8"} dark:opacity-4`}
              style={{
                left: `${leftPos}%`,
                top: `${topPos}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <div className="text-2xl animate-money-plant-gentle">🍃</div>
            </div>
          )
        })}

        {/* Larger money plant leaves for depth - more translucent and away from center */}
        {Array.from({ length: 8 }).map((_, i) => {
          const leftPos = (i % 3) * 35 + Math.random() * 15
          const topPos = Math.floor(i / 3) * 30 + Math.random() * 15
          const isInCenter = leftPos > 30 && leftPos < 70 && topPos > 30 && topPos < 70

          return (
            <div
              key={`large-leaf-${i}`}
              className={`absolute ${isInCenter ? "opacity-3" : "opacity-6"} dark:opacity-3`}
              style={{
                left: `${leftPos}%`,
                top: `${topPos}%`,
                transform: `rotate(${i * 45}deg)`,
                animationDelay: `${i * 0.7}s`,
              }}
            >
              <div className="text-5xl animate-money-plant-slow">🍃</div>
            </div>
          )
        })}
      </div>

      <div className="z-10 w-full max-w-md mx-auto">
        <FadeIn className="text-center mb-8">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#2E4D2E] to-[#1D3C1D] dark:from-green-600 dark:to-green-700 rounded-full flex items-center justify-center shadow-xl animate-gentle-pulse">
              <span className="text-5xl">🌻</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif italic text-[#2E4D2E] dark:text-green-300 mb-2">
              Welcome to FlowerPress, Liyatree
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Liyatree's digital botanical companion</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg shadow-2xl border-0 ring-1 ring-white/20 dark:ring-gray-700/20">
            <CardContent className="p-6 md:p-8">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-serif italic text-[#2E4D2E] dark:text-green-300">
                    {greeting}! Welcome to FlowerPress
                  </h2>

                  <div className="space-y-3 text-gray-700 dark:text-gray-300">
                    <p className="text-base md:text-lg">
                      I am <span className="font-semibold text-[#2E4D2E] dark:text-green-400">Preston</span>, your
                      flower pressing butler.
                    </p>

                    <p className="text-sm md:text-base leading-relaxed">
                      I will help you press your flowers. Simply take pictures of flowers you adore while
                      passing by and share them with me, and I will take care of the rest!
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg mb-4">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading || loading}
                    className="w-full bg-gradient-to-r from-[#2E4D2E] to-[#1D3C1D] hover:from-[#1D3C1D] hover:to-[#0F2A0F] dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white py-3 px-6 text-base md:text-lg font-medium rounded-lg shadow-xl transition-all duration-200 transform hover:scale-105 border-0"
                  >
                    {isLoading || loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Preparing your virtual garden...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🌻</span>
                        Start pressing!
                      </div>
                    )}
                  </Button>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Begin your botanical journey today
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
