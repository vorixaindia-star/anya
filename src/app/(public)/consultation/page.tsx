'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ConsultationPayment } from '@/components/consultation/consultation-payment'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { User, Calendar, Clock, Search } from 'lucide-react'

interface Expert {
  id: string
  user_id: string
  specialty: string
  bio: string
  session_price: number
  rating: number
  full_name: string
  avatar_url?: string
}

export default function ConsultationPage() {
  const { user } = useAuth()
  const [experts, setExperts] = useState<Expert[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [step, setStep] = useState(1)

  useEffect(() => {
    const fetchExperts = async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          avatar_url,
          expert_profile:expert_profiles (
            specialty,
            bio,
            session_price,
            rating
          )
        `)
        .eq('role', 'expert')

      if (!error && data) {
        const formattedExperts: Expert[] = data.map((e: any) => ({
          id: e.id,
          user_id: e.id,
          full_name: e.full_name || 'Expert',
          avatar_url: e.avatar_url,
          specialty: e.expert_profile?.specialty || 'Occult Expert',
          bio: e.expert_profile?.bio || '',
          session_price: e.expert_profile?.session_price || 999,
          rating: e.expert_profile?.rating || 4.5,
        }))
        setExperts(formattedExperts)
      }
      setLoading(false)
    }

    fetchExperts()
  }, [])

  const selectedExpertData = experts.find(e => e.id === selectedExpert)

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold">Please login to book consultation</h2>
        <a href="/login">
          <CosmicButton className="mt-4">Login</CosmicButton>
        </a>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Book a Consultation</h1>
        <p className="text-muted-foreground mb-8">Choose an expert for personalized guidance</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <GlassCard key={i} padding="sm" className="h-48 shimmer">
                <div className="h-full w-full shimmer" />
              </GlassCard>
            ))
          ) : experts.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">No experts available at the moment</p>
            </div>
          ) : (
            experts.map((expert) => (
              <GlassCard
                key={expert.id}
                hover
                padding="md"
                className={`cursor-pointer ${selectedExpert === expert.id ? 'border-purple-500/50 bg-purple-500/10' : ''}`}
                onClick={() => {
                  setSelectedExpert(expert.id)
                  setStep(2)
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {expert.full_name?.charAt(0) || 'E'}
                  </div>
                  <div>
                    <h3 className="font-semibold">{expert.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{expert.specialty}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>⭐ {expert.rating}</span>
                      <span>•</span>
                      <span>₹{expert.session_price}/session</span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{expert.bio}</p>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground mb-4">
          ← Back to experts
        </button>

        <GlassCard padding="lg">
          <h2 className="text-xl font-bold mb-4">Select Date & Time</h2>
          <div className="space-y-4">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                className="mt-1 bg-white/5 border-white/10"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                type="time"
                className="mt-1 bg-white/5 border-white/10"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
            <CosmicButton
              glow
              fullWidth
              onClick={() => {
                if (!selectedDate || !selectedTime) {
                  toast.error('Please select date and time')
                  return
                }
                setStep(3)
              }}
            >
              Continue to Payment
            </CosmicButton>
          </div>
        </GlassCard>
      </div>
    )
  }

  if (step === 3 && selectedExpert) {
    const expert = experts.find(e => e.id === selectedExpert)
    const scheduledAt = `${selectedDate}T${selectedTime}:00`

    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <button onClick={() => setStep(2)} className="text-sm text-muted-foreground hover:text-foreground mb-4">
          ← Back to time selection
        </button>

        <ConsultationPayment
          expertId={selectedExpert}
          expertName={expert?.full_name || 'Expert'}
          amount={expert?.session_price || 999}
          duration={30}
          scheduledAt={scheduledAt}
          studentId={user.id}
        />
      </div>
    )
  }

  return null
}