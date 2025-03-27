"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type VerificationResult = {
  fullSummary: string
  shortSummary: string
  biasLevel: string
  biasSide: string
}

interface VerificationResultsProps {
  result: VerificationResult
  onVerifyAnother: () => void
}

export function VerificationResults({ result, onVerifyAnother }: VerificationResultsProps) {
  // Determine badge color based on bias level
  const getBiasLevelColor = (level: string) => {
    const lowerLevel = level.toLowerCase()
    if (lowerLevel.includes("low") || lowerLevel.includes("minimal")) return "green"
    if (lowerLevel.includes("medium") || lowerLevel.includes("moderate")) return "yellow"
    if (lowerLevel.includes("high") || lowerLevel.includes("extreme")) return "red"
    return "blue"
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-base font-thin uppercase tracking-wide">Verification Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 text-sm">
        <div>
          <h3 className="text-xs font-light text-gray-400 mb-1 uppercase tracking-wider">Summary</h3>
          <p className="text-white font-light text-sm">{result.shortSummary}</p>
        </div>

        <div>
          <h3 className="text-xs font-light text-gray-400 mb-1 uppercase tracking-wider">Detailed Analysis</h3>
          <p className="text-white text-xs font-light leading-relaxed">{result.fullSummary}</p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <div>
            <h3 className="text-xs font-light text-gray-400 mb-1 uppercase tracking-wider">Bias Level</h3>
            <Badge
              variant="outline"
              className={`bg-${getBiasLevelColor(result.biasLevel)}-900/20 text-${getBiasLevelColor(result.biasLevel)}-500 border-${getBiasLevelColor(result.biasLevel)}-800/30 text-xs py-0 h-5`}
            >
              {result.biasLevel}
            </Badge>
          </div>

          <div className="ml-4">
            <h3 className="text-xs font-light text-gray-400 mb-1 uppercase tracking-wider">Bias Side</h3>
            <Badge variant="outline" className="bg-blue-900/20 text-blue-500 border-blue-800/30 text-xs py-0 h-5">
              {result.biasSide}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-3 pt-1">
        <Button onClick={onVerifyAnother} className="w-full h-8 text-sm">
          Verify Another Article
        </Button>
      </CardFooter>
    </Card>
  )
}

