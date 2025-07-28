"use client"

import { LanguageProvider } from "./contexts/LanguageContext"
import { SidebarProvider } from "./contexts/SidebarContext"
import { AppProvider, useApp } from "./contexts/AppContext"
import dynamic from "next/dynamic"
import LanguagePicker from "@/components/language-picker"
import { Button } from "@/components/ui/button"
import { africanLanguages } from "@/lib/languages"
import Image from "next/image"
import { useLanguage } from "./contexts/LanguageContext"
import { useSidebar } from "./contexts/SidebarContext"
import { ReactNode, useState } from "react"
import { Inter } from "next/font/google"
import { Menu, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import "./globals.css"
import UrlConfigModal from "@/components/url-config-modal"

const inter = Inter({ subsets: ["latin"] })
const Sidebar = dynamic(() => import("@/components/sidebar"), { ssr: false })

function Header() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage()
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar()
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between border-b border-white/10 px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center space-x-2">
          {/* Mobile menu button - shown only if sidebar is closed */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden "
            >
              <Menu className="h-8 w-8 text-white" />
            </button>
          )}
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 ml-2 ">
            <Image 
              src="/mutumwa-nobg-high-res.png"
              alt="Mutumwa AI Logo"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2 sm:ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsUrlModalOpen(true)}
            className="text-slate-300 hover:text-white hover:bg-slate-800/50 backdrop-blur-sm flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5"
          >
            <Settings className="h-3 w-3 md:h-3.5 md:w-3.5" />
            <span className="hidden md:inline text-xs md:text-sm">Configure URL</span>
          </Button>
          
          <LanguagePicker
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            languages={africanLanguages}
          />
        </div>
      </div>
      
      <UrlConfigModal 
        isOpen={isUrlModalOpen} 
        onClose={() => setIsUrlModalOpen(false)} 
      />
    </>
  )
}

function AppLayout({ children }: { children: ReactNode }) {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar()
  const { sessions, currentSessionId, loadSession, deleteSession, refreshSessions } = useApp()
  const pathname = usePathname()

  // Check if we're on a chat route
  const isChatRoute = pathname.startsWith('/chat')

  const handleNewChat = () => {
    // This will be handled by the sidebar's router navigation
  }

  const handleLoadSession = async (sessionId: string) => {
    await loadSession(sessionId)
  }

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId)
  }

  // If not on a chat route, render children directly (landing page)
  if (!isChatRoute) {
    return <>{children}</>
  }
  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-gradient-to-br from-purple-950/95 via-slate-900/90 to-purple-950/95" data-chat-layout>
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-800/15 blur-3xl"></div>
        <div className="absolute right-0 top-1/4 h-60 w-60 rounded-full bg-violet-700/15 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-purple-800/15 blur-3xl"></div>
      </div>
      
      <Sidebar 
        onNewChat={handleNewChat} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onLoadSession={handleLoadSession}
        onDeleteSession={handleDeleteSession}
      />

      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? "md:pl-64" : "pl-0"} w-full`}
      >
        <div className="flex h-full w-full flex-col p-0 md:p-2 md:px-10 md:py-2">
          {/* Chat container - full screen on mobile */}
          <div className="relative flex h-[100dvh] md:h-[calc(100vh-20px)] w-full flex-col overflow-hidden md:rounded-xl md:border md:border-white/10 bg-white/5 backdrop-blur-lg md:shadow-xl">
            <Header />
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <SidebarProvider>
            <LanguageProvider>
              <AppLayout>{children}</AppLayout>
            </LanguageProvider>
          </SidebarProvider>
        </AppProvider>
      </body>
    </html>
  )
}

