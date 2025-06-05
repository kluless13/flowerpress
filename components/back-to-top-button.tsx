"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 3 card heights (approx 1000px)
      setIsVisible(window.scrollY > 1000)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isVisible) return null

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-6 right-6 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white z-20"
      onClick={scrollToTop}
    >
      <ArrowUp className="w-4 h-4 text-[#2E4D2E]" />
      <span className="sr-only">Back to top</span>
    </Button>
  )
}
