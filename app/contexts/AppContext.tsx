"use client"

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { SessionManager, ChatSession, ZepMessage } from "@/lib/session-manager"

type Message = {
  id: string
  text: string
  sender: "user" | "assistant"
  timestamp: Date
}

type AppContextType = {
  showLanding: boolean
  setShowLanding: (show: boolean) => void
  messages: Message[]
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void
  currentSessionId: string
  setCurrentSessionId: (sessionId: string) => void
  sessions: ChatSession[]
  startNewChat: () => void
  loadSession: (sessionId: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [showLanding, setShowLanding] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentSessionId, setCurrentSessionId] = useState("")
  const [sessions, setSessions] = useState<ChatSession[]>([])
  // Load sessions from API on mount
  useEffect(() => {
    const loadSessions = async () => {
      const apiSessions = await SessionManager.fetchAllSessions()
      console.log("Loading sessions from API:", apiSessions)
      setSessions(apiSessions)
      if (apiSessions.length > 0) {
        setCurrentSessionId(apiSessions[0].id)
      }
    }
    loadSessions()
  }, [])

  const startNewChat = useCallback(async () => {
    setMessages([])
    const newSessionId = uuidv4()
    const newSession = await SessionManager.createSession(newSessionId)
    if (newSession) {
      setCurrentSessionId(newSession.id)
      setSessions([newSession, ...sessions])
    }
  }, [sessions])

  const loadSession = useCallback(async (sessionId: string) => {
    try {
      setCurrentSessionId(sessionId)
      setShowLanding(false)
      
      // Fetch messages from Zep API via our API route
      const zepMessages = await SessionManager.fetchSessionMessages(sessionId)
      
      // Convert Zep messages to app messages
      const convertedMessages: Message[] = zepMessages.map((zepMsg) => ({
        id: zepMsg.uuid,
        text: zepMsg.content,
        sender: zepMsg.role_type,
        timestamp: new Date(zepMsg.created_at)
      }))
      
      setMessages(convertedMessages)
    } catch (error) {
      console.error("Error loading session:", error)
      // Don't throw error, just start with empty messages
      setMessages([])
    }
  }, [])
  return (
    <AppContext.Provider value={{ 
      showLanding, 
      setShowLanding, 
      messages, 
      setMessages, 
      currentSessionId,
      setCurrentSessionId,
      sessions,
      startNewChat,
      loadSession,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
