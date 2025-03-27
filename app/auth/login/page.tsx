"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, KeyRound, ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [resetEmail, setResetEmail] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setIsLoading(true)

    try {
      // Send login credentials to webhook
      const response = await fetch("https://hook.eu2.make.com/t1axdo62grrjmr7ygg72wjew9vudsjpc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error("Login request failed")
      }

      // Parse the response
      const data = await response.json()

      // Check the status from the response
      if (data.Status === "Yes") {
        // Store user info in localStorage (in a real app, use a more secure method)
        localStorage.setItem("althea_user", JSON.stringify({ email }))

        // Update auth context
        setUser({ email })

        // Redirect to home page
        router.push("/")
      } else {
        // Show incorrect password error
        setError("Incorrect email or password")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred during sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!resetEmail) {
      setError("Please enter your email address")
      return
    }

    if (!newPassword) {
      setError("Please enter a new password")
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match")
      return
    }

    setIsResetting(true)

    try {
      // Send reset password request to webhook
      const response = await fetch("https://hook.eu2.make.com/18rtqosgpogm2xtvy4esn3g4mebp3f4q", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resetEmail,
          newPassword: newPassword,
        }),
      })

      if (!response.ok) {
        throw new Error("Password reset request failed")
      }

      // Show success message
      setResetSuccess(true)
      setNewPassword("")
      setConfirmNewPassword("")

      // After 3 seconds, go back to login
      setTimeout(() => {
        setShowResetPassword(false)
        setResetSuccess(false)
      }, 3000)
    } catch (err) {
      console.error("Password reset error:", err)
      setError("An error occurred while resetting your password. Please try again.")
    } finally {
      setIsResetting(false)
    }
  }

  const handleForgotPassword = () => {
    setShowResetPassword(true)
    setResetEmail(email) // Pre-fill with current email if available
  }

  const handleBackToLogin = () => {
    setShowResetPassword(false)
    setError("")
    setNewPassword("")
    setConfirmNewPassword("")
    setResetSuccess(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extralight tracking-wider uppercase text-white">Althea.io</h1>
          <p className="text-xs text-gray-400 mt-1">AI-powered news fact checker</p>
        </div>

        {!showResetPassword ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-base font-thin uppercase tracking-wide">Sign In</CardTitle>
              <CardDescription className="text-xs">Enter your credentials to access your account</CardDescription>
            </CardHeader>

            <CardContent className="px-4 pt-2">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-light text-gray-400 uppercase tracking-wider">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-gray-800 border-gray-700 text-sm h-9"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-light text-gray-400 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-800 border-gray-700 text-sm h-9"
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <Button type="submit" className="w-full h-9 text-sm" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="px-4 py-3 flex justify-center">
              <p className="text-xs text-gray-400">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="text-blue-400 hover:text-blue-300">
                  Create one
                </Link>
              </p>
            </CardFooter>
          </Card>
        ) : (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2 pt-3 px-4">
              <div className="flex items-center mb-2">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 mr-2" onClick={handleBackToLogin}>
                  <ArrowLeft className="h-3 w-3" />
                </Button>
                <CardTitle className="text-base font-thin uppercase tracking-wide">Reset Password</CardTitle>
              </div>
              <CardDescription className="text-xs">Enter your email and new password</CardDescription>
            </CardHeader>

            <CardContent className="px-4 pt-2">
              {resetSuccess ? (
                <div className="py-6 text-center">
                  <KeyRound className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-500 text-sm font-medium">Password reset successful!</p>
                  <p className="text-xs text-gray-400 mt-1">You can now sign in with your new password.</p>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="reset-email" className="text-xs font-light text-gray-400 uppercase tracking-wider">
                      Email
                    </label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="bg-gray-800 border-gray-700 text-sm h-9"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="new-password" className="text-xs font-light text-gray-400 uppercase tracking-wider">
                      New Password
                    </label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-gray-800 border-gray-700 text-sm h-9"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="confirm-new-password"
                      className="text-xs font-light text-gray-400 uppercase tracking-wider"
                    >
                      Confirm New Password
                    </label>
                    <Input
                      id="confirm-new-password"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-gray-800 border-gray-700 text-sm h-9"
                      required
                    />
                  </div>

                  {error && <p className="text-red-500 text-xs">{error}</p>}

                  <Button type="submit" className="w-full h-9 text-sm" disabled={isResetting}>
                    {isResetting ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

