'use client'

import { useState, useMemo } from 'react'
import AudioRecorder from '@/components/AudioRecorder'
import AnalysisResults from '@/components/AnalysisResults'
import { tongueTwisters, getDailyChallenge, getDailyQuote } from '@/lib/exercises'
import type { AnalysisResult } from '@/types/analysis'

export default function PracticePage() {
  const [tab, setTab] = useState<'philosophy' | 'daily' | 'twisters'>('philosophy')
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const todayChallenge = useMemo(() => getDailyChallenge(), [])
  const todayQuote = useMemo(() => getDailyQuote(), [])

  const handleRecordingComplete = async (blob: Blob) => {
    setAnalyzing(true)
    setAnalysis(null)
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'practice.webm')
      if (selectedExercise) {
        formData.append('referenceText', selectedExercise)
        formData.append('mode', 'practice')
      }
      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      setAnalysis(data)
    } catch (err) {
      console.error('Analysis error:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  const tabs = [
    { id: 'philosophy' as const, label: 'Philosophy' },
    { id: 'daily' as const, label: 'Topic' },
    { id: 'twisters' as const, label: 'Twisters' },
  ]

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-xl font-bold text-silver-100">Practice</h1>
        <p className="text-sm text-silver-500 mt-1">Train your speaking skills daily</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-2xl font-semibold text-xs transition-all ${
              tab === t.id
                ? 'bg-aqua-400 text-navy-900'
                : 'text-silver-400'
            }`}
            style={tab === t.id
              ? { boxShadow: '0 4px 16px rgba(78, 205, 196, 0.3)' }
              : { background: 'rgba(160, 170, 191, 0.1)', border: '1px solid rgba(160, 170, 191, 0.1)' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Philosophy */}
      {tab === 'philosophy' && (
        <div className="space-y-4">
          <div className="glass-card" style={{ borderLeft: '3px solid #9B7AEF' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-silver-500 uppercase tracking-wider">Today&apos;s Quote</span>
              <span className="px-2 py-1 rounded-lg text-[10px] font-semibold" style={{
                background: 'rgba(155, 122, 239, 0.1)', color: '#9B7AEF'
              }}>1 min</span>
            </div>
            <p className="text-lg font-semibold text-silver-100 italic leading-relaxed">
              &ldquo;{todayQuote.quote}&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="font-semibold text-soft-purple text-sm">{todayQuote.author}</span>
              <span className="text-silver-600">|</span>
              <span className="text-xs text-silver-500">{todayQuote.context}</span>
            </div>
          </div>
          <p className="text-sm text-silver-500 text-center">Explain what this quote means in <strong className="text-silver-300">1 full minute</strong></p>
          <div className="glass-card">
            <AudioRecorder
              onRecordingComplete={(blob) => {
                setSelectedExercise(todayQuote.quote)
                handleRecordingComplete(blob)
              }}
            />
          </div>
        </div>
      )}

      {/* Daily Topic */}
      {tab === 'daily' && (
        <div className="space-y-4">
          <div className="glass-card" style={{ borderLeft: '3px solid #F0B840' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-silver-500 uppercase tracking-wider">Today&apos;s Topic</span>
              <span className="px-2 py-1 rounded-lg text-[10px] font-semibold" style={{
                background: 'rgba(240, 184, 64, 0.1)', color: '#F0B840'
              }}>1 min</span>
            </div>
            <p className="text-lg font-semibold text-silver-100">&ldquo;{todayChallenge.topic}&rdquo;</p>
          </div>
          <p className="text-sm text-silver-500 text-center">{todayChallenge.instruction}</p>
          <div className="glass-card">
            <AudioRecorder
              onRecordingComplete={(blob) => {
                setSelectedExercise(todayChallenge.topic)
                handleRecordingComplete(blob)
              }}
            />
          </div>
        </div>
      )}

      {/* Tongue Twisters */}
      {tab === 'twisters' && (
        <div className="space-y-3">
          {tongueTwisters.map((twister, i) => (
            <div key={i} className="glass-card">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-semibold ${
                  twister.difficulty === 'Easy' ? 'text-aqua-400' :
                  twister.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                }`} style={{
                  background: twister.difficulty === 'Easy' ? 'rgba(78, 205, 196, 0.1)' :
                              twister.difficulty === 'Medium' ? 'rgba(240, 184, 64, 0.1)' :
                              'rgba(232, 93, 117, 0.1)'
                }}>
                  {twister.difficulty}
                </span>
                <span className="text-[10px] text-silver-600">{twister.targetSound}</span>
              </div>
              <p className="text-silver-200 font-semibold">{twister.text}</p>
              <button
                onClick={() => setSelectedExercise(twister.text)}
                className="mt-3 text-sm text-aqua-400 hover:text-aqua-300 font-semibold transition-colors"
              >
                Practice this &rarr;
              </button>
            </div>
          ))}

          {selectedExercise && (
            <div className="glass-card" style={{ border: '1px solid rgba(78, 205, 196, 0.3)' }}>
              <p className="text-xs font-semibold text-aqua-400 uppercase tracking-wider mb-2">Practicing</p>
              <p className="text-silver-300 italic mb-4">&ldquo;{selectedExercise}&rdquo;</p>
              <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {analyzing && (
        <div className="glass-card text-center py-8">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-aqua-400 border-t-transparent animate-spin" />
          <p className="font-semibold text-silver-300">Analyzing your practice...</p>
        </div>
      )}

      {analysis && <AnalysisResults result={analysis} />}
    </div>
  )
}
