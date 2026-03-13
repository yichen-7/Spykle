'use client'

import { useState, useRef } from 'react'
import AudioRecorder from '@/components/AudioRecorder'
import AnalysisResults from '@/components/AnalysisResults'
import type { AnalysisResult } from '@/types/analysis'

export default function ReadPage() {
  const [bookText, setBookText] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)

    if (file.type === 'application/pdf') {
      const formData = new FormData()
      formData.append('pdf', file)
      try {
        const res = await fetch('/api/parse-pdf', { method: 'POST', body: formData })
        if (!res.ok) throw new Error('PDF parsing failed')
        const data = await res.json()
        setBookText(data.text)
      } catch (err) {
        console.error('PDF parse error:', err)
      }
    } else {
      const text = await file.text()
      setBookText(text)
    }
  }

  const handleRecordingComplete = async (blob: Blob) => {
    setAnalyzing(true)
    setAnalysis(null)
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'reading.webm')
      formData.append('referenceText', bookText)
      formData.append('mode', 'reading')
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
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-xl font-bold text-silver-100">Read Aloud</h1>
        <p className="text-sm text-silver-500 mt-1">Upload text and practice reading</p>
      </div>

      {/* Upload */}
      <input ref={fileInputRef} type="file" accept=".pdf,.txt" onChange={handleFileUpload} className="hidden" />
      <button onClick={() => fileInputRef.current?.click()} className="btn-soft-blue w-full">
        Upload PDF or Text File
      </button>
      {fileName && (
        <p className="text-center text-sm text-silver-500">{fileName}</p>
      )}

      {/* Text Display */}
      {bookText && (
        <div className="glass-card max-h-48 overflow-y-auto">
          <p className="text-xs font-semibold text-silver-500 uppercase tracking-wider mb-2">Text to Read</p>
          <p className="text-silver-300 leading-relaxed whitespace-pre-wrap text-sm">{bookText}</p>
        </div>
      )}

      {/* Record */}
      {bookText && (
        <div className="glass-card">
          <p className="text-xs font-semibold text-silver-500 uppercase tracking-wider mb-3">Record Your Reading</p>
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        </div>
      )}

      {analyzing && (
        <div className="glass-card text-center py-8">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-aqua-400 border-t-transparent animate-spin" />
          <p className="font-semibold text-silver-300">Analyzing your reading...</p>
        </div>
      )}

      {analysis && <AnalysisResults result={analysis} />}
    </div>
  )
}
