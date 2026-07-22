'use client'

import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { Calendar, Clock, Users, Video } from 'lucide-react'

interface LiveClassCardProps {
  id: string
  title: string
  instructor: string
  date: string
  time: string
  duration: string
  students: number
  status: 'upcoming' | 'live' | 'completed'
  meetingUrl?: string
}

export function LiveClassCard({
  title,
  instructor,
  date,
  time,
  duration,
  students,
  status,
  meetingUrl,
}: LiveClassCardProps) {
  const statusColors = {
    upcoming: 'border-yellow-500/30 text-yellow-400',
    live: 'border-green-500/30 text-green-400 animate-pulse',
    completed: 'border-muted text-muted-foreground',
  }

  const statusLabels = {
    upcoming: '📅 Upcoming',
    live: '🔴 Live Now',
    completed: '✅ Completed',
  }

  return (
    <GlassCard hover padding="md">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{title}</h3>
            <span className={`rounded-full border px-3 py-0.5 text-xs font-medium ${statusColors[status]}`}>
              {statusLabels[status]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">by {instructor}</p>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {date}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {time} ({duration})</span>
            <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {students} students</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === 'live' && meetingUrl && (
            <a href={meetingUrl} target="_blank" rel="noopener noreferrer">
              <CosmicButton size="sm" glow icon={<Video className="h-4 w-4" />}>
                Join Now
              </CosmicButton>
            </a>
          )}
          {status === 'upcoming' && (
            <CosmicButton size="sm" variant="outline" icon={<Calendar className="h-4 w-4" />}>
              Set Reminder
            </CosmicButton>
          )}
          {status === 'completed' && (
            <CosmicButton size="sm" variant="outline" icon={<Video className="h-4 w-4" />}>
              Watch Recording
            </CosmicButton>
          )}
        </div>
      </div>
    </GlassCard>
  )
}