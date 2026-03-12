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

  const averageScore = sessions.length > 0
    ? (sessions.reduce((sum, s) => sum + s.overallScore, 0) / sessions.length).toFixed(1)
    : null

  const latestScores = sessions.slice(0, 5)

  const weakestArea = sessions.length > 0 ? (() => {
    const avgTone = sessions.reduce((s, x) => s + x.toneScore, 0) / sessions.length
    const avgVol = sessions.reduce((s, x) => s + x.volumeScore, 0) / sessions.length
    const avgArt = sessions.reduce((s, x) => s + x.articulationScore, 0) / sessions.length
    const avgPace = sessions.reduce((s, x) => s + x.paceScore, 0) / sessions.length
    const min = Math.min(avgTone, avgVol, avgArt, avgPace)
    if (min === avgTone) return 'Tone'
    if (min === avgVol) return 'Volume'
    if (min === avgArt) return 'Articulation'
    return 'Pace'
  })() : null

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-900">Progress</h1>
      <p className="mt-2 text-slate-600">
        Track your improvement over time and identify areas to focus on.
      </p>

      {loading ? (
        <div className="mt-8 text-center text-slate-400">Loading...</div>
      ) : sessions.length === 0 ? (
        <div className="mt-8 p-8 bg-white rounded-xl border border-slate-200 text-center">
          <p className="text-slate-500">No sessions yet. Go to <strong>Record</strong> to get started!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <p className="text-sm text-slate-500">Total Sessions</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{sessions.length}</p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <p className="text-sm text-slate-500">Average Score</p>
              <p className="text-3xl font-bold text-brand-600 mt-1">{averageScore}/10</p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <p className="text-sm text-slate-500">Focus Area</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">{weakestArea}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Sessions</h2>
            <div className="space-y-3">
              {latestScores.map(session => (
                <div key={session.id} className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{session.mode} session</p>
                    <p className="text-sm text-slate-500">{new Date(session.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <ScorePill label="Overall" score={session.overallScore} />
                    <ScorePill label="Tone" score={session.toneScore} />
                    <ScorePill label="Vol" score={session.volumeScore} />
                    <ScorePill label="Art" score={session.articulationScore} />
                    <ScorePill label="Pace" score={session.paceScore} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Score Trend</h2>
            <div className="h-40 flex items-end gap-2">
              {sessions.slice(0, 20).reverse().map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-brand-400 rounded-t"
                    style={{ height: `${(s.overallScore / 10) * 100}%` }}
                  />
                  <span className="text-xs text-slate-400">{s.overallScore}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ScorePill({ label, score }: { label: string; score: number }) {
  const color = score >= 7 ? 'text-green-600' : score >= 5 ? 'text-amber-600' : 'text-red-600'
  return (
    <div className="text-center">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`font-semibold ${color}`}>{score}</p>
    </div>
  )
}
