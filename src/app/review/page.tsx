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
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-xl font-bold text-silver-100">Video Review</h1>
        <p className="text-sm text-silver-500 mt-1">Record, comment, and analyze</p>
      </div>

      {mode === 'choose' && (
        <div className="space-y-3">
          <button onClick={() => setMode('record')} className="btn-rose w-full">
            Record Video
          </button>
          <label className="btn-secondary w-full block text-center cursor-pointer">
            <input type="file" accept="video/*" onChange={handleUpload} className="hidden" />
            Upload Video
          </label>
        </div>
      )}

      {mode === 'record' && (
        <div className="space-y-4">
          <button
            onClick={() => setMode('choose')}
            className="text-sm text-aqua-400 hover:text-aqua-300 font-semibold transition-colors"
          >
            &larr; Back
          </button>
          <div className="glass-card">
            <VideoRecorder onRecordingComplete={handleRecordComplete} />
          </div>
        </div>
      )}

      {mode === 'review' && videoBlob && (
        <div className="space-y-4">
          <button
            onClick={() => { setMode('choose'); setVideoBlob(null); setVideoUrl('') }}
            className="text-sm text-aqua-400 hover:text-aqua-300 font-semibold transition-colors"
          >
            &larr; Start Over
          </button>
          <VideoReviewer videoUrl={videoUrl} videoBlob={videoBlob} />
        </div>
      )}
    </div>
  )
}
