'use client'

import { useAuth } from '@/hooks/use-auth'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { ThemeToggle } from './theme-toggle'
import { Sparkles, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const navLinks = [
  { href: '/courses', label: 'Courses' },
  { href: '/consultation', label: 'Consultation' },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass border-b border-white/5' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-6xl">
        <a href="/" className="flex items-center gap-2.5 text-xl font-bold">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
            <Sparkles className="h-6 w-6 text-purple-400" />
          </motion.div>
          <span className="gradient-text">Anya</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-3">
              <CosmicButton variant="ghost" size="sm"><a href="/student">Dashboard</a></CosmicButton>
              <CosmicButton variant="outline" size="sm" onClick={logout}>Logout</CosmicButton>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <CosmicButton variant="ghost" size="sm"><a href="/login">Login</a></CosmicButton>
              <CosmicButton size="sm" glow><a href="/signup">Get Started</a></CosmicButton>
            </div>
          )}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-full hover:bg-white/5">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass border-t border-white/5 md:hidden">
          <div className="flex flex-col p-4 space-y-3">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="px-4 py-2.5 text-sm rounded-lg hover:bg-white/5" onClick={() => setIsOpen(false)}>
                {link.label}
              </a>
            ))}
            {user ? (
              <>
                <a href="/student" className="px-4 py-2.5 text-sm rounded-lg hover:bg-white/5" onClick={() => setIsOpen(false)}>Dashboard</a>
                <CosmicButton variant="outline" fullWidth onClick={logout}>Logout</CosmicButton>
              </>
            ) : (
              <>
                <a href="/login" className="px-4 py-2.5 text-sm rounded-lg hover:bg-white/5" onClick={() => setIsOpen(false)}>Login</a>
                <CosmicButton fullWidth glow><a href="/signup" onClick={() => setIsOpen(false)}>Sign Up</a></CosmicButton>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}