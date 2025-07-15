"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChatGPTMessage } from "@/components/chatgpt-message"
import { ChatGPTInput } from "@/components/chatgpt-input"
import { ChatGPTHeader } from "@/components/chatgpt-header"
import { ChatGPTWelcome } from "@/components/chatgpt-welcome"
import { ChatGPTSidebarProvider, ChatGPTSidebar } from "@/components/chatgpt-sidebar"
import { ChatGPTMainContent } from "@/components/chatgpt-main-content"
import { ExternalKnowledgeUpload } from "@/components/external-knowledge-upload"
import { ChatGPTThinking } from "@/components/chatgpt-thinking"
import { AutoScrollArea } from "@/components/auto-scroll-area"
import { useAuth } from "@/lib/auth"
import { chat, ChatSessionResponse, ChatMessageResponse } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

// Updated interfaces to match backend response
interface Message {
  id: string
  type: "user" | "assistant" | "error"
  content: string
  sqlQuery?: string
  results?: Array<Record<string, any>>
  timestamp: Date
  isNew?: boolean
  responseTime?: number
  responseType?: string
  executionTime?: number
  rowsCount?: number
  hasData?: boolean
}

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  isActive: boolean
  messageCount: number
}

interface UserRole {
  name: string
  permissions: string[]
  department: string
  lastLogin: Date
}

