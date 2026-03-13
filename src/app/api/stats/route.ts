import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const totalSessions = sessions.length
    const xp = sessions.reduce((sum, s) => sum + Math.round(s.overallScore * 10), 0)

    // Calculate streak (consecutive days with at least one session)
    let streak = 0
    if (sessions.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const dayMs = 86400000
      let checkDate = today.getTime()

      for (let i = 0; i < 365; i++) {
        const dayStart = new Date(checkDate)
        const dayEnd = new Date(checkDate + dayMs)
        const hasSession = sessions.some(s => {
          const d = new Date(s.createdAt).getTime()
          return d >= dayStart.getTime() && d < dayEnd.getTime()
        })
        if (hasSession) {
          streak++
          checkDate -= dayMs
        } else if (i === 0) {
          // No session today yet, check from yesterday
          checkDate -= dayMs
        } else {
          break
        }
      }
    }

    return NextResponse.json({ xp, streak, sessions: totalSessions })
  } catch {
    return NextResponse.json({ xp: 0, streak: 0, sessions: 0 })
  }
}
