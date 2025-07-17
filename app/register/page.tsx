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
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { auth } from "../../lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "", // Added for backend integration
    full_name: "", // Added for backend integration
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [confirmationRequired, setConfirmationRequired] = useState(false)

  const validateForm = () => {
    if (formData.username.length < 3) {
      return "Username must be at least 3 characters long"
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long"
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      const response = await auth.register({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        full_name: formData.full_name,
      })

      // Handle AWS Cognito case where confirmation is required
      if (response.confirmation_required) {
        setConfirmationRequired(true)
        setSuccess(true)
      } else {
        setSuccess(true)
        // Redirect to login after success
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred during registration. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "" }
    if (password.length < 6) return { strength: 1, label: "Weak" }
    if (password.length < 10) return { strength: 2, label: "Medium" }
    return { strength: 3, label: "Strong" }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  if (success) {
    return (
      <AuthLayout 
        title={confirmationRequired ? "Check Your Email" : "Registration Successful!"} 
        subtitle={confirmationRequired ? "Please check your email for verification instructions" : "Your account has been created successfully"}
      >
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <p className="text-slate-600">
            {confirmationRequired 
              ? "We've sent you an email with a confirmation code. Please verify your account to continue."
              : "Welcome to QueryPilot! You will be redirected to the login page shortly."}
          </p>
          <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline">
            Go to Login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Create Account" subtitle="Join QueryPilot and start your AI-powered SQL journey">
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
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="mt-1"
              required
              disabled={isLoading}
            />
            {formData.username && formData.username.length < 3 && (
              <p className="text-xs text-amber-600 mt-1">Username must be at least 3 characters</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="mt-1"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="full_name" className="text-sm font-medium text-slate-700">
              Full Name
            </Label>
            <Input
              id="full_name"
              type="text"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              className="mt-1"
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
                placeholder="Create a password"
                value={formData.password}
                onChange={(value) => handleInputChange("password", value)}
              />
            </div>
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        passwordStrength.strength === 1
                          ? "bg-red-500 w-1/3"
                          : passwordStrength.strength === 2
                            ? "bg-amber-500 w-2/3"
                            : passwordStrength.strength === 3
                              ? "bg-green-500 w-full"
                              : "w-0"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-slate-600">{passwordStrength.label}</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
              Confirm Password
            </Label>
            <div className="mt-1">
              <PasswordInput
                id="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(value) => handleInputChange("confirmPassword", value)}
              />
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5"
          disabled={isLoading || !formData.username || !formData.password || !formData.confirmPassword}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <div className="text-center">
          <div className="text-sm text-slate-600">
            {"Already have an account? "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
              Log in here
            </Link>
          </div>
        </div>

        {/* Terms and Privacy */}
        <div className="text-xs text-slate-500 text-center">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
