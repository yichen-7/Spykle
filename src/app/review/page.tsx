'use client'

import { useState } from 'react'
import VideoRecorder from '@/components/VideoRecorder'
import VideoReviewer from '@/components/VideoReviewer'

export default function ReviewPage() {
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [mode, setMode] = useState<'choose' | 'record' | 'review'>('choose')

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setVideoBlob(file)
    setVideoUrl(URL.createObjectURL(file))
    setMode('review')
  }

  const handleRecordComplete = (blob: Blob) => {
    setVideoBlob(blob)
    setVideoUrl(URL.createObjectURL(blob))
    setMode('review')
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-900">Video Review</h1>
      <p className="mt-2 text-slate-600">
        Record or upload a video, add comments at specific timestamps, and get AI analysis.
      </p>

      {mode === 'choose' && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setMode('record')}
            className="p-8 bg-white rounded-xl border-2 border-violet-200 hover:border-violet-400 transition-colors text-left"
          >
            <div className="text-3xl mb-3">●</div>
            <h3 className="text-lg font-semibold text-slate-900">Record Video</h3>
            <p className="mt-1 text-sm text-slate-500">Record yourself using your webcam</p>
          </button>
          <label className="p-8 bg-white rounded-xl border-2 border-violet-200 hover:border-violet-400 transition-colors text-left cursor-pointer">
            <input type="file" accept="video/*" onChange={handleUpload} className="hidden" />
            <div className="text-3xl mb-3">↑</div>
            <h3 className="text-lg font-semibold text-slate-900">Upload Video</h3>
            <p className="mt-1 text-sm text-slate-500">Upload an existing video file</p>
          </label>
        </div>
      )}

      {mode === 'record' && (
        <div className="mt-6">
          <button
            onClick={() => setMode('choose')}
            className="mb-4 text-sm text-brand-600 hover:text-brand-700"
          >
            &larr; Back
          </button>
          <VideoRecorder onRecordingComplete={handleRecordComplete} />
        </div>
      )}

      {mode === 'review' && videoBlob && (
        <div className="mt-6">
          <button
            onClick={() => { setMode('choose'); setVideoBlob(null); setVideoUrl('') }}
            className="mb-4 text-sm text-brand-600 hover:text-brand-700"
          >
            &larr; Start Over
          </button>
          <VideoReviewer videoUrl={videoUrl} videoBlob={videoBlob} />
        </div>
      )}
    </div>
  )
}
