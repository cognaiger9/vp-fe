"use client"

import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { MessageSquare } from "lucide-react"

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  isActive: boolean
}

interface ChatSessionItemProps {
  session: ChatSession
  onClick: (sessionId: string) => void
}

export function ChatSessionItem({ session, onClick }: ChatSessionItemProps) {
  const formatSessionDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => onClick(session.id)}
        isActive={session.isActive}
        className="w-full justify-start"
      >
        <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{session.title}</div>
          <div className="text-xs text-slate-500 truncate">{formatSessionDate(session.timestamp)}</div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
