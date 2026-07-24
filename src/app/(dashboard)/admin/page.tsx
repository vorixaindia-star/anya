'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { Users, BookOpen, DollarSign, Clock, TrendingUp, CheckCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeUsers: 0,
    completionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      // Total users
      const { count: users } = await supabase.from('users').select('*', { count: 'exact', head: true })
      // Total courses
      const { count: courses } = await supabase.from('courses').select('*', { count: 'exact', head: true })
      // Total payments
      const { data: payments } = await supabase.from('payments').select('amount')
      const totalRevenue = payments?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0
      // Pending approvals (instructors)
      const { count: pending } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'instructor').eq('is_approved', false)

      setStats({
        totalUsers: users || 0,
        totalCourses: courses || 0,
        totalRevenue,
        pendingApprovals: pending || 0,
        activeUsers: users || 0,
        completionRate: 68,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="text-center py-20">Loading admin dashboard...</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto pt-20">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GlassCard padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>

        <GlassCard padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Courses</p>
              <p className="text-2xl font-bold">{stats.totalCourses}</p>
            </div>
            <BookOpen className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>

        <GlassCard padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-emerald-400" />
          </div>
        </GlassCard>

        <GlassCard padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
              <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <GlassCard padding="md">
          <h3 className="font-semibold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            Recent Activity
          </h3>
          <p className="text-sm text-muted-foreground mt-2">Latest users, courses, and payments will appear here.</p>
        </GlassCard>

        <GlassCard padding="md">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            Platform Insights
          </h3>
          <p className="text-sm text-muted-foreground mt-2">Completion rate: {stats.completionRate}%</p>
        </GlassCard>
      </div>
    </div>
  )
}