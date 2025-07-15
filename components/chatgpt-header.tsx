import { Badge } from "@/components/ui/badge"
import { SidebarToggle } from "./chatgpt-sidebar"
import { Database } from "lucide-react"

interface UserRole {
  name: string
  permissions: string[]
  department: string
  lastLogin: Date
}

interface ChatGPTHeaderProps {
  userRole: UserRole
}

export function ChatGPTHeader({ userRole }: ChatGPTHeaderProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SidebarToggle />
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-semibold text-white">QueryPilot</h1>
            
          </div>
        </div>
      </div>
    </header>
  )
}
