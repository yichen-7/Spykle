import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const { interests } = await request.json()

    if (!interests || !interests.trim()) {
      return NextResponse.json({ error: 'No interests provided' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.8,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You generate unique, thought-provoking speaking topics for someone to talk about for 1 minute. The topics should be specific, interesting, and connected to the person's interests — not generic. Make them think and form opinions.

Return JSON: { "topic": "the topic as a question or prompt", "context": "1 sentence of context or why this is interesting" }`
          },
          {
            role: 'user',
            content: `The person is interested in: ${interests}

Today's date is ${today}. Generate one unique speaking topic that connects to their interests. Make it specific — not "talk about your hobby" but something that makes them think, argue a position, or explain something they care about.`
          }
        ],
      }),
    })

    if (!res.ok) {
      throw new Error('Failed to generate topic')
    }

    const data = await res.json()
    const content = JSON.parse(data.choices[0].message.content)

    return NextResponse.json({
      topic: content.topic,
      context: content.context,
    })
  } catch (err) {
    console.error('Topic generation error:', err)
    return NextResponse.json({ error: 'Failed to generate topic' }, { status: 500 })
  }
}
