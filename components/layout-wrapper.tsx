"use client"

import type React from "react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"

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

interface LayoutWrapperProps {
  children: React.ReactNode
  chatSessions: ChatSession[]
  userRole: UserRole
  onNewChat: () => void
  onSessionClick: (sessionId: string) => void
  uploadDialogOpen: boolean
  onUploadDialogChange: (open: boolean) => void
}

export function LayoutWrapper({
  children,
  chatSessions,
  userRole,
  onNewChat,
  onSessionClick,
  uploadDialogOpen,
  onUploadDialogChange,
}: LayoutWrapperProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar
          chatSessions={chatSessions}
          userRole={userRole}
          onNewChat={onNewChat}
          onSessionClick={onSessionClick}
          uploadDialogOpen={uploadDialogOpen}
          onUploadDialogChange={onUploadDialogChange}
        />

        <SidebarInset className="flex-1 flex flex-col min-h-screen">
          <AppHeader userRole={userRole} />
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
