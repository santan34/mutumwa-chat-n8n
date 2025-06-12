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
  resetApp: () => void
  startNewChat: () => void
  loadSession: (sessionId: string) => Promise<void>
  loadSessionFromUrl: (sessionId: string) => Promise<void>
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
    console.log("Loading sessions from localStorage:", storedSessions)
    setSessions(storedSessions)
    
    // Create test sessions if none exist (for debugging)
    if (storedSessions.length === 0) {
      console.log("No sessions found, creating test sessions")
      SessionManager.createTestSessions()
      const testSessions = SessionManager.getAllSessions()
      setSessions(testSessions)
    }
    
    // Generate initial session ID
    const existingSessionId = SessionManager.getCurrentSessionId()
    if (existingSessionId) {
      setCurrentSessionId(existingSessionId)
      console.log("Using existing session ID:", existingSessionId)
    } else {
      const newSessionId = uuidv4()
      setCurrentSessionId(newSessionId)
      SessionManager.setCurrentSessionId(newSessionId)
      console.log("Created new session ID:", newSessionId)
    }
  }, [])
  const resetApp = useCallback(() => {
    setShowLanding(true)
    setMessages([])
    const newSessionId = uuidv4()
    setCurrentSessionId(newSessionId)
    SessionManager.setCurrentSessionId(newSessionId)
  }, [])

  const startNewChat = useCallback(() => {
    setMessages([])
    const newSessionId = uuidv4()
    setCurrentSessionId(newSessionId)
    SessionManager.setCurrentSessionId(newSessionId)
    // Don't reset showLanding when starting a new chat
  }, [])

  const loadSession = useCallback(async (sessionId: string) => {
    try {
      setCurrentSessionId(sessionId)
      SessionManager.setCurrentSessionId(sessionId)
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

  const loadSessionFromUrl = useCallback(async (sessionId: string) => {
    try {
      console.log("Loading session from URL:", sessionId)
      setCurrentSessionId(sessionId)
      SessionManager.setCurrentSessionId(sessionId)
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
      
      // If no messages found but session exists in local storage, it might be a new session
      if (convertedMessages.length === 0) {
        console.log("No messages found for session, starting fresh")
        setMessages([])
      }
    } catch (error) {
      console.error("Error loading session from URL:", error)
      // Don't throw error, just start with empty messages
      setMessages([])
    }
  }, [])
  const deleteSession = useCallback((sessionId: string) => {
    SessionManager.deleteSession(sessionId)
    const updatedSessions = SessionManager.getAllSessions()
    setSessions(updatedSessions)
    
    // If deleting current session, start a new one
    if (sessionId === currentSessionId) {
      startNewChat()
    }
  }, [currentSessionId, startNewChat])

  const refreshSessions = useCallback(() => {
    const storedSessions = SessionManager.getAllSessions()
    console.log("Refreshing sessions:", storedSessions)
    setSessions(storedSessions)
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
      resetApp, 
      startNewChat,
      loadSession,
      loadSessionFromUrl,
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
