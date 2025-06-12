"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import LandingPage from "@/components/landing-page"
import { useApp } from "./contexts/AppContext"

export default function Home() {
  const router = useRouter()
  const { showLanding, setShowLanding } = useApp()

  const handleGetStarted = () => {
    // Redirect to new chat
    router.push("/chat/new")
  }

  // Always show landing page on root route
  return <LandingPage onGetStarted={handleGetStarted} />
}
