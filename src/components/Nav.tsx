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
      <div className="max-w-2xl mx-auto px-5 flex items-center justify-between h-14">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight">
          Spykle
        </Link>
        <nav className="flex items-center gap-6">
          {links.slice(1).map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm ${
                pathname === link.href
                  ? 'text-black font-medium'
                  : 'text-stone hover:text-black'
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
