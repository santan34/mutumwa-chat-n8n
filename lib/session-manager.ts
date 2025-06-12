// Session management utilities for Zep API
export interface ZepMessage {
  uuid: string
  created_at: string
  updated_at: string
  role: string
  role_type: "user" | "assistant"
  content: string
  token_count: number
  processed: boolean
}

export interface ZepSessionResponse {
  messages: ZepMessage[]
  total_count: number
  row_count: number
}

export interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messageCount: number
}

// Removed direct API constants - now handled by API routes

// Local storage keys
const SESSIONS_STORAGE_KEY = "mutumwa_chat_sessions"
const CURRENT_SESSION_KEY = "mutumwa_current_session"

export class SessionManager {
  // Get all stored sessions from local storage
  static getAllSessions(): ChatSession[] {
    if (typeof window === "undefined") return []
    
    try {
      const stored = localStorage.getItem(SESSIONS_STORAGE_KEY)
      if (!stored) return []
      
      const sessions = JSON.parse(stored)
      return sessions.map((session: any) => ({
        ...session,
        timestamp: new Date(session.timestamp)
      }))
    } catch (error) {
      console.error("Error reading sessions from localStorage:", error)
      return []
    }
  }

  // Save sessions to local storage
  static saveSessions(sessions: ChatSession[]): void {
    if (typeof window === "undefined") return
    
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions))
    } catch (error) {
      console.error("Error saving sessions to localStorage:", error)
    }
  }

  // Add or update a session
  static saveSession(session: ChatSession): void {
    console.log("Saving session:", session)
    const sessions = this.getAllSessions()
    const existingIndex = sessions.findIndex(s => s.id === session.id)
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session
    } else {
      sessions.unshift(session) // Add to beginning
    }
    
    // Keep only the latest 50 sessions
    const limitedSessions = sessions.slice(0, 50)
    this.saveSessions(limitedSessions)
  }

  // Get current session ID
  static getCurrentSessionId(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(CURRENT_SESSION_KEY)
  }

  // Set current session ID
  static setCurrentSessionId(sessionId: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(CURRENT_SESSION_KEY, sessionId)
  }
  // Fetch messages from Zep API via our Next.js API route
  static async fetchSessionMessages(sessionId: string): Promise<ZepMessage[]> {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/messages`)

      if (!response.ok) {
        console.warn(`Failed to fetch messages: ${response.statusText}`)
        return []
      }

      const data: ZepSessionResponse = await response.json()
      console.log("Fetched messages:", data.messages)
      // Convert Zep messages to our format
      return data.messages || []
    } catch (error) {
      console.error("Error fetching session messages:", error)
      return []
    }
  }

  // Add a message to Zep session via our Next.js API route
  static async addMessageToSession(sessionId: string, content: string, role: 'user' | 'assistant'): Promise<boolean> {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role,
          content
        })
      })

      if (!response.ok) {
        console.warn(`Failed to add message to Zep: ${response.statusText}`)
        return false
      }

      console.log(`Message added to Zep session ${sessionId}`)
      return true
    } catch (error) {
      console.error("Error adding message to Zep session:", error)
      return false
    }
  }

  // Create a session title from the first message
  static generateSessionTitle(firstMessage: string): string {
    // Take first 50 characters and add ellipsis if longer
    const title = firstMessage.trim().slice(0, 50)
    return title.length < firstMessage.trim().length ? `${title}...` : title
  }
  // Update session with new message info
  static updateSessionWithMessage(sessionId: string, message: string, isUser: boolean): void {
    if (isUser) {
      const sessions = this.getAllSessions()
      const existingIndex = sessions.findIndex(s => s.id === sessionId)
      
      if (existingIndex >= 0) {
        // Update existing session
        sessions[existingIndex].lastMessage = message
        sessions[existingIndex].timestamp = new Date()
        sessions[existingIndex].messageCount += 1
        this.saveSessions(sessions)
      } else {
        // Create new session
        const newSession: ChatSession = {
          id: sessionId,
          title: this.generateSessionTitle(message),
          lastMessage: message,
          timestamp: new Date(),
          messageCount: 1
        }
        this.saveSession(newSession)
      }
    }
  }

  // Delete a session
  static deleteSession(sessionId: string): void {
    const sessions = this.getAllSessions()
    const filteredSessions = sessions.filter(s => s.id !== sessionId)
    this.saveSessions(filteredSessions)
  }

  // Clear all sessions
  static clearAllSessions(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(SESSIONS_STORAGE_KEY)
    localStorage.removeItem(CURRENT_SESSION_KEY)
  }

  // Create test sessions for debugging
  static createTestSessions(): void {
    if (typeof window === "undefined") return
    
    const testSessions: ChatSession[] = [
      {
        id: "test-session-1",
        title: "Hello, how are you?",
        lastMessage: "Hello, how are you?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        messageCount: 3
      },
      {
        id: "test-session-2", 
        title: "What's the weather like today?",
        lastMessage: "What's the weather like today?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        messageCount: 5
      },
      {
        id: "test-session-3",
        title: "Tell me about African culture",
        lastMessage: "Tell me about African culture",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        messageCount: 8
      }
    ]
    
    this.saveSessions(testSessions)
    console.log("Test sessions created:", testSessions)
  }
}