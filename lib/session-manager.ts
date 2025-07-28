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

export interface ZepSessionsResponse {
  sessions: ChatSession[]
  total_count: number
  response_count: number
}

export interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messageCount: number
  metadata?: {
    [key: string]: any
  }
}

// Removed direct API constants - now handled by API routes

export class SessionManager {


  // Create a new session via the Zep API
  static async createSession(sessionId: string, metadata: any = {}): Promise<ChatSession | null> {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: 'static_user_id', // Using a static user_id as requested
          metadata
        })
      })

      if (!response.ok) {
        console.warn(`Failed to create session: ${response.statusText}`)
        return null
      }

      const data = await response.json()
      console.log("Created session:", data)
      return data
    } catch (error) {
      console.error("Error creating session:", error)
      return null
    }
  }

  // Fetch all sessions from Zep API via our Next.js API route
  static async fetchAllSessions(): Promise<ChatSession[]> {
    try {
      const response = await fetch('/api/sessions-ordered')

      if (!response.ok) {
        console.warn(`Failed to fetch sessions: ${response.statusText}`)
        return []
      }

      const data: ZepSessionsResponse = await response.json()
      console.log("Fetched sessions:", data.sessions)
      // Convert Zep sessions to our format
      return data.sessions || []
    } catch (error) {
      console.error("Error fetching sessions:", error)
      return []
    }
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

}