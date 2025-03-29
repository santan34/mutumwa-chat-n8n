"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    // Generate a session ID when the component mounts
    setSessionId(uuidv4())
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
    <main className="relative flex h-screen w-screen overflow-hidden bg-gradient-to-br from-indigo-950/90 via-slate-900/80 to-slate-950/90">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl"></div>
        <div className="absolute right-0 top-1/4 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-purple-600/10 blur-3xl"></div>
      </div>
      
      <Sidebar onNewChat={handleNewChat} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div 
        className={`flex flex-1 flex-col transition-all duration-300 ${isSidebarOpen ? "md:pl-64" : "pl-0"} w-full`}
      >
        <div className="flex h-full w-full flex-col p-2 md:px-10 md:py-2">
          {/* Chat container */}
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-xl">
            {/* Header with language picker */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h2 className="flex-1 text-center text-lg font-medium text-white/90">
                Alex AI
              </h2>
              <LanguagePicker
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                languages={africanLanguages}
              />
            </div>
            
            {/* Chat messages area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-gradient-to-b from-slate-900/20 to-transparent">
              <ChatMessages
                messages={messages}
                isLoading={isLoading}
                selectedLanguage={selectedLanguage}
                onSuggestionClick={handleSendMessage}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen} suggestions={[]}              />
            </div>
            
            {/* Suggestion slider - only show when chat hasn't started */}
            {messages.length === 0 && (
              <div className="border-t border-white/10 py-2 px-3 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="flex justify-center space-x-2">
                  {getLanguageSuggestions(selectedLanguage.value).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(suggestion)}
                      className="px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40 hover:text-white text-sm text-white/70 transition-all flex-shrink-0"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Chat input area with subtle separation */}
            <div className="border-t border-white/10 bg-transparent p-2 px-3 sm:p-3">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

