'use client'

import { useState, useEffect } from 'react'

interface SessionSummary {
  id: string
  date: string
  overallScore: number
  toneScore: number
  volumeScore: number
  articulationScore: number
  paceScore: number
  mode: string
}

export default function ProgressPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sessions')
      .then(res => res.json())
      .then(data => setSessions(data.sessions || []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false))
  }, [])

  const avgScore = sessions.length > 0
    ? (sessions.reduce((sum, s) => sum + s.overallScore, 0) / sessions.length).toFixed(1)
    : '—'

  const weakestArea = sessions.length > 0 ? (() => {
    const avg = (key: keyof SessionSummary) => sessions.reduce((s, x) => s + (x[key] as number), 0) / sessions.length
    const scores = { Tone: avg('toneScore'), Volume: avg('volumeScore'), Articulation: avg('articulationScore'), Pace: avg('paceScore') }
    return Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0]
  })() : null

  return (
    <div className="pt-8">
      <h1 className="font-serif text-3xl font-bold">Progress</h1>
      <p className="text-stone mt-2">Track your improvement over time.</p>

      {loading ? (
        <div className="mt-12 text-center">
          <p className="text-stone">Loading...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="font-serif text-xl font-bold">No sessions yet</p>
          <p className="text-stone mt-2 text-sm">Complete your first recording to see progress.</p>
          <a href="/record" className="inline-block mt-4 bg-black text-white rounded-full py-3 px-6 text-sm font-medium hover:bg-gray-800 transition-colors">
            Start recording
          </a>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-sand rounded-xl p-4 text-center">
              <p className="font-serif text-2xl font-bold">{sessions.length}</p>
              <p className="text-xs text-stone mt-1">Sessions</p>
            </div>
            <div className="bg-sand rounded-xl p-4 text-center">
              <p className="font-serif text-2xl font-bold">{avgScore}</p>
              <p className="text-xs text-stone mt-1">Avg score</p>
            </div>
            <div className="bg-sand rounded-xl p-4 text-center">
              <p className="font-serif text-2xl font-bold">{weakestArea || '—'}</p>
              <p className="text-xs text-stone mt-1">Focus area</p>
            </div>
          </div>

          {/* Score Trend */}
          <div className="mt-8">
            <p className="text-xs text-stone uppercase tracking-wider mb-3">Score trend</p>
            <div className="h-32 flex items-end gap-1.5">
              {sessions.slice(0, 15).reverse().map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-black"
                    style={{ height: `${(s.overallScore / 10) * 100}%`, minHeight: '4px' }}
                  />
                  <span className="text-[10px] text-stone">{s.overallScore}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="mt-8">
            <p className="text-xs text-stone uppercase tracking-wider mb-3">Recent sessions</p>
            <div className="space-y-2">
              {sessions.slice(0, 8).map(session => (
                <div key={session.id} className="flex items-center justify-between bg-sand rounded-xl px-5 py-3">
                  <div>
                    <p className="text-sm font-medium capitalize">{session.mode}</p>
                    <p className="text-xs text-stone">{new Date(session.date).toLocaleDateString()}</p>
                  </div>
                  <p className="font-serif font-bold text-lg">{session.overallScore}<span className="text-stone text-sm font-normal">/10</span></p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
