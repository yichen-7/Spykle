'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Dashboard', icon: '⌂' },
  { href: '/record', label: 'Record', icon: '●' },
  { href: '/read', label: 'Read Aloud', icon: '≡' },
  { href: '/review', label: 'Video Review', icon: '▶' },
  { href: '/practice', label: 'Practice', icon: '★' },
  { href: '/progress', label: 'Progress', icon: '↗' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-10">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-brand-700">Spykle</h1>
        <p className="text-sm text-slate-500 mt-1">Speak with confidence</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <div className="text-xs text-slate-400 text-center">Spykle v1.0</div>
      </div>
    </aside>
  )
}
