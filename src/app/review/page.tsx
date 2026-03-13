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
    <div className="pt-8">
      <h1 className="font-serif text-3xl font-bold">Video Review</h1>
      <p className="text-stone mt-2">Record or upload a video, add comments, and get analysis.</p>

      {mode === 'choose' && (
        <div className="mt-8 space-y-3">
          <button onClick={() => setMode('record')} className="w-full bg-black text-white rounded-full py-3 px-6 text-sm font-medium hover:bg-gray-800 transition-colors">
            Record video
          </button>
          <label className="w-full border border-gray-300 rounded-full py-3 px-6 text-sm font-medium hover:bg-gray-50 transition-colors block text-center cursor-pointer">
            <input type="file" accept="video/*" onChange={handleUpload} className="hidden" />
            Upload video
          </label>
        </div>
      )}

      {mode === 'record' && (
        <div className="mt-8 space-y-4">
          <button
            onClick={() => setMode('choose')}
            className="text-sm text-stone hover:text-black transition-colors"
          >
            &larr; Back
          </button>
          <div className="bg-sand rounded-2xl p-6">
            <VideoRecorder onRecordingComplete={handleRecordComplete} />
          </div>
        </div>
      )}

      {mode === 'review' && videoBlob && (
        <div className="mt-8 space-y-4">
          <button
            onClick={() => { setMode('choose'); setVideoBlob(null); setVideoUrl('') }}
            className="text-sm text-stone hover:text-black transition-colors"
          >
            &larr; Start over
          </button>
          <VideoReviewer videoUrl={videoUrl} videoBlob={videoBlob} />
        </div>
      )}
    </div>
  )
}
