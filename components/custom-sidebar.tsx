"use client"

import type React from "react"

import { useState, createContext, useContext } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, X, PanelLeft } from "lucide-react"
import { UserProfileDropdown } from "./user-profile-dropdown"
import { ExternalKnowledgeUpload } from "./external-knowledge-upload"

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  isActive: boolean
}

interface UserRole {
  name: string
  permissions: string[]
  department: string
  lastLogin: Date
}

interface SidebarContextType {
  isOpen: boolean
  toggle: () => void
  close: () => void
  open: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebarContext = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggle = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)
  const open = () => setIsOpen(true)

  return <SidebarContext.Provider value={{ isOpen, toggle, close, open }}>{children}</SidebarContext.Provider>
}

export function SidebarTrigger({ className = "" }: { className?: string }) {
  const { toggle } = useSidebarContext()

  return (
    <Button variant="ghost" size="sm" onClick={toggle} className={`h-8 w-8 p-0 ${className}`}>
      <PanelLeft className="h-4 w-4" />
    </Button>
  )
}

interface CustomSidebarProps {
  chatSessions: ChatSession[]
  userRole: UserRole
  onNewChat: () => void
  onSessionClick: (sessionId: string) => void
  uploadDialogOpen: boolean
  onUploadDialogChange: (open: boolean) => void
}

export function CustomSidebar({
  chatSessions,
  userRole,
  onNewChat,
  onSessionClick,
  uploadDialogOpen,
  onUploadDialogChange,
}: CustomSidebarProps) {
  const { isOpen, close } = useSidebarContext()

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={close} />}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-80 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b border-slate-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">QueryPilot</h2>
              <Button variant="ghost" size="sm" onClick={close} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Upload External Knowledge Button */}
            <ExternalKnowledgeUpload open={uploadDialogOpen} onOpenChange={onUploadDialogChange} />

            {/* New Chat Button */}
            <Button onClick={onNewChat} variant="outline" className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-500 px-2 mb-2">Recent Chats</h3>
              {chatSessions.map((session) => (
                <div key={session.id}>
                  <Button
                    variant={session.isActive ? "secondary" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => onSessionClick(session.id)}
                  >
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-sm font-medium truncate">{session.title}</div>
                      <div className="text-xs text-slate-500 truncate">{session.timestamp.toLocaleDateString()}</div>
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-slate-200 p-4">
            <UserProfileDropdown userRole={userRole} />
          </div>
        </div>
      </div>
    </>
  )
}
