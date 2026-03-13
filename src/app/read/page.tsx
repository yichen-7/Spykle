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
    <div className="pt-8">
      <h1 className="font-serif text-3xl font-bold">Read Aloud</h1>
      <p className="text-stone mt-2">Upload a text, read it out loud, and get feedback.</p>

      <div className="mt-8">
        <input ref={fileInputRef} type="file" accept=".pdf,.txt" onChange={handleFileUpload} className="hidden" />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full border border-gray-300 rounded-full py-3 px-6 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Upload PDF or text file
        </button>
        {fileName && <p className="text-center text-sm text-stone mt-2">{fileName}</p>}
      </div>

      {bookText && (
        <div className="mt-6 bg-sand rounded-2xl p-6 max-h-48 overflow-y-auto">
          <p className="text-xs text-stone uppercase tracking-wider mb-2">Text to read</p>
          <p className="leading-relaxed text-sm whitespace-pre-wrap">{bookText}</p>
        </div>
      )}

      {bookText && (
        <div className="mt-6 bg-sand rounded-2xl p-6">
          <p className="text-xs text-stone uppercase tracking-wider mb-3">Record your reading</p>
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        </div>
      )}

      {analyzing && (
        <div className="mt-8 text-center py-8">
          <p className="text-stone">Analyzing your reading...</p>
        </div>
      )}

      {analysis && <AnalysisResults result={analysis} />}
    </div>
  )
}
