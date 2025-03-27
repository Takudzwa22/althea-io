"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Construction } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/components/auth-provider"

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="p-3 border-b border-gray-800 flex justify-between items-center">
        <Link href="/" className="text-base font-extralight tracking-wider uppercase">
          Althea.io
        </Link>
        <UserNav />
      </header>

      <div className="p-3 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-3 h-8 text-xs">
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-xl md:text-2xl font-extralight uppercase tracking-wide">Verification History</h1>
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-base font-thin uppercase tracking-wide">Coming Soon</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-12">
              <div className="text-center">
                <Construction className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h2 className="text-xl font-extralight mb-2">Verification History</h2>
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  We're currently building this feature. Soon you'll be able to view your past verifications and track
                  your fact-checking activity.
                </p>
                <Link href="/">
                  <Button className="mt-6 h-9 text-sm">Return to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

