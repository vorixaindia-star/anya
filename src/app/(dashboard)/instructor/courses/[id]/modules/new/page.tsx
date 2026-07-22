'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

export default function NewModulePage() {
  const router = useRouter()
  const { id: courseId } = useParams()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Module title is required')
      return
    }

    setLoading(true)
    const { error } = await supabase
      .from('modules')
      .insert([
        {
          course_id: courseId,
          title: title.trim(),
          description: description.trim() || null,
          order: 0,
        },
      ])

    if (error) {
      toast.error('Failed to create module: ' + error.message)
    } else {
      toast.success('Module created successfully! 🎉')
      router.push(`/instructor/courses/${courseId}/modules`)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <a href={`/instructor/courses/${courseId}/modules`}>
          <CosmicButton variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </CosmicButton>
        </a>
        <h1 className="text-2xl font-bold">Create New Module</h1>
      </div>

      <GlassCard padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Module Title *</label>
            <Input
              className="mt-1 bg-white/5 border-white/10"
              placeholder="e.g., Introduction to Vastu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea
              className="mt-1 bg-white/5 border-white/10 min-h-[100px]"
              placeholder="What will students learn in this module?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <CosmicButton type="submit" glow fullWidth disabled={loading}>
              {loading ? 'Creating...' : 'Create Module'}
            </CosmicButton>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}