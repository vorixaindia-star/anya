'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, X } from 'lucide-react'
import { GlassCard } from './glass-card'

// 🔥 Add your own track URL (MP3)
const TRACKS = [
  {
    name: 'Spiritual Healing',
    url: '/audio/spiritual-healing.mp3',
  },
  {
    name: 'Meditation Bliss',
    url: '/audio/meditation-bliss.mp3',
  },
]

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isOpen, setIsOpen] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentTrack])

  const togglePlay = () => setIsPlaying(!isPlaying)

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length)
    setIsPlaying(true)
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length)
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
        src={TRACKS[currentTrack].url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        loop={false}
      />

      {/* Music Button (Toggle) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 rounded-full glass p-3 hover:bg-white/10 transition"
      >
        {isOpen ? <X className="h-5 w-5 text-purple-400" /> : <Music className="h-5 w-5 text-purple-400" />}
      </button>

      {/* Music Player */}
      {isOpen && (
        <GlassCard
          padding="md"
          className="fixed bottom-32 right-6 z-50 w-72 border-purple-500/20 bg-purple-500/5 animate-fade-up"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">🎵 Spiritual Music</h4>
              <button
                onClick={() => setIsVisible(false)}
                className="text-muted-foreground hover:text-foreground transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground truncate">
              {TRACKS[currentTrack].name}
            </p>

            {/* Progress Bar */}
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

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={prevTrack}
                className="rounded-full p-1.5 hover:bg-white/10 transition"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                onClick={togglePlay}
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-2 text-white hover:scale-105 transition"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                onClick={nextTrack}
                className="rounded-full p-1.5 hover:bg-white/10 transition"
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
              {currentTrack + 1} / {TRACKS.length}
            </p>
          </div>
        </GlassCard>
      )}
    </>
  )
}