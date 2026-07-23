'use client'

import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { MusicCard } from '@/components/music/music-card'
import { allTracks } from '@/lib/music-data'
import { MusicTrack } from '@/types/music'
import { Clock } from 'lucide-react'
import Link from 'next/link'

export default function HistoryPage() {
  const [history, setHistory] = useState<MusicTrack[]>([])

  useEffect(() => {
    // In real app, fetch from Supabase
    setHistory(allTracks.slice(0, 4))
  }, [])

  return (
    <div className="min-h-screen bg-muted/5 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Clock className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold tracking-tight">🕒 Recently Played</h1>
        </div>

        {history.length === 0 ? (
          <GlassCard padding="lg" className="text-center py-12">
            <p className="text-muted-foreground">No history yet</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {history.map((track) => (
              <MusicCard key={track.id} track={track} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}