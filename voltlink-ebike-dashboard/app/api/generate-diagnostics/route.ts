import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { bikeData, maintenanceRecords } = await request.json()

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are an expert e-bike mechanic. Based on the following bike data and maintenance history, provide a brief diagnostic summary with maintenance recommendations.

Bike Data:
- Model: ${bikeData.modelName}
- Total Miles: ${bikeData.totalMiles}
- Last Maintenance: ${bikeData.lastMaintenance}

Recent Maintenance Records: ${
        maintenanceRecords.length > 0
          ? maintenanceRecords
              .slice(0, 3)
              .map((r: any) => `${r.serviceType} on ${r.date}`)
              .join(", ")
          : "No records"
      }

Provide a 2-3 sentence diagnostic summary with specific maintenance recommendations. Be concise and actionable.`,
    })

    return Response.json({ diagnostics: text })
  } catch (error) {
    console.error("[v0] Error generating diagnostics:", error)
    return Response.json(
      { diagnostics: "Unable to generate diagnostics at this time. Please try again later." },
      { status: 500 },
    )
  }
}
