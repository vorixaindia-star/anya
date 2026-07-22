'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { ArrowLeft, PlusCircle, Video, FileText, Lock, Unlock, Edit, Trash2, Clock } from 'lucide-react'

interface Lesson {
  id: string
  module_id: string
  title: string
  description?: string
  video_url?: string
  pdf_url?: string
  is_free_preview: boolean
  order: number
  duration?: number
}

export default function LessonsPage() {
  const { moduleId } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLessons = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', moduleId)
        .order('order', { ascending: true })

      if (error) {
        toast.error('Failed to load lessons')
      } else {
        setLessons(data || [])
      }
      setLoading(false)
    }

    if (moduleId) fetchLessons()
  }, [moduleId, user])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to delete lesson')
    } else {
      toast.success('Lesson deleted')
      setLessons(lessons.filter((l) => l.id !== id))
    }
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Please login to view lessons</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Lessons</h1>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">Manage your lessons</p>
        <CosmicButton
          size="sm"
          glow
          onClick={() => router.push(`/instructor/modules/${moduleId}/lessons/new`)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Lesson
        </CosmicButton>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <GlassCard key={i} padding="sm" className="h-20 shimmer">
              <div className="h-full w-full shimmer" />
            </GlassCard>
          ))}
        </div>
      ) : lessons.length === 0 ? (
        <GlassCard padding="lg" className="text-center py-12">
          <Video className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No lessons yet</h3>
          <p className="text-sm text-muted-foreground">Create your first lesson</p>
          <CosmicButton
            className="mt-4"
            onClick={() => router.push(`/instructor/modules/${moduleId}/lessons/new`)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Lesson
          </CosmicButton>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <GlassCard key={lesson.id} padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm text-muted-foreground w-6">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-medium">{lesson.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {lesson.video_url && (
                        <span className="flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          Video
                        </span>
                      )}
                      {lesson.pdf_url && (
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          PDF
                        </span>
                      )}
                      {lesson.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.duration} min
                        </span>
                      )}
                      {lesson.is_free_preview ? (
                        <span className="flex items-center gap-1 text-green-400">
                          <Unlock className="h-3 w-3" />
                          Free Preview
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-yellow-400">
                          <Lock className="h-3 w-3" />
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <CosmicButton
                    size="sm"
                    variant="ghost"
                    onClick={() => router.push(`/instructor/lessons/${lesson.id}`)}
                  >
                    <Edit className="h-3 w-3" />
                  </CosmicButton>
                  <CosmicButton
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(lesson.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </CosmicButton>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}