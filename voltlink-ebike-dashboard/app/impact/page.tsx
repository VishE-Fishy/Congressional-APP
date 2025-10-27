"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Leaf, Droplets, TreePine, Heart, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { getBikeData } from "@/lib/storage"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ImpactPage() {
  const [bikeData, setBikeData] = useState(getBikeData())

  useEffect(() => {
    setBikeData(getBikeData())
  }, [])

  // Calculate environmental impact
  const totalMiles = bikeData.totalMiles
  const co2Saved = (totalMiles * 0.89).toFixed(1) // ~0.89 lbs CO2 per mile vs car
  const gasSaved = (totalMiles / 25).toFixed(1) // Assuming 25 mpg for average car
  const treeEquivalent = (Number.parseFloat(co2Saved) / 48).toFixed(1) // ~48 lbs CO2 per tree per year
  const caloriesBurned = (totalMiles * 22).toFixed(0) // ~22 calories per mile

  // Monthly comparison data
  const monthlyData = [
    { month: "Jan", ebike: 12, car: 45 },
    { month: "Feb", ebike: 15, car: 48 },
    { month: "Mar", ebike: 18, car: 52 },
    { month: "Apr", ebike: 22, car: 55 },
    { month: "May", ebike: 28, car: 58 },
    { month: "Jun", ebike: 32, car: 60 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Environmental Impact</h1>
          <p className="text-muted-foreground">See the positive difference you're making</p>
        </div>

        {/* Hero Impact Card */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-chart-4/20 to-chart-4/5 border-chart-4/30">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-chart-4/20 flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-10 h-10 text-chart-4" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">You're Making a Difference!</h2>
            <p className="text-muted-foreground text-lg">
              By riding {totalMiles} miles, you've made a significant positive impact on the environment
            </p>
          </div>
        </Card>

        {/* Impact Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-chart-4/20 flex items-center justify-center mb-4">
                <Leaf className="w-8 h-8 text-chart-4" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">CO₂ Emissions Saved</p>
              <p className="text-3xl font-bold text-chart-4 mb-1">{co2Saved}</p>
              <p className="text-xs text-muted-foreground">pounds</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-chart-1/20 flex items-center justify-center mb-4">
                <Droplets className="w-8 h-8 text-chart-1" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Gasoline Saved</p>
              <p className="text-3xl font-bold text-chart-1 mb-1">{gasSaved}</p>
              <p className="text-xs text-muted-foreground">gallons</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-chart-2/20 flex items-center justify-center mb-4">
                <TreePine className="w-8 h-8 text-chart-2" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Tree Equivalent</p>
              <p className="text-3xl font-bold text-chart-2 mb-1">{treeEquivalent}</p>
              <p className="text-xs text-muted-foreground">trees planted</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-chart-5/20 flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-chart-5" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Calories Burned</p>
              <p className="text-3xl font-bold text-chart-5 mb-1">{caloriesBurned}</p>
              <p className="text-xs text-muted-foreground">total</p>
            </div>
          </Card>
        </div>

        {/* Comparison Chart */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">E-Bike vs Car: CO₂ Emissions</h3>
          </div>
          <ChartContainer
            config={{
              ebike: {
                label: "E-Bike",
                color: "hsl(var(--chart-4))",
              },
              car: {
                label: "Car",
                color: "hsl(var(--chart-5))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="ebike" fill="var(--color-ebike)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="car" fill="var(--color-car)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-chart-4" />
              <span className="text-sm text-muted-foreground">E-Bike (lbs CO₂)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-chart-5" />
              <span className="text-sm text-muted-foreground">Car (lbs CO₂)</span>
            </div>
          </div>
        </Card>

        {/* Impact Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Environmental Contribution</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-chart-4 mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You've prevented {co2Saved} lbs of CO₂ from entering the atmosphere - equivalent to planting{" "}
                  {treeEquivalent} trees
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-chart-1 mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  By not driving, you've saved {gasSaved} gallons of gasoline and reduced air pollution in your
                  community
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-chart-5 mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You've burned {caloriesBurned} calories while commuting, improving your health and fitness
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Keep Up the Great Work!</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every mile you ride makes a difference. Your choice to use an e-bike helps combat climate change
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Share your impact with friends and inspire others to choose sustainable transportation
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Continue tracking your rides to see your positive environmental impact grow over time
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
