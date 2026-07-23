'use client'

import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { MusicCard } from '@/components/music/music-card'
import { allTracks } from '@/lib/music-data'
import { MusicTrack } from '@/types/music'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<MusicTrack[]>([])

  useEffect(() => {
    // In real app, fetch from Supabase
    const favs = allTracks.filter(t => t.isFavorite)
    setFavorites(favs)
  }, [])

  return (
    <div className="min-h-screen bg-muted/5 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold tracking-tight">❤️ Favorites</h1>
        </div>

        {favorites.length === 0 ? (
          <GlassCard padding="lg" className="text-center py-12">
            <p className="text-muted-foreground">No favorites yet</p>
            <Link href="/music" className="text-purple-400 hover:text-purple-300 mt-2 inline-block">
              Explore Music →
            </Link>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((track) => (
              <MusicCard key={track.id} track={track} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}