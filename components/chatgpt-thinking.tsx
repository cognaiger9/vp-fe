"use client"

import { useEffect, useState } from "react"
import { Database, Loader2 } from "lucide-react"

export function ChatGPTThinking() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`flex mb-6 transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex max-w-4xl w-full">
        {/* Avatar */}
        <div className="flex-shrink-0 mr-4">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 transition-all duration-300 ${
              isVisible ? "scale-100" : "scale-0"
            }`}
          >
            <Database className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Thinking Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-300">QueryPilot</span>
            <span className="text-xs text-gray-500 ml-2">thinking...</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-sm">Analyzing your query...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
