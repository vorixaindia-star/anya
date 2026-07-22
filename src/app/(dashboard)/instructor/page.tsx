'use client'

import { useAuth } from '@/hooks/use-auth'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { BookOpen, Users, DollarSign, TrendingUp, PlusCircle } from 'lucide-react'

export default function InstructorDashboard() {
  const { user } = useAuth()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.full_name || 'Instructor'}!</p>
        </div>
        <a href="/instructor/courses/new">
          <CosmicButton glow className="gap-2"><PlusCircle className="h-4 w-4" /> New Course</CosmicButton>
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GlassCard padding="sm" hover>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Total Courses</p><p className="text-2xl font-bold">8</p></div>
            <BookOpen className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>

        <GlassCard padding="sm" hover>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Students</p><p className="text-2xl font-bold">342</p></div>
            <Users className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>

        <GlassCard padding="sm" hover>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Revenue</p><p className="text-2xl font-bold">₹42,500</p></div>
            <DollarSign className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>

        <GlassCard padding="sm" hover>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Rating</p><p className="text-2xl font-bold">4.8</p></div>
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>
      </div>
    </div>
  )
}