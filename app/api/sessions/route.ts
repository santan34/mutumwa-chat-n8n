import { NextRequest, NextResponse } from 'next/server'

const ZEP_API_BASE = process.env.ZEP_API_BASE || "https://api.getzep.com/api/v2"
const ZEP_API_KEY = process.env.ZEP_API_KEY

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${ZEP_API_BASE}/sessions`, {
      headers: {
        'Authorization': `Api-Key ${ZEP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Zep API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ sessions: [] })
  }
}
