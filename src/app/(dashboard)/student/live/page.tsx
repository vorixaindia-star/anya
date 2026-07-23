'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { LiveClassCard } from '@/components/live/live-class-card'
import { Calendar, Clock, Video, Users, Bell, BellOff } from 'lucide-react'
import { toast } from 'sonner'

export default function StudentLivePage() {
  const { user } = useAuth()
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [upcomingOnly, setUpcomingOnly] = useState(true)

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user) return

      let query = supabase
        .from('live_classes')
        .select(`
          *,
          instructor:instructor_id (
            full_name,
            avatar_url
          )
        `)
        .order('scheduled_at', { ascending: true })

      if (upcomingOnly) {
        query = query.gte('scheduled_at', new Date().toISOString())
      }

      const { data, error } = await query

      if (!error && data) {
        setClasses(data)
      } else {
        console.error(error)
      }
      setLoading(false)
    }

    fetchClasses()
  }, [user, upcomingOnly])

  const toggleReminder = async (classId: string, currentStatus: boolean) => {
    if (!user) return

    const { error } = await supabase
      .from('live_classes')
      .update({ reminder_set: !currentStatus })
      .eq('id', classId)

    if (error) {
      toast.error('Failed to update reminder')
    } else {
      toast.success(currentStatus ? 'Reminder removed' : 'Reminder set!')
      setClasses(prev =>
        prev.map(c =>
          c.id === classId ? { ...c, reminder_set: !currentStatus } : c
        )
      )
    }
  }

  if (!user) {
    return <div className="text-center py-20">Please login to view live classes</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">🎥 Live Classes</h1>
          <p className="text-muted-foreground">Join live sessions with your gurus</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUpcomingOnly(!upcomingOnly)}
            className={`px-3 py-1.5 rounded-full text-sm transition ${
              upcomingOnly
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-white/5 text-muted-foreground'
            }`}
          >
            {upcomingOnly ? '📅 Upcoming' : '📋 All'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <GlassCard key={i} padding="sm" className="h-24 shimmer">
              <div className="h-full w-full shimmer" />
            </GlassCard>
          ))}
        </div>
      ) : classes.length === 0 ? (
        <GlassCard padding="lg" className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">
            No live classes {upcomingOnly ? 'upcoming' : ''}
          </h3>
          <p className="text-sm text-muted-foreground">Check back later for new sessions</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {classes.map((cls) => {
            const isLive =
              new Date(cls.scheduled_at) <= new Date() &&
              new Date(new Date(cls.scheduled_at).getTime() + cls.duration * 60000) > new Date()
            const status = isLive
              ? 'live'
              : new Date(cls.scheduled_at) > new Date()
              ? 'upcoming'
              : 'completed'

            return (
              <LiveClassCard
                key={cls.id}
                id={cls.id}
                title={cls.title}
                instructor={cls.instructor?.full_name || 'Instructor'}
                date={new Date(cls.scheduled_at).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
                time={new Date(cls.scheduled_at).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                duration={`${cls.duration} min`}
                students={cls.students || 0}
                status={status}
                meetingUrl={cls.meeting_url}
                recordingUrl={cls.recording_url}
                reminderSet={cls.reminder_set || false}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}