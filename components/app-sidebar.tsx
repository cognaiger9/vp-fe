"use client"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar"
import { Plus, X } from "lucide-react"
import { ChatSessionItem } from "./chat-session-item"
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

interface AppSidebarProps {
  chatSessions: ChatSession[]
  userRole: UserRole
  onNewChat: () => void
  onSessionClick: (sessionId: string) => void
  uploadDialogOpen: boolean
  onUploadDialogChange: (open: boolean) => void
}

export function AppSidebar({
  chatSessions,
  userRole,
  onNewChat,
  onSessionClick,
  uploadDialogOpen,
  onUploadDialogChange,
}: AppSidebarProps) {
  const { setOpen } = useSidebar()

  return (
    <Sidebar variant="sidebar" className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">QueryPilot</h2>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="h-6 w-6 p-0">
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
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatSessions.map((session) => (
                <ChatSessionItem key={session.id} session={session} onClick={onSessionClick} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 p-4">
        <UserProfileDropdown userRole={userRole} />
      </SidebarFooter>
    </Sidebar>
  )
}
