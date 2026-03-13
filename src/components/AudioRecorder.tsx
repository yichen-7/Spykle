'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string>('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animFrameRef = useRef<number>(0)

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteTimeDomainData(dataArray)

    ctx.fillStyle = '#FAF8F5'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 2
    ctx.strokeStyle = '#1a1a1a'
    ctx.beginPath()

    const sliceWidth = canvas.width / bufferLength
    let x = 0
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0
      const y = (v * canvas.height) / 2
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
      x += sliceWidth
    }
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()

    animFrameRef.current = requestAnimationFrame(drawWaveform)
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 2048
      source.connect(analyser)
      analyserRef.current = analyser

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        onRecordingComplete(blob)
        stream.getTracks().forEach(t => t.stop())
        audioCtx.close()
      }

      mediaRecorder.start(250)
      setIsRecording(true)
      setIsPaused(false)
      setDuration(0)
      setAudioUrl('')
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
      drawWaveform()
    } catch (err) {
      console.error('Microphone access denied:', err)
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    setIsPaused(false)
    if (timerRef.current) clearInterval(timerRef.current)
    cancelAnimationFrame(animFrameRef.current)
  }

  const togglePause = () => {
    if (!mediaRecorderRef.current) return
    if (isPaused) {
      mediaRecorderRef.current.resume()
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
      drawWaveform()
    } else {
      mediaRecorderRef.current.pause()
      if (timerRef.current) clearInterval(timerRef.current)
      cancelAnimationFrame(animFrameRef.current)
    }
    setIsPaused(!isPaused)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600}
        height={80}
        className="w-full h-16 rounded-lg bg-cream mb-4"
      />

      {isRecording && (
        <div className="text-center mb-4">
          <span className="text-3xl font-serif font-bold">{formatTime(duration)}</span>
          <p className="text-sm text-stone mt-1">{isPaused ? 'Paused' : 'Recording...'}</p>
        </div>
      )}

      <div className="flex justify-center gap-3">
        {!isRecording ? (
          <button onClick={startRecording} className="w-full bg-black text-white rounded-full py-3 px-6 text-sm font-medium hover:bg-gray-800 transition-colors">
            Start recording
          </button>
        ) : (
          <>
            <button onClick={togglePause} className="flex-1 border border-gray-300 rounded-full py-3 px-6 text-sm font-medium hover:bg-gray-50 transition-colors">
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={stopRecording} className="flex-1 bg-black text-white rounded-full py-3 px-6 text-sm font-medium hover:bg-gray-800 transition-colors">
              Stop
            </button>
          </>
        )}
      </div>

      {audioUrl && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  )
}
