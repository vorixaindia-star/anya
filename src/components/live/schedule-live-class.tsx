'use client'

import { useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Calendar, Loader2, Video } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface ScheduleLiveClassProps {
  courseId: string
  instructorId: string
}

export function ScheduleLiveClass({ courseId, instructorId }: ScheduleLiveClassProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.date || !form.time) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      // 1️⃣ Zoom meeting create karo
      const zoomRes = await fetch('/api/zoom/create-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: form.title,
          startTime: `${form.date}T${form.time}:00`,
          duration: parseInt(form.duration),
          agenda: form.description,
        }),
      })

      const { joinUrl, meetingId } = await zoomRes.json()

      // 2️⃣ Database mein save karo
      const { error } = await supabase.from('live_classes').insert([
        {
          title: form.title,
          description: form.description,
          course_id: courseId,
          instructor_id: instructorId,
          meeting_url: joinUrl,
          zoom_meeting_id: meetingId,
          scheduled_at: `${form.date}T${form.time}:00`,
          duration: parseInt(form.duration),
          status: 'scheduled',
        },
      ])

      if (error) {
        toast.error('Failed to save class')
        return
      }

      toast.success('Live class scheduled! 🎉')
      setForm({ title: '', description: '', date: '', time: '', duration: '60' })
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard padding="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <Video className="h-6 w-6 text-purple-400" />
          <h3 className="text-xl font-semibold">Schedule Live Class</h3>
        </div>

        <Input
          placeholder="Class Title *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          disabled={loading}
        />

        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          disabled={loading}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            disabled={loading}
          />
          <Input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            disabled={loading}
          />
        </div>

        <Input
          type="number"
          placeholder="Duration (minutes)"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          disabled={loading}
        />

        <CosmicButton type="submit" glow fullWidth disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scheduling...
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Class
            </>
          )}
        </CosmicButton>
      </form>
    </GlassCard>
  )
}