'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { MusicCard } from '@/components/music/music-card'
import { allTracks } from '@/lib/music-data'
import { MusicTrack } from '@/types/music'
import { Search } from 'lucide-react'
import Link from 'next/link'

// 🔥 Inner component that uses useSearchParams
function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const results = allTracks.filter(track =>
    track.title.toLowerCase().includes(query.toLowerCase()) ||
    track.artist.toLowerCase().includes(query.toLowerCase()) ||
    track.category.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      {query && (
        <p className="text-muted-foreground mb-6">
          Showing results for "<span className="text-foreground font-medium">{query}</span>"
        </p>
      )}

      {results.length === 0 ? (
        <GlassCard padding="lg" className="text-center py-12">
          <p className="text-muted-foreground">No results found for "{query}"</p>
          <Link href="/music" className="text-purple-400 hover:text-purple-300 mt-2 inline-block">
            ← Back to Music Hub
          </Link>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((track) => (
            <MusicCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </>
  )
}

// 🔥 Main page component with Suspense boundary
export default function SearchPage() {
  return (
    <div className="min-h-screen bg-muted/5 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Search className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-muted-foreground">Loading results...</div>}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  )
}