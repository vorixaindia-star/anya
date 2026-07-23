'use client'

import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { Calendar, Clock, Users, Video, Bell, BellOff, Download } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

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
  recordingUrl?: string
  reminderSet?: boolean
}

export function LiveClassCard({
  id,
  title,
  instructor,
  date,
  time,
  duration,
  students,
  status,
  meetingUrl,
  recordingUrl,
  reminderSet = false,
}: LiveClassCardProps) {
  const { user } = useAuth()
  const [reminder, setReminder] = useState(reminderSet)

  const toggleReminder = async () => {
    if (!user) return
    const { error } = await supabase
      .from('live_classes')
      .update({ reminder_set: !reminder })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update reminder')
    } else {
      setReminder(!reminder)
      toast.success(reminder ? 'Reminder removed' : 'Reminder set!')
    }
  }

  const addToCalendar = () => {
    window.open(
      `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title
      )}&dates=${date.replace(/-/g, '')}T${time.replace(/:/g, '')}00Z&details=Live+class+with+${instructor}`,
      '_blank'
    )
  }

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
            <span
              className={`rounded-full border px-3 py-0.5 text-xs font-medium ${statusColors[status]}`}
            >
              {statusLabels[status]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">by {instructor}</p>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {time} ({duration})
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {students} students
            </span>
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
            <>
              <button
                onClick={toggleReminder}
                className="rounded-full p-2 hover:bg-white/5 transition"
              >
                {reminder ? (
                  <Bell className="h-4 w-4 text-purple-400" />
                ) : (
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              <CosmicButton
                size="sm"
                variant="outline"
                onClick={addToCalendar}
                icon={<Calendar className="h-4 w-4" />}
              >
                Add
              </CosmicButton>
            </>
          )}
          {status === 'completed' && recordingUrl && (
            <a href={recordingUrl} target="_blank" rel="noopener noreferrer">
              <CosmicButton
                size="sm"
                variant="outline"
                icon={<Download className="h-4 w-4" />}
              >
                Recording
              </CosmicButton>
            </a>
          )}
        </div>
      </div>
    </GlassCard>
  )
}