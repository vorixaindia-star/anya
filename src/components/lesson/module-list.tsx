'use client'

import { Module, Lesson } from '@/types'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { ChevronDown, ChevronRight, PlusCircle, Video, FileText, Lock, Unlock } from 'lucide-react'
import { useState } from 'react'

interface ModuleListProps {
  modules: Module[]
  courseId: string
  isInstructor?: boolean
}

export function ModuleList({ modules, courseId, isInstructor = false }: ModuleListProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const toggleModule = (moduleId: string) => {
    const newSet = new Set(expandedModules)
    if (newSet.has(moduleId)) {
      newSet.delete(moduleId)
    } else {
      newSet.add(moduleId)
    }
    setExpandedModules(newSet)
  }

  return (
    <div className="space-y-4">
      {modules.map((module, index) => (
        <GlassCard key={module.id} padding="sm">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer flex-1"
              onClick={() => toggleModule(module.id)}
            >
              {expandedModules.has(module.id) ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <h3 className="font-semibold">
                  Module {index + 1}: {module.title}
                </h3>
                {module.description && (
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                )}
              </div>
            </div>
            {isInstructor && (
              <div className="flex gap-2">
                <CosmicButton size="sm" variant="outline">
                  <a href={`/instructor/modules/${module.id}/lessons/new`}>
                    <PlusCircle className="h-4 w-4" />
                    Add Lesson
                  </a>
                </CosmicButton>
              </div>
            )}
          </div>

          {expandedModules.has(module.id) && module.lessons && module.lessons.length > 0 && (
            <div className="mt-4 pl-8 space-y-2 border-l-2 border-white/10">
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    {lesson.video_url ? (
                      <Video className="h-4 w-4 text-purple-400" />
                    ) : lesson.pdf_url ? (
                      <FileText className="h-4 w-4 text-blue-400" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                    <span className="text-sm">{lesson.title}</span>
                    {lesson.is_free_preview ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Free</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">Premium</span>
                    )}
                    {lesson.duration && (
                      <span className="text-xs text-muted-foreground">{lesson.duration} min</span>
                    )}
                  </div>
                  {isInstructor && (
                    <CosmicButton size="sm" variant="ghost">
                      <a href={`/instructor/lessons/${lesson.id}`}>Edit</a>
                    </CosmicButton>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      ))}
    </div>
  )
}