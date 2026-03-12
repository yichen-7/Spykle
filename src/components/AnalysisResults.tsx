'use client'

import type { AnalysisResult } from '@/types/analysis'

interface AnalysisResultsProps {
  result: AnalysisResult
}

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  const scoreColor = (score: number) =>
    score >= 7 ? 'text-green-600' : score >= 5 ? 'text-amber-600' : 'text-red-600'

  const scoreBg = (score: number) =>
    score >= 7 ? 'bg-green-100' : score >= 5 ? 'bg-amber-100' : 'bg-red-100'

  return (
    <div className="mt-8 space-y-6">
      {/* Overall Score */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 text-center">
        <p className="text-sm text-slate-500 uppercase tracking-wider">Overall Score</p>
        <p className={`text-6xl font-bold mt-2 ${scoreColor(result.overallScore)}`}>
          {result.overallScore}<span className="text-2xl text-slate-400">/10</span>
        </p>
      </div>

      {/* Category Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tone', score: result.scores.tone },
          { label: 'Volume', score: result.scores.volume },
          { label: 'Articulation', score: result.scores.articulation },
          { label: 'Pace', score: result.scores.pace },
        ].map(({ label, score }) => (
          <div key={label} className={`p-4 rounded-xl text-center ${scoreBg(score)}`}>
            <p className="text-sm text-slate-600">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${scoreColor(score)}`}>{score}</p>
          </div>
        ))}
      </div>

      {/* Focus Area */}
      <div className="p-5 bg-amber-50 border-2 border-amber-200 rounded-xl">
        <p className="text-sm font-semibold text-amber-800 uppercase tracking-wider">Focus On This</p>
        <p className="text-lg font-bold text-amber-900 mt-1">{result.focusArea}</p>
        <p className="text-amber-700 mt-1">{result.focusAreaTip}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Speaking Pace</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{result.wordsPerMinute} <span className="text-sm font-normal text-slate-400">WPM</span></p>
          <p className="text-xs text-slate-400 mt-1">Ideal: 130-160 WPM</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Filler Words</p>
          {result.fillerWords.length > 0 ? (
            <div className="mt-1 flex flex-wrap gap-2">
              {result.fillerWords.map(fw => (
                <span key={fw.word} className="px-2 py-1 bg-red-50 text-red-600 rounded text-sm font-medium">
                  &ldquo;{fw.word}&rdquo; x{fw.count}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-lg font-bold text-green-600 mt-1">None detected!</p>
          )}
        </div>
      </div>

      {/* Reading Accuracy */}
      {result.readingAccuracy !== undefined && (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Reading Accuracy</p>
          <p className={`text-3xl font-bold mt-1 ${scoreColor(result.readingAccuracy / 10)}`}>
            {result.readingAccuracy}%
          </p>
        </div>
      )}

      {/* Feedback Items */}
      <div className="p-6 bg-white rounded-xl border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Detailed Feedback</h3>
        <div className="space-y-3">
          {result.feedback.map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border-l-4 ${
                item.severity === 'positive' ? 'bg-green-50 border-green-400' :
                item.severity === 'warning' ? 'bg-red-50 border-red-400' :
                'bg-blue-50 border-blue-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-medium uppercase ${
                  item.severity === 'positive' ? 'text-green-600' :
                  item.severity === 'warning' ? 'text-red-600' :
                  'text-blue-600'
                }`}>
                  {item.category}
                </span>
                {item.timestamp && (
                  <span className="text-xs text-slate-400">at {item.timestamp}</span>
                )}
              </div>
              <p className="text-slate-700">{item.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transcript */}
      <div className="p-6 bg-white rounded-xl border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Transcript</h3>
        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{result.transcript}</p>
      </div>
    </div>
  )
}
