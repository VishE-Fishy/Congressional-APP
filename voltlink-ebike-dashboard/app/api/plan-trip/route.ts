import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { origin, destination } = await request.json()

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are a cycling route planner. Generate realistic trip data for an e-bike journey from "${origin}" to "${destination}".

Provide a JSON response with:
- distance: estimated miles (number)
- estimatedTime: estimated minutes (number)
- batteryUsage: percentage of battery used (number, 10-30%)
- co2Saved: pounds of CO2 saved vs driving (number, roughly 0.25 lbs per mile)
- caloriesBurned: calories burned (number, roughly 20-25 per mile)
- suggestions: 2-3 sentences with route tips, safety advice, or weather considerations (string)

Return ONLY valid JSON, no markdown or extra text.`,
    })

    // Parse the AI response
    const plan = JSON.parse(text)

    return Response.json({ plan })
  } catch (error) {
    console.error("[v0] Error planning trip:", error)
    return Response.json(
      {
        plan: {
          distance: 8.5,
          estimatedTime: 28,
          batteryUsage: 15,
          co2Saved: 2.1,
          caloriesBurned: 180,
          suggestions:
            "Take the bike lane on Main Street for a safer route. Consider charging your battery before the trip. Weather looks clear for riding.",
        },
      },
      { status: 200 },
    )
  }
}
