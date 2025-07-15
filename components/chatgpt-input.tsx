"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface ChatGPTInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onUploadKnowledge: () => void
  disabled?: boolean
}

export function ChatGPTInput({ value, onChange, onSend, onUploadKnowledge, disabled = false }: ChatGPTInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!disabled && value.trim()) {
        onSend()
      }
    }
  }

  const handleSend = () => {
    if (!disabled && value.trim()) {
      onSend()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [value])

  return (
    <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-4">
      <div className="max-w-4xl mx-auto">
        <div
          className={`relative bg-gray-800 rounded-2xl border transition-all duration-200 ${
            isFocused ? "border-gray-500 shadow-lg" : "border-gray-600"
          } ${disabled ? "opacity-50" : ""}`}
        >
          <div className="flex items-end p-2 px-3">
            {" "}
            {/* Reduced p-4 to p-2, changed px-1 to px-3 */}
            <Textarea
              ref={textareaRef}
              placeholder={disabled ? "Please wait..." : "Ask anything about your database..."}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              className="flex-1 bg-transparent border-none resize-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none min-h-[20px] max-h-[120px] py-1" // Added py-1
              rows={1}
            />
            <div className="flex items-center space-x-2 ml-2 flex-shrink-0 self-end mb-1">
              {value.trim() && (
                <Button
                  onClick={handleSend}
                  size="sm"
                  disabled={disabled}
                  className={`bg-white text-black hover:bg-gray-200 rounded-lg px-3 transition-all duration-200 ${
                    disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                  }`}
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-2">
          <p className="text-xs text-gray-500">QueryPilot can make mistakes. Check important info.</p>
        </div>
      </div>
    </div>
  )
}
