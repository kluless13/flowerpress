"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations"

interface WelcomeScreenProps {
  username?: string
}

export default function WelcomeScreen({ username = "friend" }: WelcomeScreenProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    // Simulate authentication
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-[#F5E6E8]">
      {/* Background pattern */}
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: `url('/delicate-floral-pattern.png')`,
          backgroundSize: "cover",
        }}
      />

      <FadeIn className="z-10 flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl font-serif italic text-[#2E4D2E] mb-6">
          Hi, welcome to your flower-pressing space
          <br />
          <span className="text-2xl md:text-3xl">@{username}</span>
        </h1>

        <Button
          onClick={handleSignIn}
          disabled={isLoading}
          className="mt-8 bg-white hover:bg-gray-50 text-gray-700 flex items-center gap-3 px-6 py-5 rounded-md shadow-md"
        >
          <img src="/google-logo.png" alt="Google logo" className="w-5 h-5" />
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </Button>
      </FadeIn>
    </div>
  )
}
