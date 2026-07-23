'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { Input } from '@/components/ui/input'
import { Music, Search, Heart, Clock, TrendingUp, Play } from 'lucide-react'
import Link from 'next/link'
import { categories, trendingTracks } from '@/lib/music-data'
import { MusicCard } from '@/components/music/music-card'
import { useRouter } from 'next/navigation'

export default function MusicHubPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/music/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-muted/5 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Music className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold tracking-tight">🎵 Music Hub</h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10 bg-white/5 border-white/10"
              placeholder="Search meditation music..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/music?category=${cat.id}`}>
                <GlassCard
                  hover
                  padding="sm"
                  className={`text-center bg-gradient-to-br ${cat.color} bg-opacity-10 border-transparent hover:border-purple-500/30 cursor-pointer`}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <p className="text-xs font-medium">{cat.name}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              Trending
            </h2>
            <Link href="/music/trending">
              <span className="text-sm text-purple-400 hover:text-purple-300">View All →</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trendingTracks.slice(0, 4).map((track) => (
              <MusicCard key={track.id} track={track} />
            ))}
          </div>
        </section>

        {/* Quick Access */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/music/favorites">
            <GlassCard hover padding="md" className="text-center cursor-pointer border-purple-500/10">
              <Heart className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Favorites</p>
            </GlassCard>
          </Link>
          <Link href="/music/history">
            <GlassCard hover padding="md" className="text-center cursor-pointer border-purple-500/10">
              <Clock className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-sm font-medium">History</p>
            </GlassCard>
          </Link>
          <Link href="/music/player">
            <GlassCard hover padding="md" className="text-center cursor-pointer border-purple-500/10">
              <Play className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Now Playing</p>
            </GlassCard>
          </Link>
          <GlassCard hover padding="md" className="text-center cursor-pointer border-purple-500/10">
            <Music className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-sm font-medium">Playlists</p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}