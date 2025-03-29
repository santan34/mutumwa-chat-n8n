"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import Image from "next/image"
import ChatMessages from "@/components/chat-messages"
import ChatInput from "@/components/chat-input"
import Sidebar from "@/components/sidebar"
import { africanLanguages } from "@/lib/languages"
import { getLanguageSuggestions } from "@/lib/suggestions"
import LanguagePicker from "@/components/language-picker"

export default function Home() {
  const [messages, setMessages] = useState<
    Array<{
      id: string
      text: string
      sender: "user" | "assistant"
      timestamp: Date
    }>
  >([])

  const [selectedLanguage, setSelectedLanguage] = useState(africanLanguages[0])
  const [sessionId, setSessionId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  )

  useEffect(() => {
    // Generate a session ID when the component mounts
    setSessionId(uuidv4())

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    // Add user message to the chat
    const userMessageId = uuidv4()
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        text,
        sender: "user",
        timestamp: new Date(),
      },
    ])

    setIsLoading(true)

    try {
      // Create form data for the request
      const formData = new FormData()
      formData.append("text", text)
      formData.append("targetLanguage", selectedLanguage.value)
      formData.append("sessionId", sessionId)

      // Send request to the webhook using environment variable
      const response = await fetch(process.env.NEXT_PUBLIC_WEBHOOK_URL || "", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      // Add assistant's response to the chat
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: data.output,
          sender: "assistant",
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error sending message:", error)

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: "Sorry, I couldn't process your message. Please try again.",
          sender: "assistant",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    setMessages([])
    // Generate a new session ID for the new chat
    setSessionId(uuidv4())
  }

  return (
    <main className="relative flex h-screen w-screen overflow-hidden bg-gradient-to-br from-indigo-950/95 via-slate-900/90 to-slate-950/95">
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
        <div className="flex h-full w-full flex-col p-1.5 sm:p-2 md:px-10 md:py-2">
          {/* Chat container - adjusted height for mobile */}
          <div className="relative flex h-[calc(100dvh-48px)] md:h-[calc(100vh-20px)] w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-xl">
            {/* Header with language picker */}
            <div className="flex items-center justify-between border-b border-white/10 px-2 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center space-x-2">
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
            
            {/* Chat messages area - improved mobile scrolling */}
            <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-gradient-to-b from-slate-900/20 to-transparent">
              <ChatMessages
                messages={messages}
                isLoading={isLoading}
                selectedLanguage={selectedLanguage}
                onSuggestionClick={handleSendMessage}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen} 
                suggestions={[]}              
              />
            </div>
            
            {/* Suggestion slider - improved mobile touch targets */}
            {messages.length === 0 && (
              <div className="py-2.5 px-3 sm:px-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="flex justify-center space-x-3">
                  {getLanguageSuggestions(selectedLanguage.value).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(suggestion)}
                      className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-white/20 hover:border-white/40 hover:text-white text-sm sm:text-[0.925rem] text-white/80 transition-all flex-shrink-0 active:scale-95"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Chat input area - improved mobile spacing */}
            <div className="bg-transparent p-2 sm:p-3 px-3 sm:px-4">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

