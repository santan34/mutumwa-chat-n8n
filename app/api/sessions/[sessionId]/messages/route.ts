import { NextRequest, NextResponse } from 'next/server';
import { Message, Session } from '@/lib/types';

const ZEP_API_BASE = process.env.ZEP_API_BASE || "https://api.getzep.com/api/v2";
const ZEP_API_KEY = process.env.ZEP_API_KEY;
const USER_ID = "hardcoded_user_id";

async function getSession(sessionId: string): Promise<Session | null> {
    if (!ZEP_API_KEY) {
        console.error("ZEP_API_KEY is not set");
        return null;
    }
    try {
        const response = await fetch(`${ZEP_API_BASE}/sessions/${sessionId}`, {
            headers: {
                'Authorization': `Api-Key ${ZEP_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            console.error(`Zep API error (getSession): ${response.status} ${response.statusText}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching session:', error);
        return null;
    }
}

async function createSession(sessionId: string, firstMessage: string): Promise<Session | null> {
    if (!ZEP_API_KEY) {
        console.error("ZEP_API_KEY is not set");
        return null;
    }
    try {
        const response = await fetch(`${ZEP_API_BASE}/sessions`, {
            method: 'POST',
            headers: {
                'Authorization': `Api-Key ${ZEP_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_id: sessionId,
                user_id: USER_ID,
                metadata: { name: firstMessage.slice(0, 50) }
            })
        });
        if (!response.ok) {
            console.error(`Zep API error (createSession): ${response.status} ${response.statusText}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating session:', error);
        return null;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { sessionId: string } }
) {
    const { sessionId } = params;
    if (!sessionId) {
        return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    if (!ZEP_API_KEY) {
        return NextResponse.json({ error: 'ZEP_API_KEY is not configured' }, { status: 500 });
    }

    try {
        const response = await fetch(`${ZEP_API_BASE}/sessions/${sessionId}/messages`, {
            headers: {
                'Authorization': `Api-Key ${ZEP_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json({ messages: [], total_count: 0, row_count: 0 });
            }
            throw new Error(`Zep API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching session messages:', error);
        return NextResponse.json({ messages: [], total_count: 0, row_count: 0 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { sessionId: string } }
) {
    const { sessionId } = params;
    if (!sessionId) {
        return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    if (!ZEP_API_KEY) {
        return NextResponse.json({ error: 'ZEP_API_KEY is not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const messages: Omit<Message, 'uuid' | 'created_at'>[] = body.messages;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
        }

        const session = await getSession(sessionId);
        if (!session) {
            await createSession(sessionId, messages[0].content);
        }

        const response = await fetch(`${ZEP_API_BASE}/sessions/${sessionId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Api-Key ${ZEP_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Zep API error: ${response.status} ${response.statusText}`, errorText);
            return NextResponse.json({ error: `Failed to add message: ${response.statusText}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error adding message to session:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
