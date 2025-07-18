"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { AuthLayout } from "../../components/auth-layout"
import { PasswordInput } from "../../components/password-input"
import { AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "../../lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(formData.username, formData.password)
      router.push("/")
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid username or password.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your QueryPilot account to continue your SQL journey">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-sm font-medium text-slate-700">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="mt-1"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </Label>
            <div className="mt-1">
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(value) => handleInputChange("password", value)}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5"
          disabled={isLoading || !formData.username || !formData.password}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="space-y-4 text-center">
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
            Forgot your password?
          </Link>

          <div className="text-sm text-slate-600">
            {"Don't have an account? "}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
              Register here
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}
