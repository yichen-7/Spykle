'use client'

import { useState, useRef, useEffect } from 'react'

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob) => void
}

export default function VideoRecorder({ onRecordingComplete }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [recordedUrl, setRecordedUrl] = useState<string>('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const playbackRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Camera access denied:', err)
    }
  }

  const startRecording = () => {
    if (!streamRef.current) return
    const mediaRecorder = new MediaRecorder(streamRef.current)
    mediaRecorderRef.current = mediaRecorder
    chunksRef.current = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      setRecordedUrl(url)
      onRecordingComplete(blob)
      streamRef.current?.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }

    mediaRecorder.start(250)
    setIsRecording(true)
    setDuration(0)
    setRecordedUrl('')
    timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  useEffect(() => {
    startCamera()
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200">
      {!recordedUrl ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded-lg bg-black aspect-video"
        />
      ) : (
        <video
          ref={playbackRef}
          controls
          src={recordedUrl}
          className="w-full rounded-lg bg-black aspect-video"
        />
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!isRecording && !recordedUrl && (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <span className="w-3 h-3 bg-white rounded-full"></span>
              Record
            </button>
          )}
          {isRecording && (
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors"
            >
              Stop Recording
            </button>
          )}
          {recordedUrl && (
            <button
              onClick={() => { setRecordedUrl(''); startCamera() }}
              className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
            >
              Record Again
            </button>
          )}
        </div>

        {isRecording && (
          <span className="flex items-center gap-2 text-lg font-mono text-slate-600">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {formatTime(duration)}
          </span>
        )}
      </div>
    </div>
  )
}
