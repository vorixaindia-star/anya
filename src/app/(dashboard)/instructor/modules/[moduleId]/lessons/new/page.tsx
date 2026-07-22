'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft } from 'lucide-react'

export default function NewLessonPage() {
  const { moduleId } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    video_url: '',
    pdf_url: '',
    is_free_preview: false,
    duration: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.title.trim()) {
      toast.error('Lesson title is required')
      return
    }

    if (!user) {
      toast.error('You must be logged in')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('lessons').insert([
      {
        module_id: moduleId,
        title: form.title.trim(),
        description: form.description.trim() || null,
        video_url: form.video_url.trim() || null,
        pdf_url: form.pdf_url.trim() || null,
        is_free_preview: form.is_free_preview,
        duration: form.duration ? parseInt(form.duration) : null,
        order: 0,
      },
    ])

    if (error) {
      toast.error('Failed to create lesson: ' + error.message)
    } else {
      toast.success('Lesson created successfully! 🎉')
      router.push(`/instructor/modules/${moduleId}/lessons`)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Create New Lesson</h1>
      </div>

      <GlassCard padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Lesson Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-white/5 border-white/10"
              placeholder="e.g., Understanding Directions"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="bg-white/5 border-white/10 min-h-[80px]"
              placeholder="What will students learn?"
            />
          </div>

          <div>
            <Label htmlFor="video_url">Video URL</Label>
            <Input
              id="video_url"
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              className="bg-white/5 border-white/10"
              placeholder="https://example.com/video.mp4"
            />
          </div>

          <div>
            <Label htmlFor="pdf_url">PDF URL (Optional)</Label>
            <Input
              id="pdf_url"
              value={form.pdf_url}
              onChange={(e) => setForm({ ...form, pdf_url: e.target.value })}
              className="bg-white/5 border-white/10"
              placeholder="https://example.com/notes.pdf"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="bg-white/5 border-white/10"
                placeholder="10"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-6">
              <Label htmlFor="free_preview">Free Preview</Label>
              <Switch
                id="free_preview"
                checked={form.is_free_preview}
                onCheckedChange={(checked) =>
                  setForm({ ...form, is_free_preview: checked })
                }
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <CosmicButton type="submit" glow disabled={loading}>
              {loading ? 'Creating...' : 'Create Lesson'}
            </CosmicButton>
            <CosmicButton
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </CosmicButton>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}