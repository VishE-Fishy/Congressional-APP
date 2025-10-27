export interface BikeData {
  modelName: string
  totalMiles: number
  averageSpeed: number
  lastMaintenance: string
}

export interface MaintenanceRecord {
  id: string
  date: string
  serviceType: string
  notes: string
}

export interface Expense {
  id: string
  date: string
  category: "Purchase" | "Repair" | "Accessory" | "Maintenance"
  amount: number
  notes: string
}

export const getBikeData = (): BikeData => {
  if (typeof window === "undefined") {
    return {
      modelName: "VoltLink 350R",
      totalMiles: 142,
      averageSpeed: 18.5,
      lastMaintenance: new Date().toISOString().split("T")[0],
    }
  }

  const stored = localStorage.getItem("voltlink-bike-data")
  if (stored) {
    return JSON.parse(stored)
  }

  const defaultData: BikeData = {
    modelName: "VoltLink 350R",
    totalMiles: 142,
    averageSpeed: 18.5,
    lastMaintenance: new Date().toISOString().split("T")[0],
  }

  localStorage.setItem("voltlink-bike-data", JSON.stringify(defaultData))
  return defaultData
}

export const saveBikeData = (data: BikeData) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("voltlink-bike-data", JSON.stringify(data))
  }
}

export const getMaintenanceRecords = (): MaintenanceRecord[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("voltlink-maintenance")
  return stored ? JSON.parse(stored) : []
}

export const saveMaintenanceRecords = (records: MaintenanceRecord[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("voltlink-maintenance", JSON.stringify(records))
  }
}

export const getExpenses = (): Expense[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("voltlink-expenses")
  return stored ? JSON.parse(stored) : []
}

export const saveExpenses = (expenses: Expense[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("voltlink-expenses", JSON.stringify(expenses))
  }
}
