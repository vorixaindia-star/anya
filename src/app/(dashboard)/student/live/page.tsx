'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { LiveClassCard } from '@/components/live/live-class-card'

export default function StudentLivePage() {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('live_classes')
        .select('*, instructor:users(full_name)')
        .order('scheduled_at', { ascending: true })

      if (!error && data) setClasses(data)
      setLoading(false)
    }

    fetchClasses()
  }, [user])

  if (!user) {
    return <div className="text-center py-20">Please login to view live classes</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Live Classes</h1>

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
          <p className="text-muted-foreground">No live classes available</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {classes.map((cls: any) => (
            <LiveClassCard
              key={cls.id}
              id={cls.id}
              title={cls.title}
              instructor={cls.instructor?.full_name || 'Instructor'}
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
  )
}