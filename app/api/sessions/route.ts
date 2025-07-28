import { NextRequest, NextResponse } from 'next/server'

const ZEP_API_BASE = process.env.ZEP_API_BASE || "https://api.getzep.com/api/v2"
const ZEP_API_KEY = process.env.ZEP_API_KEY || "z_1dWlkIjoiNTI3OGYyZDAtZDc2Ny00ZDk4LTgyNzItNmJjZTY4ZGZkYmY5In0.pq9UvrIRaLs-YQzmby2GBBcA1x631J-7Z2DpUrN0tlgeVO0w79bPQlOZcluMSIJMhxf5HF5Ze155An0S83I6sw"

// Route to fetch all sessions (conversation history)
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

// Route to create a new session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_id, metadata } = body

    if (!session_id) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      )
    }

    const response = await fetch(`${ZEP_API_BASE}/sessions`, {
      method: "POST",
      headers: {
        'Authorization': `Api-Key ${ZEP_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ session_id, metadata }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `Zep API error: ${response.status} ${response.statusText}`,
        errorText
      )
      return NextResponse.json(
        { error: `Failed to create session: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating session:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
