import type React from "react"

import { Database } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Database className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">QueryPilot</h1>
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">{title}</h2>
          <p className="text-slate-600">{subtitle}</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8">{children}</div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            © 2024 QueryPilot. AI-powered SQL assistance for your database needs.
          </p>
        </div>
      </div>
    </div>
  )
}
