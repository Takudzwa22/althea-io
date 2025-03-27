"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import Link from "next/link"

export function UserNav() {
  const { user, signOut, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  // This ensures we only render on the client to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // For debugging
  useEffect(() => {
    if (mounted) {
      console.log("UserNav rendered with user:", user)
    }
  }, [mounted, user])

  // Don't render anything until client-side
  if (!mounted) {
    return <div className="h-8"></div>
  }

  // Don't render anything while loading to prevent flash of incorrect UI
  if (isLoading) {
    return <div className="h-8"></div>
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Link href="/auth/login">
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            Sign In
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button size="sm" className="h-8 text-xs">
            Create Account
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <User className="h-3 w-3" />
        <span>{user.email}</span>
      </div>
      <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={signOut}>
        <LogOut className="h-3 w-3 mr-1" />
        Sign Out
      </Button>
    </div>
  )
}

