import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      sessions: sessions.map(s => ({
        id: s.id,
        date: s.createdAt.toISOString(),
        overallScore: s.overallScore,
        toneScore: s.toneScore,
        volumeScore: s.volumeScore,
        articulationScore: s.articulationScore,
        paceScore: s.paceScore,
        mode: s.mode,
      })),
    })
  } catch (error) {
    console.error('Sessions fetch error:', error)
    return NextResponse.json({ sessions: [] })
  }
}
