"use client"

import { X, Plus, Globe, MessageSquare, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatSession, SessionManager } from "@/lib/session-manager"
import { formatDistanceToNow } from "date-fns"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  currentSessionId: string | null
  onNewChat: () => void
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  currentSessionId,
  onNewChat,
}: SidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchSessions = useCallback(async () => {
    setIsLoading(true)
    try {
      const fetchedSessions = await SessionManager.getAllSessions()
      setSessions(fetchedSessions)
    } catch (error) {
      console.error("Failed to fetch sessions:", error)
      // Optionally, show an error message to the user
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // Implement session deletion logic if required by your API
    // e.g., await SessionManager.deleteSession(sessionId)
    // After deletion, refetch sessions
    await fetchSessions()
  }
  const handleNewChat = () => {
    router.push("/chat/new")
    // Only close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }

  const handleLoadSession = (sessionId: string) => {
    router.push(`/chat/${sessionId}`)
    // Only close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-indigo-950/90 to-slate-900/90 backdrop-blur-lg border-r border-white/10 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl">
              A
            </div>
            <h1 className="text-2xl font-bold text-white">Mutumwa</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>        <div className="p-3">
          <Button onClick={handleNewChat} className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 mb-3">
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </Button>
          
          
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3">
          <div className="text-xs text-slate-400 mb-2 px-2">Recent Chats</div>
          <div className="space-y-1">
            {isLoading ? (
              <div className="text-xs text-slate-500 text-center py-4 px-2">
                Loading chats...
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-4 px-2">
                No previous chats
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.session_id}
                  className={`group relative p-2 rounded-lg cursor-pointer transition-colors ${
                    session.session_id === currentSessionId
                      ? "bg-blue-600/20 border border-blue-400/30"
                      : "hover:bg-slate-800/50"
                  }`}
                  onClick={() => handleLoadSession(session.session_id)}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate mb-1">
                        {session.metadata?.name || "New Chat"}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {/* You might want to display the last message here if available */}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSession(session.session_id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all"
                      title="Delete chat"
                    >
                      <Trash2 className="h-3 w-3 text-red-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-3 border-t border-white/10 mt-auto">
          <div className="mt-4 text-xs text-slate-400 text-center">
            <p>© 2025 Mutumwa</p>
            <p>Your African Language Assistant</p>
          </div>
        </div>
      </aside>
    </>
  )
}

