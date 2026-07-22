'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export default function EditCoursePage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: 0,
    category: '',
    level: 'beginner',
    thumbnail_url: '',
  })

  useEffect(() => {
    const fetchCourse = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .eq('instructor_id', user.id)
        .single()

      if (error || !data) {
        toast.error('Course not found')
        router.push('/instructor/courses')
        return
      }

      setForm({
        title: data.title || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        price: data.price || 0,
        category: data.category || '',
        level: data.level || 'beginner',
        thumbnail_url: data.thumbnail_url || '',
      })
      setLoading(false)
    }

    if (id) fetchCourse()
  }, [id, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from('courses')
      .update({
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        price: form.price,
        category: form.category,
        level: form.level,
        thumbnail_url: form.thumbnail_url,
      })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update course')
      setSaving(false)
      return
    }

    toast.success('Course updated! 🎉')
    router.push(`/instructor/courses/${id}`)
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push(`/instructor/courses/${id}`)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Course</h1>
      </div>
      <p className="text-muted-foreground mb-8">Update your course details</p>

      <GlassCard padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-white/5 border-white/10"
              required
            />
          </div>

          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="bg-white/5 border-white/10"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="bg-white/5 border-white/10 min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
            <Input
              id="thumbnail_url"
              value={form.thumbnail_url}
              onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
              className="bg-white/5 border-white/10"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <CosmicButton type="submit" glow disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </CosmicButton>
            <CosmicButton
              type="button"
              variant="outline"
              onClick={() => router.push(`/instructor/courses/${id}`)}
            >
              Cancel
            </CosmicButton>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}