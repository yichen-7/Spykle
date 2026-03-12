'use client'

import { useState, useMemo } from 'react'
import AudioRecorder from '@/components/AudioRecorder'
import AnalysisResults from '@/components/AnalysisResults'
import { tongueTwisters, dailyChallenges } from '@/lib/exercises'
import type { AnalysisResult } from '@/types/analysis'

export default function PracticePage() {
  const [tab, setTab] = useState<'daily' | 'twisters'>('daily')
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const todayChallenge = useMemo(() => {
    const dayIndex = new Date().getDate() % dailyChallenges.length
    return dailyChallenges[dayIndex]
  }, [])

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
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-900">Practice</h1>
      <p className="mt-2 text-slate-600">
        Daily challenges and tongue twisters to sharpen your speaking skills.
      </p>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setTab('daily')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'daily' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Daily Challenge
        </button>
        <button
          onClick={() => setTab('twisters')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'twisters' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tongue Twisters
        </button>
      </div>

      {tab === 'daily' && (
        <div className="mt-6">
          <div className="p-6 bg-white rounded-xl border-2 border-amber-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Today&apos;s Challenge</h3>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                {todayChallenge.difficulty}
              </span>
            </div>
            <p className="mt-3 text-slate-700">{todayChallenge.instruction}</p>
            {todayChallenge.text && (
              <div className="mt-3 p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-800 italic">&ldquo;{todayChallenge.text}&rdquo;</p>
              </div>
            )}
          </div>
          <div className="mt-6">
            <AudioRecorder
              onRecordingComplete={(blob) => {
                setSelectedExercise(todayChallenge.text || todayChallenge.instruction)
                handleRecordingComplete(blob)
              }}
            />
          </div>
        </div>
      )}

      {tab === 'twisters' && (
        <div className="mt-6 space-y-4">
          {tongueTwisters.map((twister, i) => (
            <div key={i} className="p-4 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  twister.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  twister.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {twister.difficulty}
                </span>
                <span className="text-xs text-slate-400">Target: {twister.targetSound}</span>
              </div>
              <p className="text-slate-800 font-medium">{twister.text}</p>
              <button
                onClick={() => setSelectedExercise(twister.text)}
                className="mt-3 text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                Practice this one &rarr;
              </button>
            </div>
          ))}

          {selectedExercise && (
            <div className="mt-6 p-6 bg-brand-50 rounded-xl border border-brand-200">
              <h3 className="font-semibold text-brand-800 mb-1">Practicing:</h3>
              <p className="text-brand-700 italic mb-4">&ldquo;{selectedExercise}&rdquo;</p>
              <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            </div>
          )}
        </div>
      )}

      {analyzing && (
        <div className="mt-8 p-8 bg-white rounded-xl border border-slate-200 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-slate-600">Analyzing your practice...</p>
        </div>
      )}

      {analysis && <AnalysisResults result={analysis} />}
    </div>
  )
}
