"use client"

import { Navigation } from "@/components/navigation"
import { AISummaryCard } from "@/components/ai-summary-card"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gauge, Calendar, Zap, Edit } from "lucide-react"
import { useState, useEffect } from "react"
import { getBikeData, saveBikeData, type BikeData } from "@/lib/storage"

export default function HomePage() {
  const [bikeData, setBikeData] = useState<BikeData>({
    modelName: "VoltLink 350R",
    totalMiles: 142,
    averageSpeed: 18.5,
    lastMaintenance: new Date().toISOString().split("T")[0],
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(bikeData)

  useEffect(() => {
    const data = getBikeData()
    setBikeData(data)
    setEditData(data)
  }, [])

  const handleSave = () => {
    saveBikeData(editData)
    setBikeData(editData)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{bikeData.modelName}</h1>
              <p className="text-muted-foreground">Your Smart E-Bike Control Center</p>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>
        </div>

        {/* E-Bike Visual */}
        <Card className="mb-8 overflow-hidden">
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-secondary to-card flex items-center justify-center">
            <img src="/modern-electric-bike-side-view-technical.jpg" alt="E-Bike" className="w-full h-full object-contain" />
            <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-xs text-primary-foreground/80 mb-1">Odometer</p>
              <p className="text-2xl font-bold text-primary-foreground">{bikeData.totalMiles} mi</p>
            </div>
          </div>
        </Card>

        {/* Edit Form */}
        {isEditing && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Edit Bike Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="modelName">Model Name</Label>
                <Input
                  id="modelName"
                  value={editData.modelName}
                  onChange={(e) => setEditData({ ...editData, modelName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="totalMiles">Total Miles</Label>
                <Input
                  id="totalMiles"
                  type="number"
                  value={editData.totalMiles}
                  onChange={(e) => setEditData({ ...editData, totalMiles: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="averageSpeed">Average Speed (mph)</Label>
                <Input
                  id="averageSpeed"
                  type="number"
                  step="0.1"
                  value={editData.averageSpeed}
                  onChange={(e) => setEditData({ ...editData, averageSpeed: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="lastMaintenance">Last Maintenance</Label>
                <Input
                  id="lastMaintenance"
                  type="date"
                  value={editData.lastMaintenance}
                  onChange={(e) => setEditData({ ...editData, lastMaintenance: e.target.value })}
                />
              </div>
            </div>
          </Card>
        )}

        {/* AI Summary */}
        <div className="mb-8">
          <AISummaryCard bikeData={bikeData} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Miles" value={bikeData.totalMiles} icon={Gauge} subtitle="Lifetime distance" />
          <StatCard
            title="Average Speed"
            value={`${bikeData.averageSpeed} mph`}
            icon={Zap}
            subtitle="Typical riding speed"
          />
          <StatCard
            title="Last Maintenance"
            value={new Date(bikeData.lastMaintenance).toLocaleDateString()}
            icon={Calendar}
            subtitle="Service date"
          />
        </div>
      </main>
    </div>
  )
}
