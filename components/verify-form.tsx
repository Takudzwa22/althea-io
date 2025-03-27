"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { VerificationResults } from "@/components/verification-results"
import { useAuth } from "@/components/auth-provider"

// URL validation schema
const urlSchema = z.string().url("Please enter a valid URL")

// Result type definition
type VerificationResult = {
  fullSummary: string
  shortSummary: string
  biasLevel: string
  biasSide: string
}

export function VerifyForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [rawResponse, setRawResponse] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setRawResponse(null)

    // Validate URL
    try {
      urlSchema.parse(url)
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      } else {
        setError("Please enter a valid URL")
      }
      return
    }

    setIsLoading(true)

    try {
      // Send URL to webhook for analysis
      const response = await fetch("https://hook.eu2.make.com/xibh8ganqrijk4yc7plji8j6b5qm53ef", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      let data

      // Get the raw text response
      const rawText = await response.text()

      // Store the raw response for debugging in console
      setRawResponse(rawText)

      // Log the raw response for debugging
      console.log("Raw response:", rawText)

      if (!response.ok) {
        console.error("Webhook response error:", response.status, response.statusText)

        // For demo purposes: Use mock data when the webhook fails
        data = {
          fullSummary:
            "This is a mock full summary since the webhook is currently unavailable. In a real application, this would contain a detailed analysis of the article's content, sources, and factual accuracy.",
          shortSummary: "Mock summary: This article appears to be mostly factual with some minor bias in presentation.",
          biasLevel: "Medium",
          biasSide: "Slightly Left-leaning",
        }

        console.log("Using mock data due to webhook failure")
      } else {
        try {
          // Remove control characters to clean the raw text
          const sanitizedText = rawText.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")

          let parsedData: any
          try {
            parsedData = JSON.parse(sanitizedText)
          } catch (innerJsonError) {
            console.error("JSON parsing error after sanitization:", innerJsonError)
            parsedData = {}
          }

          // Normalize keys (case-insensitive + trim + safe fallback)
          const normalizeKey = (key: string) => key.toLowerCase().replace(/\s+/g, "")

          const keysMap = Object.fromEntries(
            Object.entries(parsedData || {}).map(([key, value]) => [normalizeKey(key), value]),
          )

          data = {
            fullSummary: keysMap["fullsummary"] || "Unable to parse full summary.",
            shortSummary: keysMap["shortsummary"] || "Unable to parse short summary.",
            biasLevel: keysMap["biaslevel"] || "Unknown",
            biasSide: keysMap["biasside"] || "Unknown",
          }
        } catch (textError) {
          console.error("Error processing response text:", textError)
          throw new Error("Failed to process the response from the verification service")
        }
      }

      // Extract required fields from response
      const result: VerificationResult = {
        fullSummary: data.fullSummary || "No full summary available",
        shortSummary: data.shortSummary || "No short summary available",
        biasLevel: data.biasLevel || "Unknown",
        biasSide: data.biasSide || "Unknown",
      }

      setResult(result)

      // Send verification data to Airtable webhook
      try {
        const verifiedAt = new Date().toISOString()
        const airtableResponse = await fetch("https://hook.eu2.make.com/xoivmt39wxvo1a3gffsg834zskrygvab", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user?.email || "anonymous@user.com", // Use anonymous if not logged in
            url: url,
            shortSummary: result.shortSummary,
            fullSummary: result.fullSummary,
            biasSide: result.biasSide,
            biasLevel: result.biasLevel,
            verified_at: verifiedAt,
          }),
        })

        if (!airtableResponse.ok) {
          console.error("Failed to save verification to database:", airtableResponse.status)
        } else {
          console.log("Verification saved to database successfully")
        }
      } catch (airtableError) {
        console.error("Error saving to database:", airtableError)
        // Don't throw here - we still want to show results even if saving fails
      }
    } catch (err) {
      console.error("Verification error:", err)
      setError("An error occurred while verifying the URL. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setUrl("")
    setResult(null)
    setError("")
    setRawResponse(null)
  }

  return (
    <div>
      {!result ? (
        <Card className="p-4 bg-gray-900 border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-base font-thin uppercase tracking-wide">Verify a news article</h2>
              <p className="text-gray-400 text-xs font-light">
                Enter the URL of a news article to check its accuracy and bias
              </p>
            </div>

            <div className="space-y-1">
              <Input
                type="url"
                placeholder="https://example.com/news-article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-gray-800 border-gray-700 text-sm h-9"
                disabled={isLoading}
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>

            <Button type="submit" className="w-full h-9 text-sm" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Card>
      ) : (
        <VerificationResults result={result} onVerifyAnother={handleReset} />
      )}
    </div>
  )
}

