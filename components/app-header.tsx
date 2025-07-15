import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "./custom-sidebar"
import { Database, User, Shield } from "lucide-react"

interface UserRole {
  name: string
  permissions: string[]
  department: string
  lastLogin: Date
}

interface AppHeaderProps {
  userRole: UserRole
}

export function AppHeader({ userRole }: AppHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SidebarTrigger />
          <div className="flex items-center space-x-2">
            <Database className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">QueryPilot</h1>
          </div>
          <Badge variant="secondary" className="text-xs">
            AI SQL Assistant
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">{userRole.name}</span>
          </div>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span className="text-xs">{userRole.permissions.length} permissions</span>
          </Badge>
        </div>
      </div>
    </header>
  )
}
