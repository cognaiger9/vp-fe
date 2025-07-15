"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Shield } from "lucide-react"

interface UserRole {
  name: string
  permissions: string[]
  department: string
  lastLogin: Date
}

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  userRole: UserRole
}

export function ChatInput({ value, onChange, onSend, userRole }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="bg-white border-t border-slate-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex space-x-3">
          <div className="flex-1">
            <Textarea
              placeholder="Ask me anything about your database... (e.g., 'Show me top selling products this month')"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] resize-none border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-500">Press Enter to send, Shift+Enter for new line</span>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Shield className="h-3 w-3" />
                <span>Quick Access: {userRole.permissions.slice(0, 2).join(", ")}...</span>
              </div>
            </div>
          </div>
          <Button
            onClick={onSend}
            disabled={!value.trim()}
            className="self-start bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
