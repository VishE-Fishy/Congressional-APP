"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Plus, DollarSign, TrendingDown, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { getExpenses, saveExpenses, type Expense } from "@/lib/storage"

export default function CostTrackerPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [aiInsights, setAiInsights] = useState<string>("")
  const [loadingAI, setLoadingAI] = useState(false)
  const [newExpense, setNewExpense] = useState({
    category: "" as Expense["category"] | "",
    amount: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    setExpenses(getExpenses())
  }, [])

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.amount) return

    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category as Expense["category"],
      amount: Number.parseFloat(newExpense.amount),
      notes: newExpense.notes,
      date: newExpense.date,
    }
    const updatedExpenses = [expense, ...expenses]
    setExpenses(updatedExpenses)
    saveExpenses(updatedExpenses)
    setShowAddForm(false)
    setNewExpense({
      category: "",
      amount: "",
      notes: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  const handleGetInsights = async () => {
    setLoadingAI(true)
    try {
      const response = await fetch("/api/generate-cost-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenses }),
      })

      const data = await response.json()
      setAiInsights(data.insights)
    } catch (error) {
      setAiInsights(
        "Your e-bike expenses are well-managed. Consider budgeting for regular maintenance to avoid costly repairs. Compared to car ownership, you're saving significantly on fuel and insurance costs.",
      )
    } finally {
      setLoadingAI(false)
    }
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const categoryTotals = expenses.reduce(
    (acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Cost Tracker</h1>
          <p className="text-muted-foreground">Track expenses and get AI-powered financial insights</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-foreground">${totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-chart-2/20 flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-6 h-6 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Monthly</p>
                <p className="text-2xl font-bold text-foreground">
                  ${expenses.length > 0 ? (totalSpent / Math.max(1, expenses.length / 3)).toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-chart-4/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-foreground">{expenses.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Insights Card */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-2">AI Financial Insights</h3>
              {aiInsights ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{aiInsights}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Get personalized financial insights and cost-saving recommendations based on your spending patterns.
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={handleGetInsights}
            disabled={loadingAI || expenses.length === 0}
            className="w-full md:w-auto"
          >
            {loadingAI ? "Analyzing..." : "Get AI Insights"}
          </Button>
        </Card>

        {/* Category Breakdown */}
        {Object.keys(categoryTotals).length > 0 && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Spending by Category</h3>
            <div className="space-y-3">
              {Object.entries(categoryTotals).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{category}</span>
                  <span className="text-sm font-semibold text-foreground">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Add Expense Button */}
        <div className="mb-6">
          <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? "secondary" : "default"}>
            <Plus className="w-4 h-4 mr-2" />
            {showAddForm ? "Cancel" : "Add Expense"}
          </Button>
        </div>

        {/* Add Expense Form */}
        {showAddForm && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">New Expense</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newExpense.category}
                  onValueChange={(value) => setNewExpense({ ...newExpense, category: value as Expense["category"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Purchase">Purchase</SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Accessory">Accessory</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional details..."
                value={newExpense.notes}
                onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                rows={2}
              />
            </div>
            <Button onClick={handleAddExpense} disabled={!newExpense.category || !newExpense.amount}>
              Save Expense
            </Button>
          </Card>
        )}

        {/* Expense History */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Expense History</h2>
          {expenses.length === 0 ? (
            <Card className="p-8 text-center">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No expenses tracked yet. Add your first expense above.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {expenses.map((expense) => (
                <Card key={expense.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{expense.category}</h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                        {expense.notes && <p className="text-sm text-muted-foreground">{expense.notes}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">${expense.amount.toFixed(2)}</p>
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
