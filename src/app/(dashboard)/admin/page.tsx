'use client'

import { useAuth } from '@/hooks/use-auth'
import { GlassCard } from '@/components/ui/glass-card'
import { Users, BookOpen, DollarSign, Clock, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview, {user?.full_name || 'Admin'}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GlassCard padding="sm" hover>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Total Users</p><p className="text-2xl font-bold">1,250</p></div>
            <Users className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>

        <GlassCard padding="sm" hover>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Courses</p><p className="text-2xl font-bold">45</p></div>
            <BookOpen className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>

        <GlassCard padding="sm" hover>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Revenue</p><p className="text-2xl font-bold">₹2,45,000</p></div>
            <DollarSign className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>

        <GlassCard padding="sm" hover>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold">8</p></div>
            <Clock className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <GlassCard className="border-yellow-500/20 bg-yellow-500/5">
          <h3 className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-yellow-400" /> Pending Approvals</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between border-b border-muted pb-2"><span>Vastu for Beginners</span><span className="text-yellow-400">Pending</span></div>
            <div className="flex items-center justify-between border-b border-muted pb-2"><span>Instructor: Priya Sharma</span><span className="text-yellow-400">Pending</span></div>
            <div className="flex items-center justify-between"><span>Advanced Astrology</span><span className="text-yellow-400">Pending</span></div>
          </div>
        </GlassCard>

        <GlassCard className="border-purple-500/20 bg-purple-500/5">
          <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-purple-400" /> Platform Insights</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between"><span>Course Completion Rate</span><span className="font-semibold">68%</span></div>
            <div className="flex items-center justify-between"><span>Active Students</span><span className="font-semibold">342</span></div>
            <div className="flex items-center justify-between"><span>Revenue (This Month)</span><span className="font-semibold text-purple-400">₹45,000</span></div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}