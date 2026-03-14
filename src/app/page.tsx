'use client'

import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="pt-8 sm:pt-12">
      <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
        Spykle
      </h1>
      <p className="text-base sm:text-lg text-stone mt-3 sm:mt-4 max-w-md leading-relaxed">
        Train your speaking voice. Record yourself, get AI feedback, and improve over time.
      </p>

      <div className="mt-8 sm:mt-12 bg-sand rounded-2xl p-5 sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold">Start training</h2>
            <p className="text-stone mt-2 max-w-sm">
              Record a speech, practice with exercises, or read aloud from a text.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/record">
            <div className="bg-warm/50 rounded-xl p-5 hover:bg-warm/70 transition-colors">
              <p className="text-xs text-stone uppercase tracking-wider">Record</p>
              <p className="font-serif text-lg font-bold mt-1">Record & Analyze</p>
              <p className="text-sm text-stone mt-2">Speak freely and get feedback</p>
              <p className="mt-4 text-stone">&rarr;</p>
            </div>
          </Link>
          <Link href="/practice">
            <div className="bg-warm/50 rounded-xl p-5 hover:bg-warm/70 transition-colors">
              <p className="text-xs text-stone uppercase tracking-wider">Practice</p>
              <p className="font-serif text-lg font-bold mt-1">Daily Exercises</p>
              <p className="text-sm text-stone mt-2">Philosophy, topics & twisters</p>
              <p className="mt-4 text-stone">&rarr;</p>
            </div>
          </Link>
          <Link href="/read">
            <div className="bg-warm/50 rounded-xl p-5 hover:bg-warm/70 transition-colors">
              <p className="text-xs text-stone uppercase tracking-wider">Read</p>
              <p className="font-serif text-lg font-bold mt-1">Read Aloud</p>
              <p className="text-sm text-stone mt-2">Upload a text and read it out loud</p>
              <p className="mt-4 text-stone">&rarr;</p>
            </div>
          </Link>
          <Link href="/review">
            <div className="bg-warm/50 rounded-xl p-5 hover:bg-warm/70 transition-colors">
              <p className="text-xs text-stone uppercase tracking-wider">Review</p>
              <p className="font-serif text-lg font-bold mt-1">Video Review</p>
              <p className="text-sm text-stone mt-2">Watch yourself and get notes</p>
              <p className="mt-4 text-stone">&rarr;</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/progress" className="inline-flex items-center gap-2 text-sm text-stone hover:text-black transition-colors border border-gray-300 rounded-full px-5 py-2.5">
          View your progress &rarr;
        </Link>
      </div>
    </div>
  )
}
