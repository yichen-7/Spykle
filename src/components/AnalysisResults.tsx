'use client'

import type { AnalysisResult } from '@/types/analysis'

interface AnalysisResultsProps {
  result: AnalysisResult
}

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  return (
    <div className="space-y-6 mt-8">
      {/* Overall Score */}
      <div className="text-center py-8">
        <p className="text-6xl font-serif font-bold">{result.overallScore}</p>
        <p className="text-stone text-sm mt-2">out of 10</p>
      </div>

      {/* Category Scores */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Tone', score: result.scores.tone },
          { label: 'Volume', score: result.scores.volume },
          { label: 'Articulation', score: result.scores.articulation },
          { label: 'Pace', score: result.scores.pace },
        ].map(cat => (
          <div key={cat.label} className="bg-sand rounded-xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone">{cat.label}</p>
              <p className="font-serif font-bold text-lg">{cat.score}</p>
            </div>
            <div className="mt-2 bg-warm rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all"
                style={{ width: `${cat.score * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Focus Area */}
      <div className="border-l-2 border-black pl-5 py-1">
        <p className="text-xs text-stone uppercase tracking-wider">Focus area</p>
        <p className="font-serif font-bold text-lg mt-1">{result.focusArea}</p>
        <p className="text-stone mt-2 leading-relaxed text-sm">{result.focusAreaTip}</p>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="flex-1 bg-sand rounded-xl p-4 text-center">
          <p className="font-serif font-bold text-xl">{result.wordsPerMinute}</p>
          <p className="text-xs text-stone mt-1">Words per minute</p>
        </div>
        <div className="flex-1 bg-sand rounded-xl p-4 text-center">
          <p className="font-serif font-bold text-xl">
            {result.fillerWords.reduce((s, f) => s + f.count, 0)}
          </p>
          <p className="text-xs text-stone mt-1">Filler words</p>
        </div>
        {result.readingAccuracy !== undefined && (
          <div className="flex-1 bg-sand rounded-xl p-4 text-center">
            <p className="font-serif font-bold text-xl">{result.readingAccuracy}%</p>
            <p className="text-xs text-stone mt-1">Accuracy</p>
          </div>
        )}
      </div>

      {/* Filler Words */}
      {result.fillerWords.length > 0 && (
        <div>
          <p className="text-xs text-stone uppercase tracking-wider mb-3">Filler words detected</p>
          <div className="flex flex-wrap gap-2">
            {result.fillerWords.map(fw => (
              <span key={fw.word} className="px-3 py-1.5 bg-sand rounded-full text-sm">
                &ldquo;{fw.word}&rdquo; &times; {fw.count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      <div>
        <p className="text-xs text-stone uppercase tracking-wider mb-3">Feedback</p>
        <div className="space-y-3">
          {result.feedback.map((item, i) => (
            <div key={i} className="border-l border-gray-300 pl-4 py-1">
              <p className="text-xs text-stone uppercase tracking-wider">{item.category}</p>
              <p className="text-sm mt-1 leading-relaxed">{item.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transcript */}
      <details>
        <summary className="text-sm text-stone cursor-pointer hover:text-black transition-colors">
          View transcript
        </summary>
        <p className="text-sm text-stone leading-relaxed mt-3 bg-sand rounded-xl p-4">{result.transcript}</p>
      </details>
    </div>
  )
}
