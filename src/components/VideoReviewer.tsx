'use client'

import { useState, useRef } from 'react'
import AnalysisResults from './AnalysisResults'
import type { AnalysisResult, UserComment } from '@/types/analysis'

interface VideoReviewerProps {
  videoUrl: string
  videoBlob: Blob
}

export default function VideoReviewer({ videoUrl, videoBlob }: VideoReviewerProps) {
  const [comments, setComments] = useState<UserComment[]>([])
  const [commentText, setCommentText] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const addComment = () => {
    if (!commentText.trim() || !videoRef.current) return
    const newComment: UserComment = {
      id: Date.now().toString(),
      timestamp: videoRef.current.currentTime,
      text: commentText.trim(),
    }
    setComments(prev => [...prev, newComment].sort((a, b) => a.timestamp - b.timestamp))
    setCommentText('')
  }

  const seekTo = (time: number) => {
    if (videoRef.current) videoRef.current.currentTime = time
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`

  const analyzeVideo = async () => {
    setAnalyzing(true)
    setAnalysis(null)
    try {
      const formData = new FormData()
      formData.append('audio', videoBlob, 'video.webm')
      formData.append('mode', 'review')
      if (comments.length > 0) {
        formData.append('userComments', JSON.stringify(comments.map(c => ({
          timestamp: formatTime(c.timestamp),
          text: c.text,
        }))))
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
    <div className="space-y-4">
      <video ref={videoRef} controls src={videoUrl} className="w-full rounded-xl bg-black aspect-video" />

      <div className="bg-sand rounded-2xl p-5">
        <p className="text-xs text-stone mb-2">Pause and add comments about what you notice</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addComment()}
            placeholder="e.g. I'm mumbling here..."
            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-gray-400"
          />
          <button onClick={addComment} className="bg-black text-white rounded-full py-2.5 px-5 text-sm font-medium">
            Add
          </button>
        </div>
      </div>

      {comments.length > 0 && (
        <div>
          <p className="text-xs text-stone uppercase tracking-wider mb-2">Your comments ({comments.length})</p>
          <div className="space-y-2">
            {comments.map(c => (
              <div key={c.id} className="flex items-start gap-3 bg-sand rounded-xl p-3">
                <button onClick={() => seekTo(c.timestamp)} className="text-xs font-mono text-stone hover:text-black transition-colors whitespace-nowrap mt-0.5">
                  {formatTime(c.timestamp)}
                </button>
                <p className="text-sm flex-1">{c.text}</p>
                <button onClick={() => setComments(prev => prev.filter(x => x.id !== c.id))} className="text-xs text-stone hover:text-black transition-colors">
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={analyzeVideo} disabled={analyzing} className="w-full bg-black text-white rounded-full py-3 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
        {analyzing ? 'Analyzing...' : 'Analyze video'}
      </button>

      {analyzing && (
        <div className="text-center py-8">
          <p className="text-stone">Analyzing your video...</p>
        </div>
      )}

      {analysis && <AnalysisResults result={analysis} />}
    </div>
  )
}
