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
  const [error, setError] = useState<string>('')
  const [stage, setStage] = useState<string>('')

  const handleRecordingComplete = async (blob: Blob) => {
    setAnalyzing(true)
    setAnalysis(null)
    setError('')
    setStage('Uploading audio...')
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'recording.webm')
      setStage('Transcribing speech...')
      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      setStage('Getting AI feedback...')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setAnalysis(data)
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
      setStage('')
    }
  }

  return (
    <div className="pt-8">
      <h1 className="font-serif text-3xl font-bold">Record & Analyze</h1>
      <p className="text-stone mt-2">Speak and get instant feedback on your delivery.</p>

      <div className="mt-8 flex gap-2">
        <button
          onClick={() => setMode('audio')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            mode === 'audio' ? 'bg-black text-white' : 'border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Audio
        </button>
        <button
          onClick={() => setMode('video')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            mode === 'video' ? 'bg-black text-white' : 'border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Video
        </button>
      </div>

      <div className="mt-6 bg-sand rounded-2xl p-6">
        {mode === 'audio' ? (
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        ) : (
          <VideoRecorder onRecordingComplete={handleRecordingComplete} />
        )}
      </div>

      {error && (
        <div className="mt-6 border-l-2 border-red-400 pl-4 py-2">
          <p className="font-medium">Something went wrong</p>
          <p className="text-sm text-stone mt-1">{error}</p>
        </div>
      )}

      {analyzing && (
        <div className="mt-8 text-center py-8">
          <p className="text-stone">{stage}</p>
        </div>
      )}

      {analysis && <AnalysisResults result={analysis} />}
    </div>
  )
}
