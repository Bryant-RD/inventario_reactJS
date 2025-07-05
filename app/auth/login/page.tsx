"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Package, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Mock users database (in a real app, this would be handled by your backend)
  const mockUsers = [
    { id: 1, email: "admin@inventory.com", password: "admin123", name: "Admin User" },
    { id: 2, email: "user@inventory.com", password: "user123", name: "Regular User" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
    setSuccess("")
  }

  const validateForm = () => {
    if (!formData.email) {
      setError("Email is required")
      return false
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address")
      return false
    }
    if (!formData.password) {
      setError("Password is required")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    return true
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user exists in mock database
    const user = mockUsers.find((u) => u.email === formData.email && u.password === formData.password)

    if (user) {
      // Store user session (in a real app, use proper session management)
      localStorage.setItem("user", JSON.stringify(user))
      setSuccess("Login successful! Redirecting...")

      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } else {
      setError("Invalid email or password. Please try again.")
    }

    setIsLoading(false)
  }

  const handleDemoLogin = async () => {
    setFormData({
      email: "admin@inventory.com",
      password: "admin123",
    })

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = mockUsers[0]
    localStorage.setItem("user", JSON.stringify(user))
    setSuccess("Demo login successful! Redirecting...")

    setTimeout(() => {
      router.push("/")
    }, 1500)

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-full">
              <Package className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Manager</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className="cursor-pointer"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Demo Login Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer bg-transparent"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                Try Demo Account
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500 font-medium cursor-pointer">
                  Create one here
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-medium mb-1">Demo Credentials:</p>
              <p className="text-xs text-gray-500">Email: admin@inventory.com</p>
              <p className="text-xs text-gray-500">Password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
