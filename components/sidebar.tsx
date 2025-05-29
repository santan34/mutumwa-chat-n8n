"use client"

import { X, Plus, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  onNewChat: () => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function Sidebar({ onNewChat, isOpen, setIsOpen }: SidebarProps) {
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
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-lg">
              A
            </div>
            <h1 className="text-lg font-bold text-white">Mutumwa</h1>
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
          <Button onClick={onNewChat} className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 mb-3">
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </Button>
          
          <Button 
            asChild
            variant="outline"
            className="w-full flex items-center gap-2 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800/50"
          >
            <a href="https://mutdash.afrainity.com/" target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4" />
              <span>Dashboard</span>
            </a>
          </Button>
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

