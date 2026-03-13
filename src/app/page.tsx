'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState({ xp: 0, streak: 0, sessions: 0 })

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  const level = Math.floor(stats.xp / 100) + 1
  const xpInLevel = stats.xp % 100

  return (
    <div className="space-y-5">
      {/* Hero with mascot — only place it appears */}
      {stats.sessions === 0 && (
        <div className="glass-card text-center py-6">
          <Image
            src="/Macot.png"
            alt="Spykle"
            width={120}
            height={120}
            className="mx-auto mb-3 opacity-90"
          />
          <h1 className="text-xl font-bold text-silver-100">Welcome to Spykle</h1>
          <p className="text-sm text-silver-500 mt-1">Train your voice. Sharpen your mind.</p>
        </div>
      )}

      {/* Level & XP */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-silver-400">Level {level}</span>
          <span className="text-xs text-silver-500">{xpInLevel}/100 XP</span>
        </div>
        <div className="bg-navy-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-aqua-500 to-aqua-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(xpInLevel, 3)}%` }}
          />
        </div>
      </div>

      {/* Streak */}
      {stats.streak > 0 && (
        <div className="glass-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#F0B840"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-xl text-silver-100">{stats.streak} day streak</p>
            <p className="text-sm text-silver-500">Keep it going</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-silver-500 uppercase tracking-wider">Start Training</p>

        <Link href="/record" className="block">
          <div className="glass-card flex items-center gap-4 hover:border-aqua-400/20 transition-all group">
            <div className="w-11 h-11 rounded-xl bg-aqua-400/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-aqua-400">
                <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M5 10a7 7 0 0014 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-silver-100">Record & Analyze</p>
              <p className="text-xs text-silver-500">Get AI feedback on your speech</p>
            </div>
            <span className="text-xs font-semibold text-aqua-400/60">+10 XP</span>
          </div>
        </Link>

        <Link href="/practice" className="block">
          <div className="glass-card flex items-center gap-4 hover:border-soft-purple/20 transition-all group">
            <div className="w-11 h-11 rounded-xl bg-soft-purple/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-soft-purple">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-silver-100">Practice</p>
              <p className="text-xs text-silver-500">Philosophy, topics & tongue twisters</p>
            </div>
            <span className="text-xs font-semibold text-soft-purple/60">+15 XP</span>
          </div>
        </Link>

        <Link href="/read" className="block">
          <div className="glass-card flex items-center gap-4 hover:border-soft-blue/20 transition-all group">
            <div className="w-11 h-11 rounded-xl bg-soft-blue/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-soft-blue">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="currentColor" strokeWidth="2"/>
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-silver-100">Read Aloud</p>
              <p className="text-xs text-silver-500">Practice reading fluency</p>
            </div>
            <span className="text-xs font-semibold text-soft-blue/60">+10 XP</span>
          </div>
        </Link>

        <Link href="/review" className="block">
          <div className="glass-card flex items-center gap-4 hover:border-amber-400/20 transition-all group">
            <div className="w-11 h-11 rounded-xl bg-amber-400/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-400">
                <rect x="2" y="4" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 9l5 3-5 3V9z" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-silver-100">Video Review</p>
              <p className="text-xs text-silver-500">Review yourself speaking</p>
            </div>
            <span className="text-xs font-semibold text-amber-400/60">+10 XP</span>
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card-light text-center py-3">
          <p className="text-xl font-bold text-silver-100">{stats.sessions}</p>
          <p className="text-[10px] font-semibold text-silver-500 uppercase">Sessions</p>
        </div>
        <div className="glass-card-light text-center py-3">
          <p className="text-xl font-bold text-aqua-400">{stats.xp}</p>
          <p className="text-[10px] font-semibold text-silver-500 uppercase">Total XP</p>
        </div>
        <div className="glass-card-light text-center py-3">
          <p className="text-xl font-bold text-silver-100">{level}</p>
          <p className="text-[10px] font-semibold text-silver-500 uppercase">Level</p>
        </div>
      </div>
    </div>
  )
}
