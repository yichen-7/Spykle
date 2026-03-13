'use client'

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

  return (
    <header className="border-b border-gray-200 bg-cream sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-8 flex items-center justify-between h-20">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-gray-900">
          Spykle
        </Link>
        <nav className="flex items-center gap-8">
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
      </div>
    </header>
  )
}
