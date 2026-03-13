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

  const totalXP = sessions.reduce((sum, s) => sum + Math.round(s.overallScore * 10), 0)
  const level = Math.floor(totalXP / 100) + 1
  const avgScore = sessions.length > 0
    ? (sessions.reduce((sum, s) => sum + s.overallScore, 0) / sessions.length).toFixed(1)
    : '0'

  const weakestArea = sessions.length > 0 ? (() => {
    const avg = (key: keyof SessionSummary) => sessions.reduce((s, x) => s + (x[key] as number), 0) / sessions.length
    const scores = { Tone: avg('toneScore'), Volume: avg('volumeScore'), Articulation: avg('articulationScore'), Pace: avg('paceScore') }
    return Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0]
  })() : null

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-xl font-bold text-silver-100">Progress</h1>
        <p className="text-sm text-silver-500 mt-1">Track your improvement</p>
      </div>

      {loading ? (
        <div className="glass-card text-center py-8">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-aqua-400 border-t-transparent animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="glass-card text-center py-8">
          <p className="font-semibold text-silver-300">No sessions yet</p>
          <p className="text-sm text-silver-500 mt-1">Complete your first recording to see progress</p>
          <a href="/record" className="btn-primary inline-block mt-4">Start Recording</a>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card text-center">
              <p className="text-3xl font-bold text-aqua-400">{level}</p>
              <p className="text-[10px] font-semibold text-silver-500 uppercase tracking-wider">Level</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-3xl font-bold text-amber-400">{totalXP}</p>
              <p className="text-[10px] font-semibold text-silver-500 uppercase tracking-wider">Total XP</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-3xl font-bold text-soft-blue">{avgScore}</p>
              <p className="text-[10px] font-semibold text-silver-500 uppercase tracking-wider">Avg Score</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-3xl font-bold text-soft-purple">{sessions.length}</p>
              <p className="text-[10px] font-semibold text-silver-500 uppercase tracking-wider">Sessions</p>
            </div>
          </div>

          {/* Weakest Area */}
          {weakestArea && (
            <div className="glass-card" style={{ borderLeft: '3px solid #F0B840' }}>
              <p className="text-xs font-semibold text-silver-500 uppercase tracking-wider">Focus Area</p>
              <p className="font-bold text-lg text-silver-100 mt-1">{weakestArea}</p>
            </div>
          )}

          {/* Score Trend */}
          <div className="glass-card">
            <p className="text-xs font-semibold text-silver-500 uppercase tracking-wider mb-3">Score Trend</p>
            <div className="h-32 flex items-end gap-1.5">
              {sessions.slice(0, 15).reverse().map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg"
                    style={{
                      height: `${(s.overallScore / 10) * 100}%`,
                      minHeight: '4px',
                      background: 'linear-gradient(to top, #3BA99E, #4ECDC4)',
                    }}
                  />
                  <span className="text-[10px] text-silver-600 font-semibold">{s.overallScore}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-silver-500 uppercase tracking-wider">Recent Sessions</p>
            {sessions.slice(0, 8).map(session => (
              <div key={session.id} className="glass-card-light flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-silver-200 text-sm capitalize">{session.mode}</p>
                  <p className="text-xs text-silver-600">{new Date(session.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-lg font-bold ${
                    session.overallScore >= 7 ? 'text-aqua-400' :
                    session.overallScore >= 5 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {session.overallScore}
                  </span>
                  <span className="text-xs text-silver-600">/10</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
