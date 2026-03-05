import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

/** A single recommended action for one asset */
export interface PortfolioAction {
  asset: string
  action: 'buy' | 'sell' | 'hold'
  currentPercent: number
  targetPercent: number
  dollarAmount: number
  reason: string
}

/** Full AI analysis result returned by Gemini */
export interface AIAnalysis {
  shouldRebalance: boolean
  reason: string
  confidence: number
  riskLevel: 'low' | 'medium' | 'high'
  marketSentiment: string
  actions: PortfolioAction[]
}

const MOCK_ANALYSIS: AIAnalysis = {
  shouldRebalance: true,
  reason: 'ETH allocation has drifted above target. Recommend rebalancing to restore optimal risk-adjusted exposure.',
  confidence: 75,
  riskLevel: 'medium',
  marketSentiment: 'neutral',
  actions: [
    { asset: 'ETH',  action: 'sell', currentPercent: 55, targetPercent: 50, dollarAmount: 500, reason: 'Overweight vs target' },
    { asset: 'USDC', action: 'buy',  currentPercent: 15, targetPercent: 20, dollarAmount: 500, reason: 'Underweight vs target' },
    { asset: 'BTC',  action: 'hold', currentPercent: 30, targetPercent: 30, dollarAmount: 0,   reason: 'On target' },
  ],
}

/**
 * Sends current portfolio data to Gemini AI and returns a structured
 * rebalancing analysis. Falls back to mock data if the API call fails.
 */
export async function analyzePortfolio(
  currentAllocations: Record<string, number>,
  prices: Record<string, { price: number; change24h: number }>,
  totalValue: number
): Promise<AIAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
You are an autonomous DeFi portfolio manager AI. Analyze the following portfolio and return a rebalancing recommendation.

PORTFOLIO DATA:
- Total Value: $${totalValue.toFixed(2)}
- Current Allocations vs Targets:
  * ETH:  ${(currentAllocations.ETH  ?? 0).toFixed(1)}% (target: 50%)
  * BTC:  ${(currentAllocations.BTC  ?? 0).toFixed(1)}% (target: 30%)
  * USDC: ${(currentAllocations.USDC ?? 0).toFixed(1)}% (target: 20%)

CURRENT PRICES:
  * ETH:  $${prices.ETH?.price  ?? 'N/A'} (24h: ${prices.ETH?.change24h?.toFixed(2)  ?? '0'}%)
  * BTC:  $${prices.BTC?.price  ?? 'N/A'} (24h: ${prices.BTC?.change24h?.toFixed(2)  ?? '0'}%)
  * USDC: $${prices.USDC?.price ?? 'N/A'} (24h: ${prices.USDC?.change24h?.toFixed(2) ?? '0'}%)

RULES:
- Rebalance if any asset drifts more than 5% from its target.
- Consider 24h price momentum when sizing actions.
- USDC is a stablecoin — use it to absorb or fund rebalances.

Respond ONLY with a single valid JSON object — no markdown, no backticks, no explanation outside the JSON.

JSON schema:
{
  "shouldRebalance": boolean,
  "reason": "2-3 sentence explanation",
  "confidence": number (0-100),
  "riskLevel": "low" | "medium" | "high",
  "marketSentiment": "bullish" | "bearish" | "neutral",
  "actions": [
    {
      "asset": "ETH" | "BTC" | "USDC",
      "action": "buy" | "sell" | "hold",
      "currentPercent": number,
      "targetPercent": number,
      "dollarAmount": number,
      "reason": "short reason"
    }
  ]
}
`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Strip markdown code fences if Gemini wraps the response
    const cleaned = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim()

    const parsed: AIAnalysis = JSON.parse(cleaned)
    return parsed
  } catch (err) {
    console.warn('analyzePortfolio: falling back to mock data.', err)
    return MOCK_ANALYSIS
  }
}
