export interface MusicTrack {
    id: string
    title: string
    artist: string
    category: 'meditation' | 'mantra' | 'bhajan' | 'sleep' | 'nature' | 'relaxation'
    duration: string
    youtubeId: string
    thumbnail: string
    isFavorite?: boolean
    plays?: number
  }
  
  export interface MusicCategory {
    id: string
    name: string
    icon: string
    color: string
  }