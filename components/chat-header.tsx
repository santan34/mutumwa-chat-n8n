"use client"

import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Language } from "@/lib/languages"
import { Button } from "@/components/ui/button"

interface ChatHeaderProps {
  selectedLanguage: Language
  setSelectedLanguage: (language: Language) => void
  languages: Language[]
  onNewChat: () => void
}

export default function ChatHeader({ selectedLanguage, setSelectedLanguage, languages, onNewChat }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/40">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-xl">
          A
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Alex</h1>
          <p className="text-sm text-slate-400">Your African Language Assistant</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={onNewChat} className="text-slate-300 hover:text-white hover:bg-slate-800/70">
          New Chat
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-800/70 backdrop-blur-sm hover:bg-slate-700/70 transition-colors border border-slate-700/50">
            <span>{selectedLanguage.label}</span>
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto">
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.value}
                onClick={() => setSelectedLanguage(language)}
                className="cursor-pointer"
              >
                {language.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

