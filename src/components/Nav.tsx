'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/record', label: 'Record' },
  { href: '/practice', label: 'Practice' },
  { href: '/read', label: 'Read' },
  { href: '/review', label: 'Review' },
  { href: '/progress', label: 'Progress' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-gray-200 bg-cream sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 sm:h-20">
        <Link href="/" className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
          Spykle
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-8">
          {links.slice(1).map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base ${
                pathname === link.href
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-500 hover:text-gray-900'
              } transition-colors`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden p-2 -mr-2"
          aria-label="Menu"
        >
          <div className="w-5 flex flex-col gap-1">
            <span className={`block h-0.5 bg-gray-900 transition-all ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block h-0.5 bg-gray-900 transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-gray-900 transition-all ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="sm:hidden border-t border-gray-200 bg-cream">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-5 py-3 text-sm ${
                pathname === link.href
                  ? 'text-gray-900 font-medium bg-sand'
                  : 'text-gray-500'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
