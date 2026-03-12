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
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-900">Read Aloud</h1>
      <p className="mt-2 text-slate-600">
        Upload a PDF or text file, read it aloud, and get feedback on accuracy and fluency.
      </p>

      <div className="mt-6">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
        >
          Upload PDF or Text File
        </button>
        {fileName && (
          <span className="ml-3 text-sm text-slate-500">{fileName}</span>
        )}
      </div>

      {bookText && (
        <div className="mt-6 p-6 bg-white rounded-xl border border-slate-200 max-h-64 overflow-y-auto">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Text to Read</h3>
          <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{bookText}</p>
        </div>
      )}

      {bookText && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Record Your Reading</h3>
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        </div>
      )}

      {analyzing && (
        <div className="mt-8 p-8 bg-white rounded-xl border border-slate-200 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-slate-600">Analyzing your reading...</p>
        </div>
      )}

      {analysis && <AnalysisResults result={analysis} />}
    </div>
  )
}
