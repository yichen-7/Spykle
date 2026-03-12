export interface AnalysisResult {
  overallScore: number
  scores: {
    tone: number
    volume: number
    articulation: number
    pace: number
  }
  transcript: string
  fillerWords: { word: string; count: number }[]
  wordsPerMinute: number
  feedback: FeedbackItem[]
  focusArea: string
  focusAreaTip: string
  readingAccuracy?: number
}

export interface FeedbackItem {
  category: 'tone' | 'volume' | 'articulation' | 'pace' | 'general'
  message: string
  timestamp?: string
  severity: 'positive' | 'suggestion' | 'warning'
}

export interface UserComment {
  id: string
  timestamp: number
  text: string
}
