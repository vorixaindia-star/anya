'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Calendar, Clock, Loader2, Video } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface ScheduleLiveClassProps {
  courseId: string
  instructorId: string
  onSuccess?: () => void
}

export function ScheduleLiveClass({ courseId, instructorId, onSuccess }: ScheduleLiveClassProps) {
  const router = useRouter()
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
      // 1️⃣ Create Zoom meeting
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

      const { success, joinUrl, meetingId, error } = await zoomRes.json()

      if (!success) {
        toast.error('Failed to create Zoom meeting: ' + error)
        setLoading(false)
        return
      }

      // 2️⃣ Save to database
      const { error: dbError } = await supabase.from('live_classes').insert([
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
          reminder_set: false,
        },
      ])

      if (dbError) {
        toast.error('Failed to save class: ' + dbError.message)
        setLoading(false)
        return
      }

      toast.success('Live class scheduled! 🎉')
      setForm({ title: '', description: '', date: '', time: '', duration: '60' })
      onSuccess?.()
      router.refresh()
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

        <div>
          <Label>Class Title *</Label>
          <Input
            className="mt-1 bg-white/5 border-white/10"
            placeholder="e.g., Vastu for Beginners - Module 3"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            disabled={loading}
          />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            className="mt-1 bg-white/5 border-white/10 min-h-[80px]"
            placeholder="What will students learn?"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Date *</Label>
            <Input
              className="mt-1 bg-white/5 border-white/10"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label>Time *</Label>
            <Input
              className="mt-1 bg-white/5 border-white/10"
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <Label>Duration (minutes)</Label>
          <Input
            className="mt-1 bg-white/5 border-white/10"
            type="number"
            placeholder="60"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            disabled={loading}
            min={15}
            max={180}
          />
        </div>

        <CosmicButton
          type="submit"
          glow
          fullWidth
          disabled={loading}
        >
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