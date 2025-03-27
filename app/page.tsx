"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { VerifyForm } from "@/components/verify-form"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  // This ensures we only render on the client to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // For debugging
  useEffect(() => {
    if (mounted) {
      console.log("Home page rendered with user:", user)
    }
  }, [mounted, user])

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="p-3 border-b border-gray-800 flex justify-between items-center">
        <Link href="/" className="text-base font-extralight tracking-wider uppercase">
          Althea.io
        </Link>
        <UserNav />
      </header>

      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extralight tracking-wider uppercase mb-1">Verify News Articles</h1>
          <p className="text-sm md:text-base text-gray-400 font-light">
            AI-powered fact checking to ensure accuracy and identify bias
          </p>
        </div>

        <main className="w-full max-w-md">
          <VerifyForm />
        </main>

        <footer className="mt-8 text-center text-gray-500 text-xs">
          <p className="mb-1 font-light">Verify news articles with confidence</p>
          <Link
            href="/dashboard"
            className="text-blue-400 hover:text-blue-300 underline text-sm flex items-center justify-center"
          >
            View your verification history
            <Badge
              variant="outline"
              className="ml-2 text-[10px] h-4 px-1 py-0 bg-blue-900/20 text-blue-400 border-blue-800/30"
            >
              Coming Soon
            </Badge>
          </Link>
        </footer>
      </div>
    </div>
  )
}

