'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { ParticleBackground } from '@/components/ui/particle-background'
import { Search, BookOpen, Users, Star, Filter, Grid3x3, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  subtitle?: string
  description: string
  price: number
  thumbnail_url?: string
  category: string
  level: string
  total_students?: number
  rating?: number
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    const fetchCourses = async () => {
      let query = supabase
        .from('courses')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (category !== 'all') {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (!error && data) setCourses(data)
      setLoading(false)
    }

    fetchCourses()
  }, [category])

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  )

  // Get unique categories
  const categories = ['all', ...new Set(courses.map(c => c.category))]

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <GlassCard key={i} padding="sm">
              <div className="aspect-video rounded-xl bg-muted/50 shimmer" />
              <div className="mt-4 h-6 w-3/4 bg-muted/50 rounded shimmer" />
              <div className="mt-2 h-4 w-1/2 bg-muted/50 rounded shimmer" />
              <div className="mt-4 h-10 w-full bg-muted/50 rounded shimmer" />
            </GlassCard>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <ParticleBackground />
      
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
            <p className="text-muted-foreground">Discover the perfect course for your journey</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10 bg-white/5 border-white/10 w-48 md:w-64"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <CosmicButton 
              variant="outline" 
              size="sm" 
              onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            >
              {view === 'grid' ? <Grid3x3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </CosmicButton>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                category === cat
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
        </p>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={view === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredCourses.map((course) => (
              <GlassCard key={course.id} hover padding="sm">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Thumbnail */}
                  <div className={`${view === 'grid' ? 'w-full' : 'w-full md:w-48'} aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative flex-shrink-0`}>
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-purple-400/50" />
                      </div>
                    )}
                    {course.level && (
                      <span className="absolute top-2 right-2 px-3 py-1 text-xs font-medium rounded-full glass border border-white/10">
                        {course.level}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`${view === 'grid' ? '' : 'flex-1'} mt-4 md:mt-0`}>
                    <h3 className="text-lg font-semibold line-clamp-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {course.subtitle || course.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {course.total_students || 0}
                      </span>
                      {course.rating && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          {course.rating.toFixed(1)}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full glass border border-white/10 text-xs">
                        {course.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                      <span className="text-xl font-bold gradient-text">₹{course.price}</span>
                      <Link href={`/courses/${course.id}`}>
                        <CosmicButton size="sm" glow>Enroll</CosmicButton>
                      </Link>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </>
  )
}