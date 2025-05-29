"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import ChatMessages from "@/components/chat-messages"
import ChatInput from "@/components/chat-input"
import LandingPage from "@/components/landing-page"
import { getLanguageSuggestions } from "@/lib/suggestions"
import { useLanguage } from "./contexts/LanguageContext"
import { useSidebar } from "./contexts/SidebarContext"
import { useApp } from "./contexts/AppContext"

export default function Home() {
  const { showLanding, setShowLanding, messages, setMessages } = useApp()
  const { selectedLanguage } = useLanguage()
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar()
  const [sessionId, setSessionId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [newMessageSent, setNewMessageSent] = useState(false)

  useEffect(() => {
    // Generate a session ID when the component mounts
    setSessionId(uuidv4())
  }, [])
  const handleGetStarted = () => {
    setShowLanding(false)
  }

  const handleSendMessage = async (text: string) => {
    // If this is the first message, hide landing page
    if (showLanding) {
      setShowLanding(false)
    }

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
    setNewMessageSent(true)

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
    }  }

  // Show landing page if no messages and showLanding is true
  if (showLanding && messages.length === 0) {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  return (
    <>
      {/* Chat messages area - improved mobile touch handling */}
      <div className="flex-1 overflow-y-auto overscroll-none -webkit-overflow-scrolling: touch touch-pan-y scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-gradient-to-b from-slate-900/20 to-transparent h-full max-h-full">
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
      
      {/* Suggestion slider - only show when chat hasn't started */}
      {messages.length === 0 && (
        <div className="py-2.5 px-3 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex-shrink-0">
          <div className="flex justify-center space-x-3">
            {getLanguageSuggestions(selectedLanguage.value).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(suggestion)}
                className="px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40 hover:text-white text-sm text-white/80 transition-all flex-shrink-0 active:scale-95 touch-manipulation"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Chat input area */}
      <div className="bg-transparent p-2 px-3 sm:px-4 flex-shrink-0">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </>
  )
}

