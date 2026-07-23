'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, X, Minus, Maximize2 } from 'lucide-react'
import { GlassCard } from './glass-card'

// 🔥 USE LOCAL MP3 FILES (put in public/audio/)
const TRACKS = [
  {
    name: 'Spiritual Healing',
    url: '/audio/spiritual-healing.mp3',
  },
  {
    name: 'Meditation Bliss',
    url: '/audio/meditation-bliss.mp3',
  },
  // Add more tracks as needed
]

// 🛡️ Fallback tracks (if local files missing)
const FALLBACK_TRACKS = [
  {
    name: 'Healing (Online)',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    name: 'Peace (Online)',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
]

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isOpen, setIsOpen] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [useFallback, setUseFallback] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [duration, setDuration] = useState(0)

  const activeTracks = useFallback ? FALLBACK_TRACKS : TRACKS

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentTrack, useFallback])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (audioRef.current && audioRef.current.readyState < 2) {
      audioRef.current.load()
    }
  }

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % activeTracks.length)
    setIsPlaying(true)
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + activeTracks.length) % activeTracks.length)
    setIsPlaying(true)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime
      const dur = audioRef.current.duration || 0
      setProgress((current / dur) * 100)
      setDuration(dur)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      audioRef.current.currentTime = x * audioRef.current.duration
    }
  }

  const formatTime = (time: number) => {
    if (!time) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleLoadedMetadata = () => {
    setIsLoading(false)
    setDuration(audioRef.current?.duration || 0)
  }

  const handleError = () => {
    if (!useFallback) {
      console.log('Local file failed, switching to fallback tracks...')
      setUseFallback(true)
      setCurrentTrack(0)
    } else {
      console.warn('Fallback audio track failed, skipping to next.')
      nextTrack()
    }
  }

  const toggleMinimize = () => setIsMinimized(!isMinimized)

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-24 right-6 z-50 rounded-full glass p-3 hover:bg-white/10 transition"
      >
        <Music className="h-5 w-5 text-purple-400" />
      </button>
    )
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={activeTracks[currentTrack].url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        loop={false}
        preload="metadata"
      />

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 rounded-full glass p-3 hover:bg-white/10 transition"
      >
        {isOpen ? <X className="h-5 w-5 text-purple-400" /> : <Music className="h-5 w-5 text-purple-400" />}
      </button>

      {isOpen && (
        <GlassCard
          padding={isMinimized ? 'sm' : 'md'}
          hover={false}
          className={`fixed bottom-32 right-6 z-50 border-purple-500/20 bg-purple-500/5 animate-fade-up transition-all ${
            isMinimized ? 'w-48' : 'w-72'
          }`}
        >
          {isMinimized ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <button
                  onClick={togglePlay}
                  className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 text-white hover:scale-105 transition flex-shrink-0"
                  disabled={isLoading}
                >
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </button>
                <span className="text-xs font-medium truncate">{activeTracks[currentTrack].name}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={toggleMinimize}
                  className="text-muted-foreground hover:text-foreground transition p-1"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-muted-foreground hover:text-foreground transition p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Music className="h-4 w-4 text-purple-400" />
                  Spiritual Music
                </h4>
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleMinimize}
                    className="text-muted-foreground hover:text-foreground transition p-1"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-muted-foreground hover:text-foreground transition p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground truncate">
                {activeTracks[currentTrack].name}
              </p>

              <div
                className="h-1 w-full cursor-pointer rounded-full bg-white/10"
                onClick={handleProgressClick}
              >
                <div
                  className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={prevTrack}
                  className="rounded-full p-1.5 hover:bg-white/10 transition"
                  disabled={isLoading}
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                <button
                  onClick={togglePlay}
                  className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-2 text-white hover:scale-105 transition"
                  disabled={isLoading}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  onClick={nextTrack}
                  className="rounded-full p-1.5 hover:bg-white/10 transition"
                  disabled={isLoading}
                >
                  <SkipForward className="h-4 w-4" />
                </button>
                <button
                  onClick={toggleMute}
                  className="rounded-full p-1.5 hover:bg-white/10 transition"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                {currentTrack + 1} / {activeTracks.length}
              </p>
            </div>
          )}
        </GlassCard>
      )}
    </>
  )
}