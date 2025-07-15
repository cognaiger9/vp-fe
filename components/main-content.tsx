"use client"

import type React from "react"

import { useSidebarContext } from "./custom-sidebar"

interface MainContentProps {
  children: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  const { isOpen } = useSidebarContext()

  return (
    <div className={`min-h-screen transition-all duration-300 ease-in-out ${isOpen ? "lg:ml-80" : "ml-0"}`}>
      {children}
    </div>
  )
}
