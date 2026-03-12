'use client'

import { useState } from 'react'
import AudioRecorder from '@/components/AudioRecorder'
import VideoRecorder from '@/components/VideoRecorder'
import AnalysisResults from '@/components/AnalysisResults'
import type { AnalysisResult } from '@/types/analysis'

export default function RecordPage() {
  const [mode, setMode] = useState<'audio' | 'video'>('audio')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const handleRecordingComplete = async (blob: Blob) => {
    setAnalyzing(true)
    setAnalysis(null)
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'recording.webm')
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
      <h1 className="text-3xl font-bold text-slate-900">Record & Analyze</h1>
      <p className="mt-2 text-slate-600">
        Record yourself speaking and get AI-powered feedback on your communication skills.
      </p>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setMode('audio')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'audio'
              ? 'bg-brand-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Audio Only
        </button>
        <button
          onClick={() => setMode('video')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'video'
              ? 'bg-brand-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Video + Audio
        </button>
      </div>

      <div className="mt-6">
        {mode === 'audio' ? (
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        ) : (
          <VideoRecorder onRecordingComplete={handleRecordingComplete} />
        )}
      </div>

      {analyzing && (
        <div className="mt-8 p-8 bg-white rounded-xl border border-slate-200 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-slate-600">Analyzing your speech...</p>
          <p className="text-sm text-slate-400 mt-1">This may take 10-15 seconds</p>
        </div>
      )}

      {analysis && <AnalysisResults result={analysis} />}
    </div>
  )
}
