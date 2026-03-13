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
      <video ref={videoRef} controls src={videoUrl} className="w-full rounded-2xl bg-navy-900 aspect-video" />

      {/* Comment Input */}
      <div className="glass-card">
        <p className="text-xs text-silver-500 mb-2 font-semibold">Pause and add comments about what you notice</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addComment()}
            placeholder="e.g. I'm mumbling here..."
            className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-aqua-400/50 text-silver-200 placeholder-silver-600"
            style={{ background: 'rgba(17, 28, 50, 0.8)', border: '1px solid rgba(160, 170, 191, 0.1)' }}
          />
          <button onClick={addComment} className="btn-primary !py-2.5 !px-4 text-sm">
            Add
          </button>
        </div>
      </div>

      {/* Comments */}
      {comments.length > 0 && (
        <div className="glass-card">
          <p className="text-xs font-semibold text-silver-500 uppercase tracking-wider mb-2">Your Comments ({comments.length})</p>
          <div className="space-y-2">
            {comments.map(c => (
              <div key={c.id} className="flex items-start gap-3 p-2 rounded-lg" style={{ background: 'rgba(17, 28, 50, 0.4)' }}>
                <button onClick={() => seekTo(c.timestamp)} className="text-xs font-mono text-aqua-400 font-semibold whitespace-nowrap mt-0.5">
                  {formatTime(c.timestamp)}
                </button>
                <p className="text-sm text-silver-300 flex-1">{c.text}</p>
                <button onClick={() => setComments(prev => prev.filter(x => x.id !== c.id))} className="text-xs text-silver-600 hover:text-rose-400 font-semibold transition-colors">
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={analyzeVideo} disabled={analyzing} className="btn-primary w-full disabled:opacity-50">
        {analyzing ? 'Analyzing...' : 'Analyze Video'}
      </button>

      {analyzing && (
        <div className="glass-card text-center py-8">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-aqua-400 border-t-transparent animate-spin" />
          <p className="font-semibold text-silver-300">Analyzing your video...</p>
        </div>
      )}

      {analysis && <AnalysisResults result={analysis} />}
    </div>
  )
}
