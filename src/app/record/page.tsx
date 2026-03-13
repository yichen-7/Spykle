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
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-xl font-bold text-silver-100">Record & Analyze</h1>
        <p className="text-sm text-silver-500 mt-1">Speak and get instant AI feedback</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('audio')}
          className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-all ${
            mode === 'audio'
              ? 'bg-aqua-400 text-navy-900'
              : 'text-silver-400'
          }`}
          style={mode === 'audio'
            ? { boxShadow: '0 4px 16px rgba(78, 205, 196, 0.3)' }
            : { background: 'rgba(160, 170, 191, 0.1)', border: '1px solid rgba(160, 170, 191, 0.1)' }
          }
        >
          Audio
        </button>
        <button
          onClick={() => setMode('video')}
          className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-all ${
            mode === 'video'
              ? 'bg-soft-blue text-white'
              : 'text-silver-400'
          }`}
          style={mode === 'video'
            ? { boxShadow: '0 4px 16px rgba(91, 141, 239, 0.3)' }
            : { background: 'rgba(160, 170, 191, 0.1)', border: '1px solid rgba(160, 170, 191, 0.1)' }
          }
        >
          Video
        </button>
      </div>

      {/* Recorder */}
      <div className="glass-card">
        {mode === 'audio' ? (
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        ) : (
          <VideoRecorder onRecordingComplete={handleRecordingComplete} />
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="glass-card" style={{ borderLeft: '3px solid #E85D75' }}>
          <p className="font-semibold text-rose-400">Something went wrong</p>
          <p className="text-sm text-silver-500 mt-1">{error}</p>
        </div>
      )}

      {/* Loading */}
      {analyzing && (
        <div className="glass-card text-center py-8">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-aqua-400 border-t-transparent animate-spin" />
          <p className="font-semibold text-silver-300">{stage}</p>
          <div className="mt-3 bg-navy-800 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
            <div className="h-full bg-gradient-to-r from-aqua-500 to-aqua-400 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      )}

      {analysis && <AnalysisResults result={analysis} />}
    </div>
  )
}
