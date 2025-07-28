import {
  Session,
  Message,
  MessagesResponse,
  CreateSessionRequest,
} from './types';

const ZEP_API_BASE = process.env.NEXT_PUBLIC_ZEP_API_BASE || "https://api.getzep.com/api/v2";
const ZEP_API_KEY = process.env.ZEP_API_KEY;

const USER_ID = "hardcoded_user_id"; // Hardcoded user ID as requested

export class SessionManager {
  static async getAllSessions(): Promise<Session[]> {
    if (!ZEP_API_KEY) {
      console.error("ZEP_API_KEY is not set");
      return [];
    }
    try {
      const response = await fetch(`${ZEP_API_BASE}/sessions?user_id=${USER_ID}`, {
        headers: {
          'Authorization': `Api-Key ${ZEP_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        console.error(`Failed to fetch sessions: ${response.statusText}`);
        return [];
      }
      const data: { sessions: Session[] } = await response.json();
      return data.sessions || [];
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return [];
    }
  }

  static async getSession(sessionId: string): Promise<Session | null> {
    if (!ZEP_API_KEY) {
      console.error("ZEP_API_KEY is not set");
      return null;
    }
    try {
      const response = await fetch(`${ZEP_API_BASE}/sessions/${sessionId}`, {
        headers: {
          'Authorization': `Api-Key ${ZEP_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        console.error(`Failed to fetch session: ${response.statusText}`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching session:", error);
      return null;
    }
  }

  static async createSession(sessionId: string, metadata?: Record<string, any>): Promise<Session | null> {
    if (!ZEP_API_KEY) {
      console.error("ZEP_API_KEY is not set");
      return null;
    }
    const sessionData: CreateSessionRequest = {
      session_id: sessionId,
      user_id: USER_ID,
      metadata,
    };
    try {
      const response = await fetch(`${ZEP_API_BASE}/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Api-Key ${ZEP_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData),
      });
      if (!response.ok) {
        console.error(`Failed to create session: ${response.statusText}`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating session:", error);
      return null;
    }
  }

  static async fetchSessionMessages(sessionId: string): Promise<Message[]> {
    if (!ZEP_API_KEY) {
      console.error("ZEP_API_KEY is not set");
      return [];
    }
    try {
      const response = await fetch(`${ZEP_API_BASE}/sessions/${sessionId}/messages`, {
        headers: {
          'Authorization': `Api-Key ${ZEP_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        console.error(`Failed to fetch messages: ${response.statusText}`);
        return [];
      }
      const data: MessagesResponse = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error("Error fetching session messages:", error);
      return [];
    }
  }

  static async addMessageToSession(sessionId: string, content: string, role: 'user' | 'assistant'): Promise<Message | null> {
    if (!ZEP_API_KEY) {
      console.error("ZEP_API_KEY is not set");
      return null;
    }

    let session = await this.getSession(sessionId);
    if (!session) {
      const newSession = await this.createSession(sessionId, { name: content.slice(0, 50) });
      if (!newSession) {
        return null;
      }
      session = newSession;
    }

    const message = {
      role,
      content,
    };

    try {
      const response = await fetch(`${ZEP_API_BASE}/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Api-Key ${ZEP_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: [message] }),
      });
      if (!response.ok) {
        console.error(`Failed to add message: ${response.statusText}`);
        return null;
      }
      const addedMessages: Message[] = await response.json();
      return addedMessages[0];
    } catch (error) {
      console.error("Error adding message to session:", error);
      return null;
    }
  }

  static async deleteSession(sessionId: string): Promise<boolean> {
    if (!ZEP_API_KEY) {
      console.error("ZEP_API_KEY is not set");
      return false;
    }
    try {
      const response = await fetch(`${ZEP_API_BASE}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Api-Key ${ZEP_API_KEY}`,
        }
      });
      if (!response.ok) {
        console.error(`Failed to delete session: ${response.statusText}`);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error deleting session:", error);
      return false;
    }
  }
}
