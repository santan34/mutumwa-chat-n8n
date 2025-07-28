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
  session_id: string
  metadata?: { name?: string }
  [key: string]: any // Allow other properties
}

// Removed direct API constants - now handled by API routes

// Local storage keys
const CURRENT_SESSION_KEY = "mutumwa_current_session"
const HARDCODED_USER_ID = "hardcoded_user_id" // Replace with your actual user ID

export class SessionManager {
  // Get all stored sessions from Zep API
  static async getAllSessions(): Promise<ChatSession[]> {
    try {
      const response = await fetch(
        `/api/sessions?userId=${HARDCODED_USER_ID}`
      )
      if (!response.ok) {
        console.error("Failed to fetch sessions:", response.statusText)
        return []
      }
      const data = await response.json()
      return data.sessions || []
    } catch (error) {
      console.error("Error fetching sessions:", error)
      return []
    }
  }

  // Save sessions to local storage
  static saveSessions(sessions: ChatSession[]): void {
    if (typeof window === "undefined") return
    
    try {
      localStorage.setItem("mutumwa_chat_sessions", JSON.stringify(sessions))
    } catch (error) {
      console.error("Error saving sessions to localStorage:", error)
    }
  }

  // Add or update a session
  static async saveSession(session: ChatSession): Promise<void> {
    console.log("Saving session:", session)
    try {
      await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      })
    } catch (error) {
      console.error("Error saving session:", error)
    }
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
  static async addMessageToSession(
    sessionId: string,
    content: string,
    role: "user" | "assistant"
  ): Promise<boolean> {
    try {
      const messages = await this.fetchSessionMessages(sessionId)
      if (messages.length === 0 && role === "user") {
        // This is the first message, let's create the session with metadata
        await this.saveSession({
          session_id: sessionId,
          metadata: { name: content.substring(0, 50) }, // Use first 50 chars as name
        })
      }

      const response = await fetch(`/api/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          content,
        }),
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
}