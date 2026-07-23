'use client'

import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { Heart, Play } from 'lucide-react'
import { MusicTrack } from '@/types/music'
import Link from 'next/link'
import { useState } from 'react'

interface MusicCardProps {
  track: MusicTrack
  variant?: 'default' | 'compact'
}

export function MusicCard({ track, variant = 'default' }: MusicCardProps) {
  const [isFavorite, setIsFavorite] = useState(track.isFavorite || false)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  return (
    <GlassCard hover padding="sm" className="group relative">
      <Link href={`/music/player/${track.id}`}>
        <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative">
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🎵
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <CosmicButton size="sm" glow icon={<Play className="h-4 w-4" />}>
              Play
            </CosmicButton>
          </div>
        </div>
      </Link>

      <div className="mt-2">
        <div className="flex items-start justify-between">
          <Link href={`/music/player/${track.id}`} className="flex-1">
            <h3 className="font-semibold text-sm line-clamp-1 hover:text-purple-400 transition">
              {track.title}
            </h3>
            <p className="text-xs text-muted-foreground">{track.artist}</p>
          </Link>
          <button
            onClick={toggleFavorite}
            className="mt-0.5 text-muted-foreground hover:text-red-400 transition flex-shrink-0"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-400 text-red-400' : ''}`} />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span className="px-1.5 py-0.5 rounded-full glass border border-white/10">
            {track.category}
          </span>
          <span>{track.duration}</span>
        </div>
      </div>
    </GlassCard>
  )
}