"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AutoScrollAreaProps {
  children: React.ReactNode
  className?: string
  trigger?: any // Dependency that triggers auto-scroll
  shouldCreateSpace?: boolean // Whether to create space for new Q&A pair
}

export function AutoScrollArea({ children, className = "", trigger, shouldCreateSpace = false }: AutoScrollAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [lastScrollHeight, setLastScrollHeight] = useState(0)

  const scrollToBottom = (smooth = true) => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        // Always scroll to the very bottom
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight
        scrollContainer.scrollTo({
          top: maxScroll,
          behavior: smooth ? "smooth" : "auto",
        })
      }
    }
  }

  const createSpaceForNewPair = () => {
    // For new questions, always scroll to bottom to ensure input visibility
    scrollToBottom(true)
  }

  useEffect(() => {
    if (trigger !== undefined) {
      const timer = setTimeout(() => {
        if (shouldCreateSpace) {
          createSpaceForNewPair()
        } else {
          scrollToBottom(true)
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [trigger, shouldCreateSpace])

  useEffect(() => {
    // Initial scroll to bottom
    scrollToBottom(false)
  }, [])

  return (
    <ScrollArea ref={scrollAreaRef} className={className}>
      <div ref={contentRef}>{children}</div>
    </ScrollArea>
  )
}
