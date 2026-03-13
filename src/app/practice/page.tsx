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

  return (
    <div className="pt-8">
      <h1 className="font-serif text-3xl font-bold">Practice</h1>
      <p className="text-stone mt-2">Train your speaking skills with daily exercises.</p>

      <div className="mt-8 flex gap-2">
        {(['philosophy', 'daily', 'twisters'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
              tab === t ? 'bg-black text-white' : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {t === 'daily' ? 'Topic' : t}
          </button>
        ))}
      </div>

      {/* Philosophy */}
      {tab === 'philosophy' && (
        <div className="mt-8 space-y-6">
          <div className="border-l-2 border-black pl-5">
            <p className="text-xs text-stone uppercase tracking-wider">Today&apos;s quote</p>
            <p className="font-serif text-xl font-bold mt-2 leading-relaxed italic">
              &ldquo;{todayQuote.quote}&rdquo;
            </p>
            <p className="mt-3 text-sm">
              <span className="font-medium">{todayQuote.author}</span>
              <span className="text-stone"> &middot; {todayQuote.context}</span>
            </p>
          </div>
          <p className="text-sm text-stone">Explain what this quote means in one full minute.</p>
          <div className="bg-sand rounded-2xl p-6">
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
        <div className="mt-8 space-y-6">
          <div className="border-l-2 border-black pl-5">
            <p className="text-xs text-stone uppercase tracking-wider">Today&apos;s topic</p>
            <p className="font-serif text-xl font-bold mt-2">&ldquo;{todayChallenge.topic}&rdquo;</p>
          </div>
          <p className="text-sm text-stone">{todayChallenge.instruction}</p>
          <div className="bg-sand rounded-2xl p-6">
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
        <div className="mt-8 space-y-4">
          {tongueTwisters.map((twister, i) => (
            <div key={i} className="bg-sand rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-stone">{twister.difficulty}</span>
                <span className="text-xs text-stone">{twister.targetSound}</span>
              </div>
              <p className="font-medium">{twister.text}</p>
              <button
                onClick={() => setSelectedExercise(twister.text)}
                className="mt-3 text-sm text-stone hover:text-black transition-colors"
              >
                Practice this &rarr;
              </button>
            </div>
          ))}

          {selectedExercise && (
            <div className="border border-gray-300 rounded-2xl p-6">
              <p className="text-xs text-stone uppercase tracking-wider mb-1">Practicing</p>
              <p className="italic mb-4">&ldquo;{selectedExercise}&rdquo;</p>
              <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            </div>
          )}
        </div>
      )}

      {analyzing && (
        <div className="mt-8 text-center py-8">
          <p className="text-stone">Analyzing...</p>
        </div>
      )}

      {analysis && <AnalysisResults result={analysis} />}
    </div>
  )
}
