"use client"

import { LanguageProvider } from "./contexts/LanguageContext"
import { SidebarProvider } from "./contexts/SidebarContext"
import Sidebar from "@/components/sidebar"
import LanguagePicker from "@/components/language-picker"
import { africanLanguages } from "@/lib/languages"
import Image from "next/image"
import { useLanguage } from "./contexts/LanguageContext"
import { useSidebar } from "./contexts/SidebarContext"
import { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

function Header() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage()
  
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-2 sm:px-4 py-2 sm:py-3">
      <div className="flex items-center space-x-2 ml-10">
        <div className="relative h-7 w-7 sm:h-8 sm:w-8 ml-2 sm:ml-10">
          <Image 
            src="/logo.png"
            alt="Alex AI Logo"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-base sm:text-lg font-medium text-white/90 truncate">
          Alex AI
        </h2>
      </div>
      <div className="flex-shrink-0 ml-2 sm:ml-4">
        <LanguagePicker
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          languages={africanLanguages}
        />
      </div>
    </div>
  )
}

function AppLayout({ children }: { children: ReactNode }) {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar()

  const handleNewChat = () => {
    // We'll implement this with a context or pass it as a prop
    // For now, we're just stubbing it
    window.location.href = '/'
  }

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-gradient-to-br from-indigo-950/95 via-slate-900/90 to-slate-950/95">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-800/15 blur-3xl"></div>
        <div className="absolute right-0 top-1/4 h-60 w-60 rounded-full bg-indigo-700/15 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-purple-800/15 blur-3xl"></div>
      </div>
      
      <Sidebar onNewChat={handleNewChat} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

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
        <SidebarProvider>
          <LanguageProvider>
            <AppLayout>{children}</AppLayout>
          </LanguageProvider>
        </SidebarProvider>
      </body>
    </html>
  )
}

