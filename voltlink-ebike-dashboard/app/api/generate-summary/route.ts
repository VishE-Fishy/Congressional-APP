import { generateText } from "ai"
import { type Request, Response } from "next/server"

export async function POST(request: Request) {
  try {
    const bikeData = await request.json()

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are a friendly e-bike assistant. Generate a brief, encouraging summary for the user's e-bike dashboard.

Bike Data:
- Model: ${bikeData.modelName}
- Total Miles: ${bikeData.totalMiles}
- Average Speed: ${bikeData.averageSpeed} mph
- Last Maintenance: ${bikeData.lastMaintenance}

Provide 2-3 sentences that:
1. Acknowledge their riding achievements
2. Mention any maintenance considerations
3. Encourage continued riding

Be friendly, concise, and motivating.`,
    })

    return Response.json({ summary: text })
  } catch (error) {
    console.error("[v0] Error generating summary:", error)
    return Response.json(
      {
        summary: `Your e-bike has logged some miles. Keep up the great work! You're due for a checkup soon.`,
      },
      { status: 500 },
    )
  }
}
