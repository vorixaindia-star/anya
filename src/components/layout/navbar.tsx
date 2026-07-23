'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sparkles, Menu, X, ChevronDown, Music, Store, Bot, Users, BookOpen, Home } from 'lucide-react'
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

  // Main nav items
  const mainNavItems = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'Courses' },
    { href: '/consultation', label: 'Consultation' },
    { href: '/about', label: 'About' },
  ]

  // Dropdown items
  const dropdownItems = [
    { href: '/music', label: '🎵 Music Hub', icon: Music },
    { href: '/store', label: '🛍️ Store', icon: Store },
    { href: '/ai-guruji', label: '🤖 AI Guruji', icon: Bot },
    { href: '/student', label: '📊 Dashboard', icon: Users },
  ]

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
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              {item.label}
            </Link>
          ))}

          {/* Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
                More <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-white/10">
              {dropdownItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="flex items-center gap-2 cursor-pointer">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {dropdownItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/student"
                  className="px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Button
                  className="w-full gradient-primary text-white"
                  onClick={() => { router.push('/signup'); setIsOpen(false); }}
                >
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