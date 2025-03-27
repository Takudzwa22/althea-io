"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      // Send registration data to webhook
      const response = await fetch("https://hook.eu2.make.com/dig7jkdv31an8sepuqlgsus2s304euor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          date: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      // Create user object
      const userObj = { email }

      // Store user info in localStorage
      localStorage.setItem("althea_user", JSON.stringify(userObj))

      // Update auth context
      setUser(userObj)

      // Redirect to home page
      router.push("/")
    } catch (err) {
      console.error("Registration error:", err)
      setError("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extralight tracking-wider uppercase text-white">Althea.io</h1>
          <p className="text-xs text-gray-400 mt-1">AI-powered news fact checker</p>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-base font-thin uppercase tracking-wide">Create Account</CardTitle>
            <CardDescription className="text-xs">Register to start verifying news articles</CardDescription>
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
                <label htmlFor="password" className="text-xs font-light text-gray-400 uppercase tracking-wider">
                  Password
                </label>
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

              <div className="space-y-1">
                <label htmlFor="confirm-password" className="text-xs font-light text-gray-400 uppercase tracking-wider">
                  Confirm Password
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="px-4 py-3 flex justify-center">
            <p className="text-xs text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

