import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, ChevronDown, LogOut } from "lucide-react"

interface UserRole {
  name: string
  permissions: string[] // Still present in interface but not displayed
  department: string
  lastLogin: Date // Still present in interface but not displayed
}

interface UserProfileDropdownProps {
  userRole: UserRole
}

export function UserProfileDropdown({ userRole }: UserProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <User className="h-4 w-4 mr-2" />
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">{userRole.name}</div>
            <div className="text-xs text-slate-500">{userRole.department}</div>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>User Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-2 text-sm text-gray-200">
          <div className="font-medium">{userRole.name}</div>
          <div className="text-xs text-slate-500">{userRole.department}</div>
          <div className="mt-2 text-xs text-slate-600">
            <div className="font-medium text-slate-700">Location:</div>
            <div>New York, USA</div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 hover:text-red-700">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
