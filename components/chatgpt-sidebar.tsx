"use client"

import type React from "react"
import { useState, createContext, useContext } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Plus,
  Upload,
  Search,
  Database,
  MessageSquare,
  User,
  ChevronDown,
  LogOut,
  MoreHorizontal,
  Trash2,
  Edit3,
  Archive,
} from "lucide-react"
import { DatabaseSchemaDialog } from "./database-schema-dialog"

interface SidebarContextType {
  isOpen: boolean
  toggle: () => void
  close: () => void
  open: () => void
}

interface UserRole {
  name: string
  department: string
  lastLogin: Date
}

interface ChatSession {
  id: string
  title: string
  isActive: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useChatGPTSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useChatGPTSidebar must be used within SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

export function ChatGPTSidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggle = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)
  const open = () => setIsOpen(true)

  return <SidebarContext.Provider value={{ isOpen, toggle, close, open }}>{children}</SidebarContext.Provider>
}

export function SidebarToggle({ className = "" }: { className?: string }) {
  const { toggle } = useChatGPTSidebar()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className={`h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700 ${className}`}
    >
      <Menu className="h-4 w-4" />
    </Button>
  )
}

interface ChatSessionOptionsProps {
  session: ChatSession
  onDeleteSession: (sessionId: string) => void
}

function ChatSessionOptions({ session, onDeleteSession }: ChatSessionOptionsProps) {
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    onDeleteSession(session.id)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-gray-600 rounded transition-all duration-200 group-hover:text-gray-400"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Chat Session Options</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-sm text-gray-300 mb-4">
            <span className="font-medium">Session:</span> {session.title}
          </div>

          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => {
                setOpen(false)
              }}
            >
              <Edit3 className="h-4 w-4 mr-3" />
              Rename Session
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => {
                setOpen(false)
              }}
            >
              <Archive className="h-4 w-4 mr-3" />
              Archive Session
            </Button>

            <Button
              variant="ghost"
              onClick={handleDelete}
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4 mr-3" />
              Delete Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ChatGPTSidebarProps {
  chatSessions: ChatSession[]
  userRole: UserRole
  onNewChat: () => void
  onSessionClick: (sessionId: string) => void
  onUploadKnowledge: () => void
  onDeleteSession: (sessionId: string) => void
}

export function ChatGPTSidebar({
  chatSessions,
  userRole,
  onNewChat,
  onSessionClick,
  onUploadKnowledge,
  onDeleteSession,
}: ChatGPTSidebarProps) {
  const { isOpen, close } = useChatGPTSidebar()
  const [showDatabaseSchema, setShowDatabaseSchema] = useState(false)

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={close} />}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out overflow-hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-3 flex-shrink-0">
            <Button
              onClick={onNewChat}
              className="w-full bg-transparent border border-gray-600 text-white hover:bg-gray-700 justify-start"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Navigation */}
          <div className="p-3 border-b border-gray-700 flex-shrink-0 space-y-1">
            <Button
              variant="ghost"
              onClick={onUploadKnowledge}
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <Upload className="h-4 w-4 mr-3" />
              Upload Knowledge
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => setShowDatabaseSchema(true)}
            >
              <Database className="h-4 w-4 mr-3" />
              Database Schema
            </Button>
          </div>

          {/* Chat Sessions */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-3">
                <h3 className="text-xs font-medium text-gray-400 px-2 mb-2 uppercase tracking-wider">Recent</h3>
                <div className="space-y-1">
                  {chatSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`group rounded-md transition-colors ${
                        session.isActive ? "bg-gray-700" : "hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center" style={{ width: "232px", maxWidth: "232px" }}>
                        <div
                          className="flex items-center p-2 cursor-pointer"
                          onClick={() => onSessionClick(session.id)}
                          style={{ width: "200px", maxWidth: "200px", overflow: "hidden" }}
                        >
                          <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                          <span
                            className={`text-sm font-medium truncate ${
                              session.isActive ? "text-white" : "text-gray-300"
                            }`}
                          >
                            {session.title}
                          </span>
                        </div>

                        <div
                          className="flex items-center justify-center"
                          style={{ width: "32px", height: "32px", flexShrink: 0 }}
                        >
                          <ChatSessionOptions session={session} onDeleteSession={onDeleteSession} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* User Profile */}
          <div className="p-3 border-t border-gray-700 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{userRole.name}</div>
                    <div className="text-xs text-gray-400">{userRole.department}</div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="right" className="w-64 bg-gray-800 border-gray-700" sideOffset={8}>
                <div className="px-3 py-3 border-b border-gray-700">
                  <div className="text-sm text-gray-200">
                    <div className="font-medium">{userRole.name}</div>
                    <div className="text-xs text-gray-400">{userRole.department}</div>
                    <div className="mt-2 text-xs text-gray-400">
                      <div className="font-medium text-gray-300">Location:</div>
                      <div>New York, USA</div>
                    </div>
                  </div>
                </div>
                <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Database Schema Dialog */}
      <DatabaseSchemaDialog open={showDatabaseSchema} onOpenChange={setShowDatabaseSchema} />
    </>
  )
}
