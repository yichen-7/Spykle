'use client'

import type { AnalysisResult } from '@/types/analysis'

interface AnalysisResultsProps {
  result: AnalysisResult
}

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  const xpEarned = Math.round(result.overallScore * 10)

  return (
    <div className="space-y-4">
      {/* XP Earned Banner */}
      <div className="glass-card text-center" style={{
        background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.15), rgba(91, 141, 239, 0.15))',
        borderColor: 'rgba(78, 205, 196, 0.2)',
      }}>
        <p className="text-3xl font-bold text-aqua-400">+{xpEarned} XP</p>
        <p className="text-sm text-silver-400">Session Complete</p>
      </div>

      {/* Overall Score Circle */}
      <div className="glass-card text-center">
        <div className="relative w-28 h-28 mx-auto">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(160, 170, 191, 0.1)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={result.overallScore >= 7 ? '#4ECDC4' : result.overallScore >= 5 ? '#F0B840' : '#E85D75'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${result.overallScore * 26.4} 264`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-silver-100">{result.overallScore}</span>
          </div>
        </div>
        <p className="text-xs font-semibold text-silver-500 mt-2 uppercase tracking-wider">Overall Score</p>
      </div>

      {/* Category Scores */}
      <div className="grid grid-cols-2 gap-3">
        <ScoreCard label="Tone" score={result.scores.tone} color="#9B7AEF" />
        <ScoreCard label="Volume" score={result.scores.volume} color="#5B8DEF" />
        <ScoreCard label="Articulation" score={result.scores.articulation} color="#F0B840" />
        <ScoreCard label="Pace" score={result.scores.pace} color="#4ECDC4" />
      </div>

      {/* Focus Area */}
      <div className="glass-card" style={{ borderLeft: '3px solid #F0B840' }}>
        <p className="text-xs font-semibold text-silver-500 uppercase tracking-wider mb-2">Focus Area</p>
        <p className="font-semibold text-silver-100">{result.focusArea}</p>
        <p className="text-sm text-silver-400 mt-2 leading-relaxed">{result.focusAreaTip}</p>
      </div>

      {/* Quick Stats */}
      <div className="flex gap-3">
        <div className="glass-card-light flex-1 text-center py-3">
          <p className="text-xl font-bold text-soft-blue">{result.wordsPerMinute}</p>
          <p className="text-[10px] font-semibold text-silver-500 uppercase">WPM</p>
        </div>
        <div className="glass-card-light flex-1 text-center py-3">
          <p className="text-xl font-bold text-amber-400">
            {result.fillerWords.reduce((s, f) => s + f.count, 0)}
          </p>
          <p className="text-[10px] font-semibold text-silver-500 uppercase">Fillers</p>
        </div>
        {result.readingAccuracy !== undefined && (
          <div className="glass-card-light flex-1 text-center py-3">
            <p className="text-xl font-bold text-aqua-400">{result.readingAccuracy}%</p>
            <p className="text-[10px] font-semibold text-silver-500 uppercase">Accuracy</p>
          </div>
        )}
      </div>

      {/* Filler Words */}
      {result.fillerWords.length > 0 && (
        <div className="glass-card">
          <p className="text-xs font-semibold text-silver-500 uppercase tracking-wider mb-3">Filler Words</p>
          <div className="flex flex-wrap gap-2">
            {result.fillerWords.map(fw => (
              <span key={fw.word} className="px-3 py-1.5 rounded-xl text-sm font-semibold" style={{
                background: 'rgba(232, 93, 117, 0.1)',
                color: '#F07088',
              }}>
                &ldquo;{fw.word}&rdquo; x{fw.count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Items */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-silver-500 uppercase tracking-wider">Detailed Feedback</p>
        {result.feedback.map((item, i) => (
          <div
            key={i}
            className="glass-card-light"
            style={{
              borderLeft: `3px solid ${
                item.severity === 'positive' ? '#4ECDC4' :
                item.severity === 'warning' ? '#E85D75' : '#5B8DEF'
              }`,
            }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{
              color: item.severity === 'positive' ? '#4ECDC4' :
                     item.severity === 'warning' ? '#E85D75' : '#5B8DEF'
            }}>{item.category}</span>
            <p className="text-sm text-silver-300 mt-1">{item.message}</p>
          </div>
        ))}
      </div>

      {/* Transcript */}
      <details className="glass-card">
        <summary className="text-xs font-semibold text-silver-500 uppercase tracking-wider cursor-pointer">
          View Transcript
        </summary>
        <p className="text-sm text-silver-400 leading-relaxed mt-3">{result.transcript}</p>
      </details>
    </div>
  )
}

function ScoreCard({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="glass-card-light text-center py-3">
      <div className="mt-1 bg-navy-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score * 10}%`, background: color }}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-silver-500">{label}</p>
        <p className="text-sm font-bold" style={{ color }}>{score}/10</p>
      </div>
    </div>
  )
}
