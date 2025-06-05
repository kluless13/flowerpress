"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function DateNavigation() {
  const [activeSection, setActiveSection] = useState("today")
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)

      // Update active section based on scroll position
      // This is a simplified version - in a real app you would
      // calculate this based on the actual position of date sections
      if (currentScrollY < 200) {
        setActiveSection("today")
      } else if (currentScrollY < 600) {
        setActiveSection("week")
      } else {
        setActiveSection("month")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const scrollToSection = (section: string) => {
    // In a real app, you would scroll to the actual section
    let scrollPosition = 0

    switch (section) {
      case "today":
        scrollPosition = 0
        break
      case "week":
        scrollPosition = 300
        break
      case "month":
        scrollPosition = 700
        break
    }

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    })

    setActiveSection(section)
  }

  return (
    <div
      className={`sticky top-4 z-20 flex justify-center py-2 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-16"
      }`}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-full shadow-sm flex p-1 gap-1">
        <Button
          variant={activeSection === "today" ? "default" : "ghost"}
          size="sm"
          className={`rounded-full text-xs px-4 py-2 ${activeSection === "today" ? "bg-[#2E4D2E] text-white" : "text-[#2E4D2E]"}`}
          onClick={() => scrollToSection("today")}
        >
          Today
        </Button>
        <Button
          variant={activeSection === "week" ? "default" : "ghost"}
          size="sm"
          className={`rounded-full text-xs px-4 py-2 ${activeSection === "week" ? "bg-[#2E4D2E] text-white" : "text-[#2E4D2E]"}`}
          onClick={() => scrollToSection("week")}
        >
          This Week
        </Button>
        <Button
          variant={activeSection === "month" ? "default" : "ghost"}
          size="sm"
          className={`rounded-full text-xs px-4 py-2 ${activeSection === "month" ? "bg-[#2E4D2E] text-white" : "text-[#2E4D2E]"}`}
          onClick={() => scrollToSection("month")}
        >
          This Month
        </Button>
      </div>
    </div>
  )
}
