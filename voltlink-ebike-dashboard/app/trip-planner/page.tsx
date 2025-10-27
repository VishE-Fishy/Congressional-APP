"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, MapPin, NavigationIcon, Battery, Clock, Leaf } from "lucide-react"
import { useState } from "react"

interface TripPlan {
  distance: number
  estimatedTime: number
  batteryUsage: number
  co2Saved: number
  caloriesBurned: number
  suggestions: string
}

export default function TripPlannerPage() {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePlanTrip = async () => {
    if (!origin || !destination) return

    setLoading(true)
    try {
      const response = await fetch("/api/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination }),
      })

      const data = await response.json()
      setTripPlan(data.plan)
    } catch (error) {
      // Fallback data
      setTripPlan({
        distance: 8.5,
        estimatedTime: 28,
        batteryUsage: 15,
        co2Saved: 2.1,
        caloriesBurned: 180,
        suggestions:
          "Take the bike lane on Main Street for a safer route. Consider charging your battery before the trip. Weather looks clear for riding.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Eco Trip Planner</h1>
          <p className="text-muted-foreground">Plan your route and see your environmental impact</p>
        </div>

        {/* Trip Planning Form */}
        <Card className="p-6 mb-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="origin">Starting Point</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="origin"
                  placeholder="Enter your starting location"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="destination">Destination</Label>
              <div className="relative">
                <NavigationIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="destination"
                  placeholder="Enter your destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button onClick={handlePlanTrip} disabled={!origin || !destination || loading} className="w-full">
              {loading ? "Planning Route..." : "Plan My Trip"}
            </Button>
          </div>
        </Card>

        {/* Trip Results */}
        {tripPlan && (
          <>
            {/* AI Suggestions */}
            <Card className="p-6 mb-8 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground mb-2">AI Route Suggestions</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tripPlan.suggestions}</p>
                </div>
              </div>
            </Card>

            {/* Trip Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <NavigationIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Distance</p>
                    <p className="text-2xl font-bold text-foreground">{tripPlan.distance} mi</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Est. Time</p>
                    <p className="text-2xl font-bold text-foreground">{tripPlan.estimatedTime} min</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Battery className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Battery Usage</p>
                    <p className="text-2xl font-bold text-foreground">{tripPlan.batteryUsage}%</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Environmental Impact */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Environmental Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-chart-4/20 flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-8 h-8 text-chart-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">CO₂ Saved vs. Car</p>
                    <p className="text-3xl font-bold text-chart-4">{tripPlan.co2Saved} lbs</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-chart-2/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-8 h-8 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Calories Burned</p>
                    <p className="text-3xl font-bold text-chart-2">{tripPlan.caloriesBurned} cal</p>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
