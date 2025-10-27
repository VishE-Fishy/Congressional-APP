import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { expenses } = await request.json()

    if (!expenses || expenses.length === 0) {
      return Response.json({
        insights:
          "Start tracking your expenses to get personalized financial insights and cost-saving recommendations.",
      })
    }

    const totalSpent = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0)
    const categoryBreakdown = expenses.reduce((acc: any, exp: any) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    }, {})

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are a financial advisor specializing in e-bike ownership costs. Analyze the following expense data and provide insights.

Total Spent: $${totalSpent.toFixed(2)}
Number of Expenses: ${expenses.length}
Category Breakdown: ${JSON.stringify(categoryBreakdown)}

Recent Expenses: ${expenses
        .slice(0, 5)
        .map((e: any) => `${e.category}: $${e.amount} on ${e.date}`)
        .join(", ")}

Provide 2-3 sentences with:
1. An assessment of their spending patterns
2. Specific cost-saving recommendations
3. Comparison to typical car ownership costs if relevant

Be concise, actionable, and encouraging.`,
    })

    return Response.json({ insights: text })
  } catch (error) {
    console.error("[v0] Error generating cost insights:", error)
    return Response.json(
      {
        insights:
          "Your e-bike expenses are well-managed. Consider budgeting for regular maintenance to avoid costly repairs.",
      },
      { status: 500 },
    )
  }
}
