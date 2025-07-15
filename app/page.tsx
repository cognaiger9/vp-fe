"use client"

import { useState } from "react"
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

interface Message {
  id: string
  type: "user" | "assistant" | "error"
  content: string
  sqlQuery?: string
  results?: Array<Record<string, any>>
  timestamp: Date
  isNew?: boolean
  responseTime?: number // Time in milliseconds
}

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

export default function QueryPilot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "CASA Growth Analysis 2024 vs 2023",
      lastMessage: "Compare CASA growth by segment...",
      timestamp: new Date(Date.now() - 86400000 * 0.5), // Today
      isActive: true, // Set this one as active for initial load
    },
    {
      id: "2",
      title: "Monthly Revenue Report Q4",
      lastMessage: "Generate monthly revenue report for Q4",
      timestamp: new Date(Date.now() - 86400000 * 1.2), // Yesterday
      isActive: false,
    },
    {
      id: "3",
      title: "Customer Segmentation Analysis",
      lastMessage: "Analyze customer segments by value",
      timestamp: new Date(Date.now() - 86400000 * 3), // 3 days ago
      isActive: false,
    },
    {
      id: "4",
      title: "Product Performance Review",
      lastMessage: "Top 10 products by sales volume last quarter",
      timestamp: new Date(Date.now() - 86400000 * 7), // 7 days ago
      isActive: false,
    },
    {
      id: "5",
      title: "Employee Turnover Rate Q1",
      lastMessage: "Calculate employee turnover for Q1 2024",
      timestamp: new Date(Date.now() - 86400000 * 15), // 15 days ago
      isActive: false,
    },
    {
      id: "6",
      title: "Marketing Campaign ROI",
      lastMessage: "Evaluate ROI for recent marketing campaigns",
      timestamp: new Date(Date.now() - 86400000 * 30), // 30 days ago
      isActive: false,
    },
    {
      id: "7",
      title: "Supply Chain Optimization",
      lastMessage: "Identify bottlenecks in the supply chain",
      timestamp: new Date(Date.now() - 86400000 * 60), // 2 months ago
      isActive: false,
    },
  ])

  const [inputValue, setInputValue] = useState("")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [scrollTrigger, setScrollTrigger] = useState(0)
  const [requestStartTime, setRequestStartTime] = useState<number | null>(null)

  const userRole: UserRole = {
    name: "Alex Chen",
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

  const triggerScroll = () => {
    setScrollTrigger((prev) => prev + 1)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim() || isThinking) return

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      isNew: true,
    }

    setMessages((prev) => [...prev, newMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsThinking(true)

    // Start timing the response
    const startTime = Date.now()
    setRequestStartTime(startTime)

    setTimeout(() => triggerScroll(), 50)

    // Simulate variable response times based on query complexity
    const getResponseTime = (input: string) => {
      const lowerInput = input.toLowerCase()
      if (lowerInput.includes("casa") || lowerInput.includes("growth")) {
        return 2500 // Complex analysis takes longer
      } else if (lowerInput.includes("customer") || lowerInput.includes("segment")) {
        return 3200 // Customer analysis is complex
      } else if (lowerInput.includes("revenue") || lowerInput.includes("sales")) {
        return 2800 // Revenue queries are moderately complex
      } else if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
        return 800 // Simple greetings are fast
      } else {
        return 2000 // Default response time
      }
    }

    const responseTime = getResponseTime(currentInput)

    setTimeout(() => {
      setIsThinking(false)
      const actualResponseTime = Date.now() - startTime

      const input = currentInput.toLowerCase()
      let aiResponse: Message

      if (input.includes("hello") || input.includes("hi")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content:
            "Hello! I'm QueryPilot, your AI SQL assistant. I can help you analyze data, generate reports, create visualizations, and export results in various formats. What would you like to explore today?",
          timestamp: new Date(),
          isNew: true,
          responseTime: actualResponseTime,
        }
      } else if (input.includes("casa") || input.includes("growth")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: "Here's the CASA growth analysis comparing 2024 vs 2023 by segment:",
          sqlQuery: `SELECT 
    segment,
    SUM(CASE WHEN YEAR(date) = 2023 THEN casa_balance ELSE 0 END) as casa_2023,
    SUM(CASE WHEN YEAR(date) = 2024 THEN casa_balance ELSE 0 END) as casa_2024,
    ROUND(((SUM(CASE WHEN YEAR(date) = 2024 THEN casa_balance ELSE 0 END) - 
            SUM(CASE WHEN YEAR(date) = 2023 THEN casa_balance ELSE 0 END)) / 
            SUM(CASE WHEN YEAR(date) = 2023 THEN casa_balance ELSE 0 END)) * 100, 2) as growth_rate
FROM casa_accounts ca
JOIN customer_segments cs ON ca.customer_id = cs.customer_id
WHERE YEAR(date) IN (2023, 2024)
GROUP BY segment
ORDER BY growth_rate DESC;`,
          results: [
            {
              segment: "Premium",
              casa_2023: 15420000000,
              casa_2024: 18950000000,
              growth_rate: 22.89,
            },
            {
              segment: "Corporate",
              casa_2023: 28750000000,
              casa_2024: 34200000000,
              growth_rate: 18.96,
            },
            {
              segment: "SME",
              casa_2023: 12300000000,
              casa_2024: 14100000000,
              growth_rate: 14.63,
            },
            {
              segment: "Retail",
              casa_2023: 45600000000,
              casa_2024: 51800000000,
              growth_rate: 13.6,
            },
            {
              segment: "Mass Market",
              casa_2023: 8900000000,
              casa_2024: 9850000000,
              growth_rate: 10.67,
            },
          ],
          timestamp: new Date(),
          isNew: true,
          responseTime: actualResponseTime,
        }
      } else if (input.includes("customer") || input.includes("segment")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: "Here's the customer segmentation analysis with detailed metrics:",
          sqlQuery: `SELECT 
    cs.segment_name,
    COUNT(DISTINCT c.customer_id) as customer_count,
    AVG(a.balance) as avg_balance,
    SUM(a.balance) as total_balance,
    ROUND(AVG(DATEDIFF(CURRENT_DATE, c.registration_date) / 365), 1) as avg_tenure_years
FROM customers c
JOIN customer_segments cs ON c.segment_id = cs.segment_id
JOIN accounts a ON c.customer_id = a.customer_id
WHERE a.status = 'ACTIVE'
GROUP BY cs.segment_name, cs.segment_id
ORDER BY total_balance DESC;`,
          results: [
            {
              segment_name: "High Net Worth",
              customer_count: 2847,
              avg_balance: 2850000,
              total_balance: 8115450000,
              avg_tenure_years: 8.3,
            },
            {
              segment_name: "Corporate",
              customer_count: 1256,
              avg_balance: 4200000,
              total_balance: 5275200000,
              avg_tenure_years: 6.7,
            },
            {
              segment_name: "Premium Individual",
              customer_count: 15420,
              avg_balance: 285000,
              total_balance: 4394700000,
              avg_tenure_years: 4.2,
            },
            {
              segment_name: "SME",
              customer_count: 8934,
              avg_balance: 420000,
              total_balance: 3752280000,
              avg_tenure_years: 3.8,
            },
            {
              segment_name: "Mass Market",
              customer_count: 45678,
              avg_balance: 45000,
              total_balance: 2055510000,
              avg_tenure_years: 2.1,
            },
          ],
          timestamp: new Date(),
          isNew: true,
          responseTime: actualResponseTime,
        }
      } else if (input.includes("revenue") || input.includes("sales")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: "Here's your revenue analysis with monthly breakdown:",
          sqlQuery: `SELECT 
    DATE_FORMAT(transaction_date, '%Y-%m') as month,
    COUNT(*) as transaction_count,
    SUM(amount) as total_revenue,
    AVG(amount) as avg_transaction_value,
    COUNT(DISTINCT customer_id) as unique_customers
FROM transactions 
WHERE transaction_date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
  AND transaction_type = 'REVENUE'
GROUP BY DATE_FORMAT(transaction_date, '%Y-%m')
ORDER BY month DESC;`,
          results: [
            {
              month: "2024-12",
              transaction_count: 15678,
              total_revenue: 234507500,
              avg_transaction_value: 14950,
              unique_customers: 9876,
            },
            {
              month: "2024-11",
              transaction_count: 14234,
              total_revenue: 218905000,
              avg_transaction_value: 15385,
              unique_customers: 8934,
            },
            {
              month: "2024-10",
              transaction_count: 17890,
              total_revenue: 287502500,
              avg_transaction_value: 16075,
              unique_customers: 11234,
            },
            {
              month: "2024-09",
              transaction_count: 13456,
              total_revenue: 196750000,
              avg_transaction_value: 14625,
              unique_customers: 8567,
            },
            {
              month: "2024-08",
              transaction_count: 18945,
              total_revenue: 312508000,
              avg_transaction_value: 16495,
              unique_customers: 12456,
            },
          ],
          timestamp: new Date(),
          isNew: true,
          responseTime: actualResponseTime,
        }
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content:
            "I can help you with various types of analysis including data visualization, file exports, and comprehensive reporting. Here's a sample database overview:",
          sqlQuery: `SELECT 
    table_name,
    column_count,
    row_count,
    last_updated,
    table_size_mb
FROM information_schema.tables_summary
WHERE schema_name = 'banking_db'
ORDER BY row_count DESC;`,
          results: [
            {
              table_name: "transactions",
              column_count: 12,
              row_count: 2847563,
              last_updated: "2024-12-15 11:45:00",
              table_size_mb: 1250,
            },
            {
              table_name: "customers",
              column_count: 18,
              row_count: 156789,
              last_updated: "2024-12-15 10:30:00",
              table_size_mb: 89,
            },
            {
              table_name: "accounts",
              column_count: 15,
              row_count: 234567,
              last_updated: "2024-12-15 09:15:00",
              table_size_mb: 156,
            },
            {
              table_name: "casa_accounts",
              column_count: 10,
              row_count: 89456,
              last_updated: "2024-12-14 16:20:00",
              table_size_mb: 67,
            },
          ],
          timestamp: new Date(),
          isNew: true,
          responseTime: actualResponseTime,
        }
      }

      setMessages((prev) => [...prev, aiResponse])
      setTimeout(() => triggerScroll(), 100)
    }, responseTime)
  }

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      lastMessage: "",
      timestamp: new Date(),
      isActive: true,
    }

    setChatSessions((prev) => prev.map((session) => ({ ...session, isActive: false })))
    setChatSessions((prev) => [newSession, ...prev])
    setMessages([])
    setIsThinking(false)
  }

  const handleSessionClick = (sessionId: string) => {
    setChatSessions((prev) =>
      prev.map((session) => ({
        ...session,
        isActive: session.id === sessionId,
      })),
    )
    setIsThinking(false)

    if (sessionId === "1") {
      setMessages([
        {
          id: "demo1",
          type: "user",
          content: "Compare CASA growth rate between 2024 and 2023 by customer segment",
          timestamp: new Date(Date.now() - 240000),
        },
        {
          id: "demo2",
          type: "assistant",
          content: "Here's the CASA growth analysis comparing 2024 vs 2023 by segment:",
          sqlQuery: `SELECT segment, casa_2023, casa_2024, growth_rate FROM casa_growth_analysis;`,
          results: [
            { segment: "Premium", casa_2023: 15420000000, casa_2024: 18950000000, growth_rate: 22.89 },
            { segment: "Corporate", casa_2023: 28750000000, casa_2024: 34200000000, growth_rate: 18.96 },
          ],
          timestamp: new Date(Date.now() - 180000),
          responseTime: 2340, // Example response time
        },
      ])
    } else {
      setMessages([])
    }
  }

  const handleDeleteSession = (sessionId: string) => {
    // Don't delete if it's the only session or if it's currently active
    if (chatSessions.length <= 1) return

    const sessionToDelete = chatSessions.find((s) => s.id === sessionId)
    if (!sessionToDelete) return

    // If deleting the active session, switch to another session
    if (sessionToDelete.isActive) {
      const remainingSessions = chatSessions.filter((s) => s.id !== sessionId)
      if (remainingSessions.length > 0) {
        // Activate the first remaining session
        setChatSessions((prev) =>
          prev.filter((s) => s.id !== sessionId).map((s, index) => ({ ...s, isActive: index === 0 })),
        )
        // Clear messages for the new active session
        setMessages([])
      }
    } else {
      // Just remove the session if it's not active
      setChatSessions((prev) => prev.filter((s) => s.id !== sessionId))
    }
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
