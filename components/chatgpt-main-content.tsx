"use client"

import type React from "react"

import { useChatGPTSidebar } from "./chatgpt-sidebar"

interface ChatGPTMainContentProps {
  children: React.ReactNode
}

export function ChatGPTMainContent({ children }: ChatGPTMainContentProps) {
  const { isOpen } = useChatGPTSidebar()

  return (
    <div
      className={`min-h-screen bg-gray-900 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-64" : "ml-0"}`}
    >
      {children}
    </div>
  )
}
