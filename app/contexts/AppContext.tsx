"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Session, Message } from '@/lib/types';
import { SessionManager } from '@/lib/session-manager';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

interface AppContextType {
  sessions: Session[];
  setSessions: (sessions: Session[]) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  currentSessionId: string | null;
  setCurrentSessionId: (sessionId: string | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  showLanding: boolean;
  setShowLanding: (show: boolean) => void;
  loadSessions: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  newChat: () => void;
  deleteSession: (sessionId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const router = useRouter();

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    const fetchedSessions = await SessionManager.getAllSessions();
    setSessions(fetchedSessions);
    setIsLoading(false);
  }, []);

  const loadSession = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    setCurrentSessionId(sessionId);
    const fetchedMessages = await SessionManager.fetchSessionMessages(sessionId);
    setMessages(fetchedMessages);
    setIsLoading(false);
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const newChat = () => {
    const newSessionId = uuidv4();
    router.push(`/chat/${newSessionId}`);
  };

  const deleteSession = async (sessionId: string) => {
    const success = await SessionManager.deleteSession(sessionId);
    if (success) {
      setSessions(sessions.filter((s) => s.session_id !== sessionId));
      if (currentSessionId === sessionId) {
        newChat();
      }
    }
  };

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <AppContext.Provider
      value={{
        sessions,
        setSessions,
        messages,
        setMessages,
        currentSessionId,
        setCurrentSessionId,
        isLoading,
        setIsLoading,
        showLanding,
        setShowLanding,
        loadSessions,
        loadSession,
        addMessage,
        newChat,
        deleteSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
