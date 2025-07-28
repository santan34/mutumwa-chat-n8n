import { NextRequest, NextResponse } from 'next/server'

const ZEP_API_BASE = process.env.ZEP_API_BASE || "https://api.getzep.com/api/v2"
const ZEP_API_KEY = process.env.ZEP_API_KEY

export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${ZEP_API_BASE}/sessions/${sessionId}`, {
      headers: {
        'Authorization': `Api-Key ${ZEP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
      }
      throw new Error(`Zep API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching session details:', error)
    return NextResponse.json({ error: 'Failed to fetch session details' }, { status: 500 })
  }
}
