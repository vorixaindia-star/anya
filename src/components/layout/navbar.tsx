'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import { Sparkles, Menu, X, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'glass border-b border-white/5' : 'bg-transparent'
    )}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-6xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <span className="gradient-text">Anya</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground transition">
            Courses
          </Link>
          <Link href="/consultation" className="text-sm text-muted-foreground hover:text-foreground transition">
            Consultation
          </Link>
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition">
            About
          </Link>

          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push('/student')}>
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                Login
              </Button>
              <Button size="sm" className="gradient-primary text-white" onClick={() => router.push('/signup')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="glass border-t border-white/5 md:hidden">
          <div className="flex flex-col p-4 space-y-3">
            <Link href="/courses" className="px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition" onClick={() => setIsOpen(false)}>
              Courses
            </Link>
            <Link href="/consultation" className="px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition" onClick={() => setIsOpen(false)}>
              Consultation
            </Link>
            <Link href="/about" className="px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition" onClick={() => setIsOpen(false)}>
              About
            </Link>

            {user ? (
              <>
                <Link href="/student" className="px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Button className="w-full gradient-primary text-white" onClick={() => { router.push('/signup'); setIsOpen(false); }}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}