import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Code } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant" | "error"
  content: string
  sqlQuery?: string
  results?: Array<Record<string, any>>
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-3xl ${message.type === "user" ? "ml-12" : "mr-12"}`}>
        <div
          className={`rounded-lg p-4 ${
            message.type === "user"
              ? "bg-blue-600 text-white"
              : message.type === "error"
                ? "bg-red-50 border border-red-200"
                : "bg-white border border-slate-200"
          }`}
        >
          {message.type === "error" && (
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-700">Access Restricted</span>
            </div>
          )}

          <p
            className={`text-sm leading-relaxed ${
              message.type === "user" ? "text-white" : message.type === "error" ? "text-red-700" : "text-slate-700"
            }`}
          >
            {message.content}
          </p>

          <div className="flex items-center justify-between mt-2">
            <span
              className={`text-xs ${
                message.type === "user" ? "text-blue-200" : message.type === "error" ? "text-red-500" : "text-slate-500"
              }`}
            >
              {formatTimestamp(message.timestamp)}
            </span>
            {message.type === "assistant" && <CheckCircle className="h-3 w-3 text-green-500" />}
          </div>
        </div>

        {/* SQL Query Display */}
        {message.sqlQuery && (
          <Card className="mt-3 bg-slate-900 border-slate-700">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-slate-400" />
                <CardTitle className="text-sm text-slate-300">Generated SQL Query</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-slate-100 overflow-x-auto">
                <code>{message.sqlQuery}</code>
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Results Table */}
        {message.results && message.results.length > 0 && (
          <Card className="mt-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-700">Query Results ({message.results.length} rows)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      {Object.keys(message.results[0]).map((key) => (
                        <th key={key} className="text-left py-2 px-3 font-medium text-slate-600 bg-slate-50">
                          {key.replace(/_/g, " ").toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {message.results.map((row, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="py-2 px-3 text-slate-700">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
