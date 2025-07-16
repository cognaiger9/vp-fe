"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Code, Database, User, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { EnhancedResultsDisplay } from "./enhanced-results-display"
import { Button } from "./ui/button"

interface Message {
  id: string
  type: "user" | "assistant" | "error"
  content: string
  sqlQuery?: string
  results?: Array<Record<string, any>>
  timestamp: Date
  responseTime?: number // Time in milliseconds
}

interface ChatGPTMessageProps {
  message: Message
  isNew?: boolean
}

export function ChatGPTMessage({ message, isNew = false }: ChatGPTMessageProps) {
  const [isVisible, setIsVisible] = useState(!isNew)
  const [showSqlQuery, setShowSqlQuery] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Check if results exceed the limit
  const resultsExceedLimit = message.results && message.results.length > 20
  
  // Get limited or full results based on expanded state
  const displayResults = message.results 
    ? (resultsExceedLimit && !isExpanded 
        ? message.results.slice(0, 20) 
        : message.results)
    : []

  useEffect(() => {
    if (isNew) {
      // Smooth fade-in animation for new messages
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 50)

      return () => clearTimeout(timer)
    }
  }, [isNew])

  useEffect(() => {
    if (isVisible && message.sqlQuery) {
      // Show SQL query after message content appears
      const timer = setTimeout(() => {
        setShowSqlQuery(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isVisible, message.sqlQuery])

  useEffect(() => {
    if (showSqlQuery && message.results) {
      // Show results after SQL query appears
      const timer = setTimeout(() => {
        setShowResults(true)
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [showSqlQuery, message.results])

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatResponseTime = (timeMs: number) => {
    if (timeMs < 1000) {
      return `${timeMs}ms`
    } else {
      return `${(timeMs / 1000).toFixed(1)}s`
    }
  }

  const isUser = message.type === "user"

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6 transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className={`flex max-w-4xl w-full ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 text-left ${isUser ? "ml-4" : "mr-4"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              message.type === "user" ? "bg-purple-600" : message.type === "error" ? "bg-red-600" : "bg-blue-600"
            } ${isVisible ? "scale-100" : "scale-0"}`}
          >
            {message.type === "user" ? (
              <User className="h-4 w-4 text-white" />
            ) : (
              <Database className="h-4 w-4 text-white" />
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className={`flex-1 min-w-0 ${isUser ? "text-right" : "text-left"}`}>
          <div className={`mb-2 flex items-center ${isUser ? "justify-end" : "space-x-2"}`}>
            {isUser ? (
              <>
                <span className="text-xs text-gray-500 mr-2">{formatTimestamp(message.timestamp)}</span>
                <span className="text-sm font-medium text-gray-300">You</span>
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-gray-300">QueryPilot</span>
                <span className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</span>
                {/* Response Time Badge - Only for assistant messages */}
                {message.responseTime && (
                  <Badge variant="outline" className="text-xs text-gray-400 border-gray-600 bg-gray-800/50">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatResponseTime(message.responseTime)}
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* User messages get a different styling */}
          {isUser ? (
            <div className="inline-block max-w-2xl">
              <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 text-sm leading-relaxed">
                {message.content}
              </div>
            </div>
          ) : (
            <div className="text-white text-sm leading-relaxed mb-3">
              {message.type === "error" && (
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <Badge variant="destructive" className="text-xs">
                    Access Restricted
                  </Badge>
                </div>
              )}
              {message.content}
            </div>
          )}

          {/* SQL Query Display - Only for assistant messages */}
          {!isUser && message.sqlQuery && (
            <Card
              className={`mb-4 bg-gray-800 border-gray-700 transition-all duration-700 ease-out ${
                showSqlQuery ? "opacity-100 translate-y-0 max-h-96" : "opacity-0 translate-y-4 max-h-0 overflow-hidden"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Code className="h-4 w-4 text-blue-400" />
                  <CardTitle className="text-sm text-gray-300">Generated SQL Query</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-gray-100 overflow-x-auto bg-gray-900 p-3 rounded">
                  <code>{message.sqlQuery}</code>
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Results Display - Only for assistant messages */}
          {!isUser && message.results && message.results.length > 0 && (
            <div
              className={`transition-all duration-700 ease-out ${
                showResults ? "opacity-100 translate-y-0 max-h-none" : "opacity-0 translate-y-4 max-h-0 overflow-hidden"
              }`}
            >
              <EnhancedResultsDisplay results={displayResults} title="Query Results" sqlQuery={message.sqlQuery} />
              
              {/* Show expand/collapse button when results exceed limit */}
              {resultsExceedLimit && (
                <div className="mt-2 text-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleExpand}
                    className="text-xs text-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white font-medium"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Show Less (Showing all {message.results.length} results)
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Show More (Showing 20 of {message.results.length} results)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
