'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { allTracks } from '@/lib/music-data'
import { MusicTrack } from '@/types/music'
import { ArrowLeft, Heart, Share2, Clock, Repeat, Shuffle, Download, Play, Pause } from 'lucide-react'
import { toast } from 'sonner'

export default function MusicPlayerPage() {
  const { id } = useParams()
  const router = useRouter()
  const [track, setTrack] = useState<MusicTrack | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const found = allTracks.find(t => t.id === id)
    if (found) {
      setTrack(found)
      setIsFavorite(found.isFavorite || false)
    }
  }, [id])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites ❤️')
  }

  if (!track) {
    return <div className="text-center py-20">Track not found</div>
  }

  // YouTube embed URL
  const embedUrl = `https://www.youtube.com/embed/${track.youtubeId}?autoplay=1&rel=0`

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/30 via-indigo-900/30 to-pink-900/30 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <GlassCard padding="lg" className="border-purple-500/20 bg-purple-500/5">
          {/* Video Player */}
          <div className="aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              title={track.title}
            />
          </div>

          {/* Track Info */}
          <div className="mt-6">
            <h1 className="text-2xl font-bold">{track.title}</h1>
            <p className="text-muted-foreground">{track.artist}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="px-2 py-0.5 rounded-full glass border border-white/10">{track.category}</span>
              <span>{track.duration}</span>
              <span>{track.plays} plays</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/5">
            <CosmicButton
              size="sm"
              variant={isFavorite ? 'primary' : 'outline'}
              icon={<Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />}
              onClick={toggleFavorite}
            >
              {isFavorite ? 'Favorited' : 'Favorite'}
            </CosmicButton>
            <CosmicButton size="sm" variant="outline" icon={<Share2 className="h-4 w-4" />}>
              Share
            </CosmicButton>
            <CosmicButton size="sm" variant="outline" icon={<Clock className="h-4 w-4" />}>
              Sleep Timer
            </CosmicButton>
            <CosmicButton size="sm" variant="outline" icon={<Repeat className="h-4 w-4" />}>
              Repeat
            </CosmicButton>
            <CosmicButton size="sm" variant="outline" icon={<Shuffle className="h-4 w-4" />}>
              Shuffle
            </CosmicButton>
          </div>

          {/* Up Next */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <h3 className="text-sm font-semibold mb-3">Up Next</h3>
            <div className="space-y-2">
              {allTracks
                .filter(t => t.id !== track.id)
                .slice(0, 3)
                .map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition"
                    onClick={() => router.push(`/music/player/${t.id}`)}
                  >
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-xs">
                      🎵
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.title}</p>
                      <p className="text-xs text-muted-foreground">{t.artist}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{t.duration}</span>
                  </div>
                ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}