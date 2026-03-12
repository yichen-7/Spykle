export default function Dashboard() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-900">Welcome to Spykle</h1>
      <p className="mt-2 text-slate-600">
        Your AI-powered communication coach. Record yourself speaking, get instant feedback, and track your improvement over time.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <DashboardCard
          href="/record"
          title="Record & Analyze"
          description="Record your voice or video and get AI-powered feedback on tone, pace, volume, and articulation."
          icon="●"
          color="brand"
        />
        <DashboardCard
          href="/read"
          title="Read Aloud"
          description="Upload a PDF and read aloud. Get accuracy and fluency feedback compared to the original text."
          icon="≡"
          color="emerald"
        />
        <DashboardCard
          href="/review"
          title="Video Review"
          description="Upload or record video, add self-comments, and get AI analysis on your communication."
          icon="▶"
          color="violet"
        />
        <DashboardCard
          href="/practice"
          title="Daily Practice"
          description="Tongue twisters, exercises, and daily challenges to build your speaking skills."
          icon="★"
          color="amber"
        />
      </div>

      <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Quick Start</h2>
        <ol className="mt-3 space-y-2 text-slate-600">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-medium">1</span>
            <span>Go to <strong>Record</strong> and record yourself speaking for 30 seconds</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-medium">2</span>
            <span>Get instant AI feedback on your tone, pace, and clarity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-medium">3</span>
            <span>Check <strong>Progress</strong> to track your improvement over time</span>
          </li>
        </ol>
      </div>
    </div>
  )
}

function DashboardCard({
  href,
  title,
  description,
  icon,
  color,
}: {
  href: string
  title: string
  description: string
  icon: string
  color: string
}) {
  const colorMap: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-700 border-brand-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    violet: 'bg-violet-50 text-violet-700 border-violet-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  }

  return (
    <a
      href={href}
      className={`block p-6 rounded-xl border-2 transition-all hover:shadow-md ${colorMap[color]}`}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm opacity-80">{description}</p>
    </a>
  )
}
