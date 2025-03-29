"use client"

import type React from "react"
import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  onSendMessage: (text: string) => void
  isLoading: boolean
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-2 md:p-3 lg:p-4 border-t border-white/5"
    >
      <div className="flex items-center gap-2 max-w-3xl mx-auto">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-800/30 text-white rounded-full px-3 py-2 md:px-4 md:py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-400/70 border border-slate-700/30 focus:shadow-[0_0_8px_rgba(96,165,250,0.4)]"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-full bg-blue-500 hover:bg-blue-400 h-9 w-9 md:h-10 md:w-10 shadow-[0_0_10px_rgba(96,165,250,0.4)] border border-blue-400/50"
          disabled={isLoading || !message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

