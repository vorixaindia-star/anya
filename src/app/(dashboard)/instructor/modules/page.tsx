'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { PlusCircle, BookOpen, Edit, Trash2, ChevronRight } from 'lucide-react'

interface Module {
  id: string
  course_id: string
  title: string
  description?: string
  order: number
  lessons?: any[]
}

export default function ModulesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModules = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('modules')
        .select('*, lessons(*)')
        .order('order', { ascending: true })

      if (error) {
        toast.error('Failed to load modules')
      } else {
        setModules(data || [])
      }
      setLoading(false)
    }

    fetchModules()
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this module?')) return

    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to delete module')
    } else {
      toast.success('Module deleted')
      setModules(modules.filter((m) => m.id !== id))
    }
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Please login to view modules</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Modules</h1>
          <p className="text-muted-foreground">Manage your course modules</p>
        </div>
        <CosmicButton
          size="sm"
          glow
          onClick={() => router.push('/instructor/modules/new')}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Module
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
      ) : modules.length === 0 ? (
        <GlassCard padding="lg" className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No modules yet</h3>
          <p className="text-sm text-muted-foreground">Create your first module</p>
          <CosmicButton
            className="mt-4"
            onClick={() => router.push('/instructor/modules/new')}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Module
          </CosmicButton>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {modules.map((module) => (
            <GlassCard key={module.id} padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{module.title}</h3>
                  {module.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {module.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {module.lessons?.length || 0} lessons
                  </p>
                </div>
                <div className="flex gap-1">
                  <CosmicButton
                    size="sm"
                    variant="ghost"
                    onClick={() => router.push(`/instructor/modules/${module.id}`)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </CosmicButton>
                  <CosmicButton
                    size="sm"
                    variant="ghost"
                    onClick={() => router.push(`/instructor/modules/${module.id}/edit`)}
                  >
                    <Edit className="h-3 w-3" />
                  </CosmicButton>
                  <CosmicButton
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(module.id)}
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