"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import ChatMessages from "@/components/chat-messages"
import ChatInput from "@/components/chat-input"
import { getLanguageSuggestions } from "@/lib/suggestions"
import { SessionManager } from "@/lib/session-manager"
import { useLanguage } from "../../contexts/LanguageContext"
import { useApp } from "../../contexts/AppContext"
import { Message, Session } from "@/lib/types"

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params?.sessionId as string
  
  const { 
    messages, 
    setMessages, 
    setCurrentSessionId,
    addMessage,
    loadSession,
  } = useApp()
  const { selectedLanguage } = useLanguage()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSessionLoaded, setIsSessionLoaded] = useState(false)

  const loadSessionMessages = useCallback(async (sid: string) => {
    if (!sid) return;
    setIsSessionLoaded(false);
    await loadSession(sid);
    setIsSessionLoaded(true);
  }, [loadSession]);

  useEffect(() => {
    if (sessionId && sessionId !== 'new') {
      loadSessionMessages(sessionId);
    } else if (sessionId === 'new') {
      const newSessionId = uuidv4();
      router.replace(`/chat/${newSessionId}`);
    }
  }, [sessionId, loadSessionMessages, router]);

  const handleNewChat = () => {
    const newSessionId = uuidv4()
    router.push(`/chat/${newSessionId}`)
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !sessionId) return

    const userMessage: Message = {
      uuid: uuidv4(),
      content: text.trim(),
      role: "user",
      created_at: new Date().toISOString(),
    }

    addMessage(userMessage);
    setIsLoading(true)

    try {
      const assistantMessage = await SessionManager.addMessageToSession(sessionId, text, 'user');
      
      if (assistantMessage) {
        addMessage(assistantMessage);
      } else {
        // Handle error case, maybe show an error message to the user
        const errorMessage: Message = {
          uuid: uuidv4(),
          content: "Sorry, I couldn't process your message. Please try again.",
          role: "assistant",
          created_at: new Date().toISOString(),
        };
        addMessage(errorMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        uuid: uuidv4(),
        content: "Sorry, I couldn't process your message. Please try again.",
        role: "assistant",
        created_at: new Date().toISOString(),
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSessionLoaded && sessionId !== 'new') {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto overscroll-none -webkit-overflow-scrolling: touch touch-pan-y scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-gradient-to-b from-slate-900/20 to-transparent h-full max-h-full">
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            selectedLanguage={selectedLanguage}
            onSuggestionClick={handleSendMessage}
            suggestions={getLanguageSuggestions(selectedLanguage.value)}
          />
        </div>
        
        <div className="bg-transparent p-2 px-3 sm:px-4 flex-shrink-0">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}