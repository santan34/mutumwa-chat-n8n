"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
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
  sessions: ChatSession[]
  resetApp: () => void
  startNewChat: () => void
  loadSession: (sessionId: string) => Promise<void>
  deleteSession: (sessionId: string) => void
  refreshSessions: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [showLanding, setShowLanding] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentSessionId, setCurrentSessionId] = useState("")
  const [sessions, setSessions] = useState<ChatSession[]>([])

  // Load sessions from localStorage on mount
  useEffect(() => {
    const storedSessions = SessionManager.getAllSessions()
    setSessions(storedSessions)
    
    // Generate initial session ID
    const existingSessionId = SessionManager.getCurrentSessionId()
    if (existingSessionId) {
      setCurrentSessionId(existingSessionId)
    } else {
      const newSessionId = uuidv4()
      setCurrentSessionId(newSessionId)
      SessionManager.setCurrentSessionId(newSessionId)
    }
  }, [])

  const resetApp = () => {
    setShowLanding(true)
    setMessages([])
    const newSessionId = uuidv4()
    setCurrentSessionId(newSessionId)
    SessionManager.setCurrentSessionId(newSessionId)
  }

  const startNewChat = () => {
    setMessages([])
    const newSessionId = uuidv4()
    setCurrentSessionId(newSessionId)
    SessionManager.setCurrentSessionId(newSessionId)
    // Don't reset showLanding when starting a new chat
  }

  const loadSession = async (sessionId: string) => {
    try {
      setCurrentSessionId(sessionId)
      SessionManager.setCurrentSessionId(sessionId)
      setShowLanding(false)
      
      // Fetch messages from Zep API
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
    }
  }

  const deleteSession = (sessionId: string) => {
    SessionManager.deleteSession(sessionId)
    const updatedSessions = SessionManager.getAllSessions()
    setSessions(updatedSessions)
    
    // If deleting current session, start a new one
    if (sessionId === currentSessionId) {
      startNewChat()
    }
  }
  const refreshSessions = () => {
    const storedSessions = SessionManager.getAllSessions()
    setSessions(storedSessions)
  }

  return (
    <AppContext.Provider value={{ 
      showLanding, 
      setShowLanding, 
      messages, 
      setMessages, 
      currentSessionId,
      sessions,
      resetApp, 
      startNewChat,
      loadSession,
      deleteSession,
      refreshSessions
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