export default function QueryPilot() {
  const { user, isLoading } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [scrollTrigger, setScrollTrigger] = useState(0)
  const [requestStartTime, setRequestStartTime] = useState<number | null>(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  const userRole: UserRole = {
    name: user?.full_name || "User",
    permissions: [
      "READ_CUSTOMERS",
      "READ_ORDERS",
      "READ_PRODUCTS",
      "GENERATE_REPORTS",
      "EXPORT_DATA",
      "VIEW_ANALYTICS",
    ],
    department: "Business Intelligence",
    lastLogin: new Date(Date.now() - 3600000),
  }

  // Load chat history on component mount
  useEffect(() => {
    if (user && !isLoading) {
      loadChatHistory()
    }
  }, [user, isLoading])

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true)
      const sessions = await chat.getChatHistory()
      
      const formattedSessions: ChatSession[] = sessions.map((session, index) => ({
        id: session.id,
        title: session.title,
        lastMessage: `${session.message_count} messages`,
        timestamp: new Date(session.updated_at),
        isActive: index === 0, // Set first session as active
        messageCount: session.message_count
      }))

      setChatSessions(formattedSessions)
      
      // Load messages for the first session if it exists
      if (formattedSessions.length > 0) {
        await loadChatMessages(formattedSessions[0].id)
        setCurrentChatId(formattedSessions[0].id)
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      })
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const loadChatMessages = async (chatId: string) => {
    try {
      const chatData = await chat.getChatById(chatId)
      
      const formattedMessages: Message[] = chatData.messages.map(msg => {
        let results: Array<Record<string, any>> | undefined = undefined
        
        // For table/chart responses, try to parse data from content (legacy) or use separate data field
        if (msg.response_type === 'table' || msg.response_type === 'chart') {
          try {
            // Try parsing content as JSON (legacy format)
            results = JSON.parse(msg.content)
          } catch (e) {
            // If parsing fails, content is human-readable message
            // Results should come from separate API call if needed
            results = undefined
          }
        }

        return {
          id: msg.id,
          type: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
          sqlQuery: msg.sql_query || undefined,
          results,
          timestamp: new Date(msg.created_at),
          responseType: msg.response_type || undefined,
          executionTime: msg.execution_time || undefined,
          rowsCount: msg.rows_count || undefined,
          hasData: msg.has_data,
        }
      })

      setMessages(formattedMessages)
    } catch (error) {
      console.error('Error loading chat messages:', error)
      toast({
        title: "Error",
        description: "Failed to load chat messages",
        variant: "destructive",
      })
    }
  }

  const triggerScroll = () => {
    setScrollTrigger((prev) => prev + 1)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isThinking || !user) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      isNew: true,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsThinking(true)

    const startTime = Date.now()
    setRequestStartTime(startTime)

    setTimeout(() => triggerScroll(), 50)

    try {
      let response
      
      if (currentChatId) {
        // Continue existing chat
        response = await chat.continueChat(currentChatId, { message: currentInput })
      } else {
        // Create new chat
        response = await chat.newChat({ message: currentInput })
        setCurrentChatId(response.chat_id)
        
        // Update chat sessions with new chat
        const newSession: ChatSession = {
          id: response.chat_id,
          title: response.title,
          lastMessage: currentInput.substring(0, 50) + "...",
          timestamp: new Date(response.created_at),
          isActive: true,
          messageCount: 2 // user message + assistant response
        }
        
        setChatSessions(prev => 
          [newSession, ...prev.map(s => ({ ...s, isActive: false }))]
        )
      }

      const actualResponseTime = Date.now() - startTime
      
      // Use the new response structure with separate content, data, and SQL
      const assistantMessage: Message = {
        id: response.message_id,
        type: "assistant",
        content: response.response.content, // Human-readable message
        sqlQuery: response.response.sql_query || undefined,
        results: response.response.data || undefined, // Query results in separate field
        timestamp: new Date(),
        isNew: true,
        responseTime: actualResponseTime,
        responseType: response.response.type,
        executionTime: response.response.execution_time,
        rowsCount: response.response.rows_count,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setTimeout(() => triggerScroll(), 100)

    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: "error",
        content: "Sorry, there was an error processing your message. Please try again.",
        timestamp: new Date(),
        isNew: true,
      }

      setMessages((prev) => [...prev, errorMessage])
      
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsThinking(false)
    }
  }

  const handleNewChat = () => {
    // Reset current chat state
    setCurrentChatId(null)
    setMessages([])
    setIsThinking(false)
    
    // Deactivate all sessions
    setChatSessions(prev => prev.map(session => ({ ...session, isActive: false })))
  }

  const handleSessionClick = async (sessionId: string) => {
    if (sessionId === currentChatId) return

    try {
      setChatSessions(prev =>
        prev.map(session => ({
          ...session,
          isActive: session.id === sessionId,
        }))
      )
      
      setCurrentChatId(sessionId)
      setIsThinking(false)
      await loadChatMessages(sessionId)
    } catch (error) {
      console.error('Error loading session:', error)
      toast({
        title: "Error",
        description: "Failed to load chat session",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (chatSessions.length <= 1) return

    try {
      await chat.deleteChat(sessionId)
      
      const sessionToDelete = chatSessions.find(s => s.id === sessionId)
      if (!sessionToDelete) return

      // If deleting the active session, switch to another session
      if (sessionToDelete.isActive) {
        const remainingSessions = chatSessions.filter(s => s.id !== sessionId)
        if (remainingSessions.length > 0) {
          setChatSessions(prev =>
            prev.filter(s => s.id !== sessionId).map((s, index) => ({ ...s, isActive: index === 0 }))
          )
          // Load the new active session
          await loadChatMessages(remainingSessions[0].id)
          setCurrentChatId(remainingSessions[0].id)
        } else {
          // No remaining sessions, reset to new chat state
          handleNewChat()
        }
      } else {
        // Just remove the session if it's not active
        setChatSessions(prev => prev.filter(s => s.id !== sessionId))
      }

      toast({
        title: "Success",
        description: "Chat deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting session:', error)
      toast({
        title: "Error",
        description: "Failed to delete chat",
        variant: "destructive",
      })
    }
  }

  // Show loading state while authenticating or loading history
  if (isLoading || isLoadingHistory) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return null // Auth hook will handle redirect
  }

  const isWelcomeState = messages.length === 0

  return (
    <div className="bg-gray-900 min-h-screen">
      <ChatGPTSidebarProvider defaultOpen={true}>
        <ChatGPTSidebar
          chatSessions={chatSessions}
          userRole={userRole}
          onNewChat={handleNewChat}
          onSessionClick={handleSessionClick}
          onUploadKnowledge={() => setUploadDialogOpen(true)}
          onDeleteSession={handleDeleteSession}
        />

        <ChatGPTMainContent>
          <div className="flex flex-col h-screen">
            <ChatGPTHeader userRole={userRole} />

            {isWelcomeState ? (
              <ChatGPTWelcome />
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                <AutoScrollArea className="flex-1" trigger={scrollTrigger}>
                  <div className="max-w-4xl mx-auto p-6 pb-4">
                    {messages.map((message) => (
                      <ChatGPTMessage key={message.id} message={message} isNew={message.isNew} />
                    ))}
                    {isThinking && <ChatGPTThinking />}
                  </div>
                </AutoScrollArea>

                <div className="flex-shrink-0">
                  <ChatGPTInput
                    value={inputValue}
                    onChange={setInputValue}
                    onSend={handleSendMessage}
                    onUploadKnowledge={() => setUploadDialogOpen(true)}
                    disabled={isThinking}
                  />
                </div>
              </div>
            )}

            {isWelcomeState && (
              <div className="flex-shrink-0">
                <ChatGPTInput
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={handleSendMessage}
                  onUploadKnowledge={() => setUploadDialogOpen(true)}
                  disabled={isThinking}
                />
              </div>
            )}
          </div>
        </ChatGPTMainContent>

        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Upload External Knowledge</DialogTitle>
            </DialogHeader>
            <ExternalKnowledgeUpload open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
          </DialogContent>
        </Dialog>
      </ChatGPTSidebarProvider>
    </div>
  )
}
