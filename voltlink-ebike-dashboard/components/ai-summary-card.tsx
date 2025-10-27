"use client"

import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

interface AISummaryCardProps {
  bikeData: {
    modelName: string
    totalMiles: number
    lastMaintenance: string
  }
}

export function AISummaryCard({ bikeData }: AISummaryCardProps) {
  const [summary, setSummary] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateSummary = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/generate-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bikeData),
        })

        const data = await response.json()
        setSummary(data.summary)
      } catch (error) {
        setSummary(
          `Your ${bikeData.modelName} has logged ${bikeData.totalMiles} miles. Keep up the great work! You're due for a checkup soon.`,
        )
      } finally {
        setLoading(false)
      }
    }

    generateSummary()
  }, [bikeData])

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground mb-2">AI Insights</h3>
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
          )}
        </div>
      </div>
    </Card>
  )
}
