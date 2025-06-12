"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import ChatMessages from "@/components/chat-messages"
import ChatInput from "@/components/chat-input"
import { getLanguageSuggestions } from "@/lib/suggestions"
import { SessionManager } from "@/lib/session-manager"
import { useLanguage } from "../../contexts/LanguageContext"
import { useApp } from "../../contexts/AppContext"

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string
    const { 
    messages, 
    setMessages, 
    loadSessionFromUrl, 
    refreshSessions,
    setCurrentSessionId 
  } = useApp()
  const { selectedLanguage } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [isSessionLoaded, setIsSessionLoaded] = useState(false)
  const [loadedSessionId, setLoadedSessionId] = useState<string | null>(null)
  // Load session when component mounts or sessionId changes
  useEffect(() => {
    if (sessionId && sessionId !== "new" && sessionId !== loadedSessionId) {
      setLoadedSessionId(sessionId)
      loadSessionFromUrl(sessionId).then(() => {
        setIsSessionLoaded(true)
      })
    } else if (sessionId === "new") {
      // Create new session
      const newSessionId = uuidv4()
      router.replace(`/chat/${newSessionId}`)
    } else if (sessionId === loadedSessionId) {
      // Session already loaded
      setIsSessionLoaded(true)
    } else {
      setIsSessionLoaded(true)
    }
  }, [sessionId, router]) // Removed loadSessionFromUrl from dependencies

  // Set current session ID
  useEffect(() => {
    if (sessionId && sessionId !== "new") {
      setCurrentSessionId(sessionId)
      SessionManager.setCurrentSessionId(sessionId)
    }
  }, [sessionId, setCurrentSessionId])
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !sessionId || sessionId === "new") return

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

    // Update session storage with the new message
    SessionManager.updateSessionWithMessage(sessionId, text, true)
    refreshSessions()

    // Add user message to Zep (async, don't wait for it)
    SessionManager.addMessageToSession(sessionId, text, 'user').catch(error => {
      console.warn('Failed to add user message to Zep:', error)
    })

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

      // Add assistant message to Zep (async, don't wait for it)
      SessionManager.addMessageToSession(sessionId, data.output, 'assistant').catch(error => {
        console.warn('Failed to add assistant message to Zep:', error)
      })
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

  if (!isSessionLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white">Loading chat...</div>
      </div>
    )
  }

  return (
    <>
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto overscroll-none -webkit-overflow-scrolling: touch touch-pan-y scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-gradient-to-b from-slate-900/20 to-transparent h-full max-h-full">        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          selectedLanguage={selectedLanguage}
          onSuggestionClick={handleSendMessage}
          suggestions={[]}              
        />
      </div>
      
      {/* Suggestion slider - only show when chat hasn't started */}
      {messages.length === 0 && (
        <div className="py-2.5 px-3 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex-shrink-0">
          <div className="flex flex-wrap justify-center space-x-3 md:space-x-3 md:flex-row space-y-2 md:space-y-0">
            {getLanguageSuggestions(selectedLanguage.value).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(suggestion)}
                className="px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40 hover:text-white text-sm text-white/80 transition-all flex-shrink-0 active:scale-95 touch-manipulation md:mx-1"
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
