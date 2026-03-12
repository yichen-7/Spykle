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
    <div className="space-y-6">
      <video ref={videoRef} controls src={videoUrl} className="w-full rounded-lg bg-black aspect-video" />

      {/* Comment Input */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <p className="text-sm text-slate-500 mb-2">
          Pause the video at any point and add a comment about what you notice.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addComment()}
            placeholder="e.g. I think I'm mumbling here..."
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            onClick={addComment}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            Add Comment
          </button>
        </div>
      </div>

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Your Comments ({comments.length})</h3>
          <div className="space-y-2">
            {comments.map(c => (
              <div key={c.id} className="flex items-start gap-3 p-2 rounded hover:bg-slate-50">
                <button
                  onClick={() => seekTo(c.timestamp)}
                  className="text-xs font-mono text-brand-600 hover:text-brand-700 whitespace-nowrap mt-0.5"
                >
                  {formatTime(c.timestamp)}
                </button>
                <p className="text-sm text-slate-700">{c.text}</p>
                <button
                  onClick={() => setComments(prev => prev.filter(x => x.id !== c.id))}
                  className="text-xs text-slate-400 hover:text-red-500 ml-auto"
                >
                  remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analyze Button */}
      <button
        onClick={analyzeVideo}
        disabled={analyzing}
        className="w-full py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
      >
        {analyzing ? 'Analyzing...' : 'Analyze Video'}
      </button>

      {analyzing && (
        <div className="p-8 bg-white rounded-xl border border-slate-200 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-slate-600">Analyzing your video...</p>
        </div>
      )}

      {analysis && <AnalysisResults result={analysis} />}
    </div>
  )
}
