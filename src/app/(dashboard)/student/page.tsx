'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { 
  BookOpen, Award, Calendar, Sparkles, TrendingUp, Clock,
  ChevronRight, Users, Star, Play, FileText, CheckCircle,
  Bell, MessageCircle, Settings, User, LogOut, Home,
  BarChart, Target, Zap, Bookmark, Heart, ShoppingBag
} from 'lucide-react'
import Link from 'next/link'

interface Enrollment {
  id: string
  course_id: string
  progress: number
  completed: boolean
  enrolled_at: string
  course: {
    id: string
    title: string
    subtitle?: string
    thumbnail_url?: string
    level: string
    instructor: {
      full_name: string
    }
  }
}

export default function StudentDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgress: 0,
    totalLessons: 0,
    completedLessons: 0,
    streak: 0,
    totalHours: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      // Fetch enrollments with course details
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          course_id,
          progress,
          completed,
          enrolled_at,
          course:course_id (
            id,
            title,
            subtitle,
            thumbnail_url,
            level,
            instructor:instructor_id (
              full_name
            )
          )
        `)
        .eq('student_id', user.id)
        .order('enrolled_at', { ascending: false })

      if (!error && data) {
        setEnrollments(data as any)
        
        // Calculate stats
        const total = data.length
        const completed = data.filter(e => e.completed).length
        const inProgress = data.filter(e => e.progress > 0 && e.progress < 100).length
        
        setStats({
          totalCourses: total,
          completedCourses: completed,
          inProgress: inProgress,
          totalLessons: 0,
          completedLessons: 0,
          streak: 7,
          totalHours: Math.floor(total * 2.5),
        })
      }
      setLoading(false)
    }

    fetchData()
  }, [user])

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Please login to view your dashboard</p>
        <CosmicButton className="mt-4" onClick={() => router.push('/login')}>
          Login
        </CosmicButton>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/5 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user.full_name || 'Student'}! 👋
            </h1>
            <p className="text-muted-foreground">Continue your spiritual learning journey</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg glass hover:bg-white/5 transition relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button className="p-2 rounded-lg glass hover:bg-white/5 transition">
              <MessageCircle className="h-5 w-5" />
            </button>
            <button 
              onClick={logout}
              className="p-2 rounded-lg glass hover:bg-white/5 transition text-red-400"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GlassCard padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">My Courses</p>
                <p className="text-2xl font-bold">{stats.totalCourses}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-400/50" />
            </div>
          </GlassCard>

          <GlassCard padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedCourses}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-400/50" />
            </div>
          </GlassCard>

          <GlassCard padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400/50" />
            </div>
          </GlassCard>

          <GlassCard padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Learning Streak</p>
                <p className="text-2xl font-bold">{stats.streak} 🔥</p>
              </div>
              <Zap className="h-8 w-8 text-orange-400/50" />
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href="/courses">
            <CosmicButton size="sm" variant="outline" icon={<BookOpen className="h-4 w-4" />}>
              Browse Courses
            </CosmicButton>
          </Link>
          <Link href="/student/mentor">
            <CosmicButton size="sm" variant="outline" icon={<Sparkles className="h-4 w-4" />}>
              AI Mentor
            </CosmicButton>
          </Link>
          <Link href="/student/live">
            <CosmicButton size="sm" variant="outline" icon={<Calendar className="h-4 w-4" />}>
              Live Classes
            </CosmicButton>
          </Link>
          <Link href="/consultation">
            <CosmicButton size="sm" variant="outline" icon={<Users className="h-4 w-4" />}>
              Book Guru
            </CosmicButton>
          </Link>
        </div>

        {/* AI Mentor Section */}
        <GlassCard className="mb-8 border-purple-500/20 bg-purple-500/5">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-purple-500/20 p-3">
              <Sparkles className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">AI Mentor</h3>
                <Link href="/student/mentor">
                  <CosmicButton size="sm" variant="ghost" icon={<ChevronRight className="h-4 w-4" />}>
                    Chat Now
                  </CosmicButton>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">Personalized guidance for your learning journey</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span>🎯 Today's task: Complete Module 3 of "Vastu for Beginners"</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                  <span>📊 Weekly progress: 4/5 tasks completed</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* My Courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Courses</h2>
            <Link href="/student/courses" className="text-sm text-purple-400 hover:text-purple-300">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <GlassCard key={i} padding="sm" className="h-80 shimmer">
                <div className="h-full w-full shimmer" />
              </GlassCard>
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <GlassCard padding="lg" className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">No courses yet</h3>
              <p className="text-muted-foreground">Start your learning journey today</p>
              <Link href="/courses">
                <CosmicButton className="mt-4" glow>
                  Browse Courses
                </CosmicButton>
              </Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.slice(0, 6).map((enrollment) => (
                <GlassCard key={enrollment.id} hover padding="sm">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    {enrollment.course.thumbnail_url ? (
                      <img src={enrollment.course.thumbnail_url} alt={enrollment.course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-purple-400/50" />
                      </div>
                    )}
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full glass border border-white/10 text-xs">
                      {enrollment.course.level}
                    </span>
                    {enrollment.completed && (
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Completed
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <h4 className="font-semibold line-clamp-1">{enrollment.course.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {enrollment.course.instructor?.full_name || 'Instructor'}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-white/10 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{enrollment.progress}%</span>
                      </div>
                      <Link href={`/student/courses/${enrollment.course_id}`}>
                        <CosmicButton size="sm" glow>
                          {enrollment.progress === 100 ? 'Review' : 'Continue'}
                        </CosmicButton>
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}