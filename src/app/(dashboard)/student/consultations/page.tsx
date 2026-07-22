'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { Calendar, Clock, User, Video, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react'

export default function StudentConsultationsPage() {
  const { user } = useAuth()
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConsultations = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          expert:users!consultations_expert_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('student_id', user.id)
        .order('scheduled_at', { ascending: false })

      if (!error && data) setConsultations(data)
      setLoading(false)
    }

    fetchConsultations()
  }, [user])

  const statusConfig = {
    pending: { label: 'Pending', icon: ClockIcon, color: 'text-yellow-400' },
    confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-green-400' },
    completed: { label: 'Completed', icon: CheckCircle, color: 'text-blue-400' },
    cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-400' },
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">My Consultations</h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <GlassCard key={i} padding="sm" className="h-24 shimmer">
              <div className="h-full w-full shimmer" />
            </GlassCard>
          ))}
        </div>
      ) : consultations.length === 0 ? (
        <GlassCard padding="lg" className="text-center py-12">
          <p className="text-muted-foreground">No consultations yet</p>
          <a href="/consultation">
            <CosmicButton className="mt-4">Book a Consultation</CosmicButton>
          </a>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {consultations.map((c: any) => {
            const status = statusConfig[c.status as keyof typeof statusConfig] || statusConfig.pending
            const StatusIcon = status.icon

            return (
              <GlassCard key={c.id} padding="md">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Consultation with {c.expert?.full_name || 'Expert'}</h3>
                      <span className={`text-xs font-medium ${status.color}`}>
                        <StatusIcon className="inline h-3 w-3 mr-1" />
                        {status.label}
                      </span>
                    </div>
                    <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(c.scheduled_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {new Date(c.scheduled_at).toLocaleTimeString()} ({c.duration} min)
                      </div>
                    </div>
                  </div>
                  {c.status === 'confirmed' && c.meeting_url && (
                    <a href={c.meeting_url} target="_blank" rel="noopener noreferrer">
                      <CosmicButton size="sm" glow icon={<Video className="h-4 w-4" />}>
                        Join Call
                      </CosmicButton>
                    </a>
                  )}
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}