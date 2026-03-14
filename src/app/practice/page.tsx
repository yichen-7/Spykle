'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import AudioRecorder from '@/components/AudioRecorder'
import AnalysisResults from '@/components/AnalysisResults'
import { tongueTwisters, getDailyQuote } from '@/lib/exercises'
import type { AnalysisResult } from '@/types/analysis'

export default function PracticePage() {
  const [tab, setTab] = useState<'philosophy' | 'daily' | 'twisters'>('philosophy')
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  // Personalized topic state
  const [interests, setInterests] = useState<string>('')
  const [interestsSaved, setInterestsSaved] = useState(false)
  const [interestsInput, setInterestsInput] = useState('')
  const [topic, setTopic] = useState<{ topic: string; context: string } | null>(null)
  const [loadingTopic, setLoadingTopic] = useState(false)

  const todayQuote = useMemo(() => getDailyQuote(), [])

  // Load saved interests on mount
  useEffect(() => {
    const saved = localStorage.getItem('spykle-interests')
    if (saved) {
      setInterests(saved)
      setInterestsSaved(true)
    }
  }, [])

  // Load cached topic or generate new one
  const generateTopic = useCallback(async (userInterests: string) => {
    const today = new Date().toISOString().split('T')[0]
    const cacheKey = `spykle-topic-${today}`
    const cached = localStorage.getItem(cacheKey)

    if (cached) {
      setTopic(JSON.parse(cached))
      return
    }

    setLoadingTopic(true)
    try {
      const res = await fetch('/api/generate-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests: userInterests }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setTopic(data)
      localStorage.setItem(cacheKey, JSON.stringify(data))
    } catch {
      setTopic({ topic: 'Talk about something you learned recently that surprised you.', context: 'Fallback topic' })
    } finally {
      setLoadingTopic(false)
    }
  }, [])

  // Generate topic when interests are available and tab is daily
  useEffect(() => {
    if (interestsSaved && interests && tab === 'daily' && !topic) {
      generateTopic(interests)
    }
  }, [interestsSaved, interests, tab, topic, generateTopic])

  const saveInterests = () => {
    if (!interestsInput.trim()) return
    const val = interestsInput.trim()
    localStorage.setItem('spykle-interests', val)
    setInterests(val)
    setInterestsSaved(true)
    generateTopic(val)
  }

  const resetInterests = () => {
    localStorage.removeItem('spykle-interests')
    // Clear all cached topics
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key?.startsWith('spykle-topic-')) localStorage.removeItem(key)
    }
    setInterests('')
    setInterestsSaved(false)
    setInterestsInput('')
    setTopic(null)
  }

  const newTopic = async () => {
    const today = new Date().toISOString().split('T')[0]
    localStorage.removeItem(`spykle-topic-${today}`)
    setTopic(null)
    await generateTopic(interests)
  }

  const handleRecordingComplete = async (blob: Blob) => {
    setAnalyzing(true)
    setAnalysis(null)
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'practice.webm')
      if (selectedExercise) {
        formData.append('referenceText', selectedExercise)
        formData.append('mode', 'practice')
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
    <div className="pt-8">
      <h1 className="font-serif text-3xl font-bold">Practice</h1>
      <p className="text-stone mt-2">Train your speaking skills with daily exercises.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {(['philosophy', 'daily', 'twisters'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
              tab === t ? 'bg-black text-white' : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {t === 'daily' ? 'Topic' : t}
          </button>
        ))}
      </div>

      {/* Philosophy */}
      {tab === 'philosophy' && (
        <div className="mt-8 space-y-6">
          <div className="border-l-2 border-black pl-5">
            <p className="text-xs text-stone uppercase tracking-wider">Today&apos;s quote</p>
            <p className="font-serif text-xl font-bold mt-2 leading-relaxed italic">
              &ldquo;{todayQuote.quote}&rdquo;
            </p>
            <p className="mt-3 text-sm">
              <span className="font-medium">{todayQuote.author}</span>
              <span className="text-stone"> &middot; {todayQuote.context}</span>
            </p>
          </div>
          <p className="text-sm text-stone">Explain what this quote means in one full minute.</p>
          <div className="bg-sand rounded-2xl p-6">
            <AudioRecorder
              onRecordingComplete={(blob) => {
                setSelectedExercise(todayQuote.quote)
                handleRecordingComplete(blob)
              }}
            />
          </div>
        </div>
      )}

      {/* Daily Topic — personalized */}
      {tab === 'daily' && (
        <div className="mt-8 space-y-6">
          {!interestsSaved ? (
            <div>
              <p className="font-serif text-xl font-bold">What are you into?</p>
              <p className="text-sm text-stone mt-2">
                Tell me your hobbies, favorite shows, topics you care about — I&apos;ll
                generate speaking topics you&apos;ll actually want to talk about.
              </p>
              <textarea
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                placeholder="e.g. basketball, anime, philosophy, history, Breaking Bad, startups, cooking..."
                className="mt-4 w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-gray-400 resize-none h-24"
              />
              <button
                onClick={saveInterests}
                className="mt-3 bg-black text-white rounded-full py-3 px-6 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Save
              </button>
            </div>
          ) : loadingTopic ? (
            <div className="text-center py-8">
              <p className="text-stone">Generating your topic...</p>
            </div>
          ) : topic ? (
            <>
              <div className="border-l-2 border-black pl-5">
                <p className="text-xs text-stone uppercase tracking-wider">Today&apos;s topic</p>
                <p className="font-serif text-xl font-bold mt-2">&ldquo;{topic.topic}&rdquo;</p>
                <p className="text-sm text-stone mt-2">{topic.context}</p>
              </div>
              <p className="text-sm text-stone">Talk about this for one full minute.</p>
              <div className="bg-sand rounded-2xl p-6">
                <AudioRecorder
                  onRecordingComplete={(blob) => {
                    setSelectedExercise(topic.topic)
                    handleRecordingComplete(blob)
                  }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={newTopic}
                  className="text-sm text-stone hover:text-black transition-colors"
                >
                  Different topic
                </button>
                <span className="text-stone">&middot;</span>
                <button
                  onClick={resetInterests}
                  className="text-sm text-stone hover:text-black transition-colors"
                >
                  Change interests
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Tongue Twisters */}
      {tab === 'twisters' && (
        <div className="mt-8 space-y-4">
          {tongueTwisters.map((twister, i) => (
            <div key={i} className="bg-sand rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-stone">{twister.difficulty}</span>
                <span className="text-xs text-stone">{twister.targetSound}</span>
              </div>
              <p className="font-medium">{twister.text}</p>
              <button
                onClick={() => setSelectedExercise(twister.text)}
                className="mt-3 text-sm text-stone hover:text-black transition-colors"
              >
                Practice this &rarr;
              </button>
            </div>
          ))}

          {selectedExercise && (
            <div className="border border-gray-300 rounded-2xl p-6">
              <p className="text-xs text-stone uppercase tracking-wider mb-1">Practicing</p>
              <p className="italic mb-4">&ldquo;{selectedExercise}&rdquo;</p>
              <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            </div>
          )}
        </div>
      )}

      {analyzing && (
        <div className="mt-8 text-center py-8">
          <p className="text-stone">Analyzing...</p>
        </div>
      )}

      {analysis && <AnalysisResults result={analysis} />}
    </div>
  )
}
