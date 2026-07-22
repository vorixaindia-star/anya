'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { ScheduleLiveClass } from '@/components/live/schedule-live-class'
import { LiveClassCard } from '@/components/live/live-class-card'
import { useRouter } from 'next/navigation'

export default function InstructorLivePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('live_classes')
        .select('*')
        .eq('instructor_id', user.id)
        .order('scheduled_at', { ascending: true })

      if (!error && data) setClasses(data)
      setLoading(false)
    }

    fetchClasses()
  }, [user])

  if (!user) {
    return <div className="text-center py-20">Please login to view your classes</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Live Classes</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your Classes</h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <GlassCard key={i} padding="sm" className="h-20 shimmer">
                  <div className="h-full w-full shimmer" />
                </GlassCard>
              ))}
            </div>
          ) : classes.length === 0 ? (
            <GlassCard padding="lg" className="text-center py-12">
              <p className="text-muted-foreground">No classes scheduled yet</p>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {classes.map((cls: any) => (
                <LiveClassCard
                  key={cls.id}
                  id={cls.id}
                  title={cls.title}
                  instructor={user?.full_name || 'Instructor'}
                  date={new Date(cls.scheduled_at).toLocaleDateString()}
                  time={new Date(cls.scheduled_at).toLocaleTimeString()}
                  duration={`${cls.duration} min`}
                  students={0}
                  status={new Date(cls.scheduled_at) > new Date() ? 'upcoming' : 'completed'}
                  meetingUrl={cls.meeting_url}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <ScheduleLiveClass courseId="default" instructorId={user?.id || ''} />
        </div>
      </div>
    </div>
  )
}