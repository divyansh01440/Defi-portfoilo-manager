import { analyzePortfolio } from '@/lib/gemini'
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Use POST method with portfolio data' })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { allocations, prices, totalValue } = body

    if (!allocations || !prices || totalValue === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: allocations, prices, totalValue' },
        { status: 400 }
      )
    }

    const analysis = await analyzePortfolio(allocations, prices, totalValue)
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('analyze route error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze portfolio' },
      { status: 500 }
    )
  }
}