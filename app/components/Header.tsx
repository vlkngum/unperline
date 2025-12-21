'use client'

import { Search, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { handleSignOut } from '@/app/lib/actions'
import AuthModal from './AuthModal'

interface HeaderProps {
  user?: {
    name: string
    avatar?: string
  } | null
}

const LogoIcon = () => (
  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-2 box-border">
    <BookOpen className="w-full h-full text-[#8B4513]" strokeWidth={2.5} />
  </div>
)

export default function Header({ user }: HeaderProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <nav className="text-white py-5 px-6 flex justify-between items-center w-full relative">
      <div className="flex w-full max-w-7xl justify-between items-center mx-auto">
        <Link href="/">
          <div className="flex items-center gap-3">
            <LogoIcon />
            <span className="text-2xl font-semibold tracking-wide">Unperline</span>
          </div>
        </Link>

        <div className="flex items-center gap-6 relative">
          {!user && (
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => {
                  setAuthMode('login')
                  setAuthOpen(true)
                }}
                className="text-lg font-bold text-white transition-colors hover:text-neutral-300"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setAuthMode('register')
                  setAuthOpen(true)
                }}
                className="text-lg font-bold text-white transition-colors hover:text-neutral-300"
              >
                Register
              </button>
            </div>
          )}

          <div className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-lg font-semibold text-white transition-colors">
              Books
            </Link>
            <Link href="/members" className="flex items-center text-lg font-semibold text-white transition-colors">
              Connect +
            </Link>
          </div>

          <form className="group flex items-center" role="search" onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-0 group-hover:w-40 focus:w-40 transition-all duration-300 ease-in-out bg-neutral-800 rounded-l-md p-2 text-sm outline-none text-white"
            />
            <button
              type="submit"
              className="cursor-pointer bg-neutral-800 p-2 rounded-r-md transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5 text-gray-400" />
            </button>
          </form>

          {user && (
            <div
              className="relative overflow-visible z-50"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              <Link
                href={`/p/${encodeURIComponent(user.name || "me")}`}
                title={user.name || "Profilim"}
              >
                <img
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  src={user.avatar || '/dex.png'}
                  alt="User Avatar"
                />
              </Link>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 bg-neutral-900 shadow-xl rounded-xl py-2 px-4 border border-neutral-700/30 w-min flex-nowrap text-nowrap"
                  >
                    <Link
                      href={`/p/${encodeURIComponent(user.name || "me")}`}
                      className="block py-2 text-sm hover:text-neutral-300"
                      title={user.name || "Profilim"}>
                      Hesabım
                    </Link>
                    <Link
                      href={`/p/${encodeURIComponent(user.name || "me")}/books`}
                      className="block py-2 text-sm hover:text-neutral-300"
                    >
                      Kitaplarım
                    </Link>
                    <Link href="/likes" className="block py-2 text-sm hover:text-neutral-300">
                      Beğenilerim
                    </Link>
                    <button
                      onClick={() => handleSignOut()}
                      className="block py-2 text-sm hover:text-neutral-300 w-full text-left"
                    >
                      Çıkış Yap
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <AuthModal
            isOpen={authOpen}
            onClose={() => setAuthOpen(false)}
            initialMode={authMode}
          />
        </div>
      </div>
    </nav>
  )
}