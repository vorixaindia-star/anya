'use client'

import { useAuth } from '@/hooks/use-auth'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { BookOpen, Award, Calendar, Sparkles, TrendingUp, Clock } from 'lucide-react'

export default function StudentDashboard() {
  const { user } = useAuth()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, <span className="gradient-text">{user?.full_name || 'Student'}</span>! 👋
        </h1>
        <p className="text-muted-foreground">Continue your learning journey</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GlassCard padding="sm" hover>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">My Courses</p><p className="text-2xl font-bold">5</p></div>
            <BookOpen className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>

        <GlassCard padding="sm" hover>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Progress</p><p className="text-2xl font-bold">65%</p></div>
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>

        <GlassCard padding="sm" hover>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Certificates</p><p className="text-2xl font-bold">2</p></div>
            <Award className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>

        <GlassCard padding="sm" hover>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Upcoming</p><p className="text-2xl font-bold">1</p></div>
            <Calendar className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <a href="/student/courses">
          <CosmicButton glow icon={<BookOpen className="h-4 w-4" />}>
            My Courses
          </CosmicButton>
        </a>
        <a href="/courses">
          <CosmicButton variant="outline" icon={<Sparkles className="h-4 w-4" />}>
            Browse All Courses
          </CosmicButton>
        </a>
      </div>

      <GlassCard className="mt-8 border-purple-500/20 bg-purple-500/5">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-purple-500/20 p-3">
            <Sparkles className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">AI Mentor</h3>
            <p className="text-sm text-muted-foreground">Personalized guidance for your learning journey</p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-purple-400" />🎯 Today's task: Complete Module 3</div>
              <div className="flex items-center gap-2 text-sm"><TrendingUp className="h-4 w-4 text-purple-400" />📊 Weekly progress: 4/5 tasks completed</div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}