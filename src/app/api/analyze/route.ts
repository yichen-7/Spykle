import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY || ''
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const referenceText = formData.get('referenceText') as string | null
    const mode = formData.get('mode') as string | null
    const userComments = formData.get('userComments') as string | null

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // Step 1: Upload audio to AssemblyAI
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer())
    const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: { authorization: ASSEMBLYAI_API_KEY },
      body: audioBuffer,
    })
    const { upload_url } = await uploadRes.json()

    // Step 2: Request transcription with features
    const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        authorization: ASSEMBLYAI_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: upload_url,
        sentiment_analysis: true,
        disfluencies: true,
      }),
    })
    const transcriptData = await transcriptRes.json()
    const transcriptId = transcriptData.id

    // Step 3: Poll for completion
    let transcript = null
    while (true) {
      const pollRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: { authorization: ASSEMBLYAI_API_KEY },
      })
      transcript = await pollRes.json()
      if (transcript.status === 'completed') break
      if (transcript.status === 'error') throw new Error('Transcription failed: ' + transcript.error)
      await new Promise(r => setTimeout(r, 2000))
    }

    // Step 4: Extract metrics
    const words = transcript.words || []
    const totalDurationMs = words.length > 0 ? words[words.length - 1].end - words[0].start : 1
    const totalDurationMin = totalDurationMs / 60000
    const wpm = Math.round(words.length / Math.max(totalDurationMin, 0.01))

    // Filler words detection
    const fillerWordsList = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'literally', 'so', 'right', 'well']
    const fillerCounts: Record<string, number> = {}
    const transcriptText = transcript.text || ''
    const lowerText = transcriptText.toLowerCase()
    for (const fw of fillerWordsList) {
      const regex = new RegExp(`\\b${fw}\\b`, 'gi')
      const matches = lowerText.match(regex)
      if (matches && matches.length > 0) {
        fillerCounts[fw] = matches.length
      }
    }

    // Sentiment analysis summary
    const sentiments = transcript.sentiment_analysis_results || []
    const sentimentSummary = sentiments.map((s: { text: string; sentiment: string; confidence: number }) =>
      `"${s.text}" -> ${s.sentiment} (${(s.confidence * 100).toFixed(0)}%)`
    ).join('\n')

    // Reading accuracy (if reference text provided)
    let readingAccuracy: number | undefined
    if (referenceText) {
      const refWords = referenceText.toLowerCase().split(/\s+/).filter(Boolean)
      const spokenWords = transcriptText.toLowerCase().split(/\s+/).filter(Boolean)
      let matches = 0
      const refSet = new Set(refWords)
      for (const w of spokenWords) {
        if (refSet.has(w)) matches++
      }
      readingAccuracy = Math.round((matches / Math.max(refWords.length, 1)) * 100)
    }

    // Step 5: Send to Gemini for comprehensive analysis
    const geminiPrompt = buildGeminiPrompt({
      transcriptText,
      wpm,
      fillerCounts,
      sentimentSummary,
      referenceText,
      readingAccuracy,
      mode,
      userComments,
    })

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: geminiPrompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      }
    )

    const geminiData = await geminiRes.json()
    const geminiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    let aiAnalysis
    try {
      aiAnalysis = JSON.parse(geminiText)
    } catch {
      aiAnalysis = {
        overallScore: 5,
        toneScore: 5,
        volumeScore: 5,
        articulationScore: 5,
        paceScore: 5,
        focusArea: 'General',
        focusAreaTip: 'Keep practicing regularly to improve.',
        feedback: [{ category: 'general', message: 'Analysis completed. Keep practicing!', severity: 'suggestion' }],
      }
    }

    // Step 6: Build response
    const result = {
      overallScore: aiAnalysis.overallScore || 5,
      scores: {
        tone: aiAnalysis.toneScore || 5,
        volume: aiAnalysis.volumeScore || 5,
        articulation: aiAnalysis.articulationScore || 5,
        pace: aiAnalysis.paceScore || 5,
      },
      transcript: transcriptText,
      fillerWords: Object.entries(fillerCounts).map(([word, count]) => ({ word, count })),
      wordsPerMinute: wpm,
      feedback: aiAnalysis.feedback || [],
      focusArea: aiAnalysis.focusArea || 'General',
      focusAreaTip: aiAnalysis.focusAreaTip || 'Keep practicing!',
      readingAccuracy,
    }

    // Save session to database for progress tracking
    try {
      await prisma.session.create({
        data: {
          mode: mode || 'record',
          overallScore: result.overallScore,
          toneScore: result.scores.tone,
          volumeScore: result.scores.volume,
          articulationScore: result.scores.articulation,
          paceScore: result.scores.pace,
          wordsPerMinute: result.wordsPerMinute,
          transcript: result.transcript,
          focusArea: result.focusArea,
          feedbackJson: JSON.stringify(result.feedback),
        },
      })
    } catch (dbError) {
      console.error('Failed to save session:', dbError)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}

function buildGeminiPrompt(params: {
  transcriptText: string
  wpm: number
  fillerCounts: Record<string, number>
  sentimentSummary: string
  referenceText: string | null
  readingAccuracy: number | undefined
  mode: string | null
  userComments: string | null
}) {
  const { transcriptText, wpm, fillerCounts, sentimentSummary, referenceText, readingAccuracy, mode, userComments } = params

  let prompt = `You are an expert speech coach analyzing a recording. Provide specific, actionable feedback.

TRANSCRIPT:
"${transcriptText}"

METRICS:
- Speaking pace: ${wpm} words per minute (ideal: 130-160 WPM)
- Filler words detected: ${JSON.stringify(fillerCounts)}

SENTIMENT ANALYSIS:
${sentimentSummary || 'Not available'}
`

  if (referenceText) {
    prompt += `
REFERENCE TEXT (what they were reading):
"${referenceText}"
Reading accuracy: ${readingAccuracy}%
`
  }

  if (mode === 'practice') {
    prompt += '\nThis is a practice exercise. Focus feedback on improvement and encouragement.\n'
  }

  if (userComments) {
    prompt += `
USER SELF-COMMENTS (the speaker noted these issues themselves):
${userComments}
Please address each of their self-identified concerns in your feedback.
`
  }

  prompt += `
Respond in this exact JSON format:
{
  "overallScore": <1-10>,
  "toneScore": <1-10>,
  "volumeScore": <1-10>,
  "articulationScore": <1-10>,
  "paceScore": <1-10>,
  "focusArea": "<the weakest area: Tone, Volume, Articulation, or Pace>",
  "focusAreaTip": "<one specific, actionable tip to improve the weakest area>",
  "feedback": [
    {
      "category": "<tone|volume|articulation|pace|general>",
      "message": "<specific feedback with concrete examples from the transcript>",
      "severity": "<positive|suggestion|warning>"
    }
  ]
}

Rules:
- Give 3-5 feedback items
- Be specific — reference actual words or phrases from the transcript
- Include at least one positive item
- Focus on the most impactful improvements
- If pace is too fast (>170 WPM) or too slow (<110 WPM), flag it
- Flag excessive filler words
- Evaluate tone consistency based on sentiment analysis`

  return prompt
}
