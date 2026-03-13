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
    <div>
      {!recordedUrl ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded-xl bg-navy-900 aspect-video"
        />
      ) : (
        <video
          ref={playbackRef}
          controls
          src={recordedUrl}
          className="w-full rounded-xl bg-navy-900 aspect-video"
        />
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {!isRecording && !recordedUrl && (
            <button onClick={startRecording} className="btn-rose w-full">
              Record
            </button>
          )}
          {isRecording && (
            <button onClick={stopRecording} className="btn-primary w-full">
              Stop Recording
            </button>
          )}
          {recordedUrl && (
            <button
              onClick={() => { setRecordedUrl(''); startCamera() }}
              className="btn-secondary w-full"
            >
              Record Again
            </button>
          )}
        </div>

        {isRecording && (
          <span className="flex items-center gap-2 text-lg font-mono text-silver-300 ml-4">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            {formatTime(duration)}
          </span>
        )}
      </div>
    </div>
  )
}
