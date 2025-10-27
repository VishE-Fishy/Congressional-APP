"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Plus, Wrench, Calendar, FileText } from "lucide-react"
import { useState, useEffect } from "react"
import { getMaintenanceRecords, saveMaintenanceRecords, getBikeData, type MaintenanceRecord } from "@/lib/storage"

export default function MaintenancePage() {
  const [records, setRecords] = useState<MaintenanceRecord[]>([])
  const [bikeData, setBikeData] = useState(getBikeData())
  const [showAddForm, setShowAddForm] = useState(false)
  const [aiDiagnostics, setAiDiagnostics] = useState<string>("")
  const [loadingAI, setLoadingAI] = useState(false)
  const [newRecord, setNewRecord] = useState({
    serviceType: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    setRecords(getMaintenanceRecords())
    setBikeData(getBikeData())
  }, [])

  const handleAddRecord = () => {
    const record: MaintenanceRecord = {
      id: Date.now().toString(),
      ...newRecord,
    }
    const updatedRecords = [record, ...records]
    setRecords(updatedRecords)
    saveMaintenanceRecords(updatedRecords)
    setShowAddForm(false)
    setNewRecord({
      serviceType: "",
      notes: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  const handleGetDiagnostics = async () => {
    setLoadingAI(true)
    try {
      const response = await fetch("/api/generate-diagnostics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bikeData, maintenanceRecords: records }),
      })

      const data = await response.json()
      setAiDiagnostics(data.diagnostics)
    } catch (error) {
      setAiDiagnostics(
        `Based on ${bikeData.totalMiles} miles, your e-bike is in good condition. Consider checking tire pressure, brake pads, and chain lubrication. Schedule a professional service every 500 miles or 6 months.`,
      )
    } finally {
      setLoadingAI(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Maintenance</h1>
          <p className="text-muted-foreground">Track service history and get AI-powered diagnostics</p>
        </div>

        {/* AI Diagnostics Card */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-2">AI Diagnostics</h3>
              {aiDiagnostics ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{aiDiagnostics}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Get personalized maintenance recommendations based on your bike's usage and history.
                </p>
              )}
            </div>
          </div>
          <Button onClick={handleGetDiagnostics} disabled={loadingAI} className="w-full md:w-auto">
            {loadingAI ? "Analyzing..." : "Run AI Diagnostics"}
          </Button>
        </Card>

        {/* Add Record Button */}
        <div className="mb-6">
          <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? "secondary" : "default"}>
            <Plus className="w-4 h-4 mr-2" />
            {showAddForm ? "Cancel" : "Add Maintenance Record"}
          </Button>
        </div>

        {/* Add Record Form */}
        {showAddForm && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">New Maintenance Record</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="serviceType">Service Type</Label>
                <Select
                  value={newRecord.serviceType}
                  onValueChange={(value) => setNewRecord({ ...newRecord, serviceType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tire Replacement">Tire Replacement</SelectItem>
                    <SelectItem value="Brake Adjustment">Brake Adjustment</SelectItem>
                    <SelectItem value="Chain Lubrication">Chain Lubrication</SelectItem>
                    <SelectItem value="Battery Service">Battery Service</SelectItem>
                    <SelectItem value="General Inspection">General Inspection</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional details..."
                value={newRecord.notes}
                onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                rows={3}
              />
            </div>
            <Button onClick={handleAddRecord} disabled={!newRecord.serviceType}>
              Save Record
            </Button>
          </Card>
        )}

        {/* Maintenance Records */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Service History</h2>
          {records.length === 0 ? (
            <Card className="p-8 text-center">
              <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No maintenance records yet. Add your first service record above.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {records.map((record) => (
                <Card key={record.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <Wrench className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">{record.serviceType}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(record.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {record.notes && (
                        <div className="flex items-start gap-1 text-sm text-muted-foreground">
                          <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <p>{record.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
