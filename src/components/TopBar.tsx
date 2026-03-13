'use client'

import { useEffect, useState } from 'react'

export default function TopBar() {
  const [stats, setStats] = useState({ xp: 0, streak: 0, sessions: 0 })

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{
      background: 'rgba(11, 20, 38, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(160, 170, 191, 0.08)',
    }}>
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
        <span className="text-lg font-bold tracking-tight text-aqua-400">SPYKLE</span>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-amber-400">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
            </svg>
            <span className="font-semibold text-sm text-amber-400">{stats.streak}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-aqua-400">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>
            </svg>
            <span className="font-semibold text-sm text-aqua-400">{stats.xp}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-silver-400">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="font-semibold text-sm text-silver-400">{stats.sessions}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
