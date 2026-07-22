'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { Input } from '@/components/ui/input'
import { 
  Search, Filter, Grid3X3, List, BookOpen, Users, Star, 
  ChevronDown, X, SlidersHorizontal, ArrowUpDown
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Course {
  id: string
  title: string
  subtitle?: string
  description: string
  price: number
  thumbnail_url?: string
  category: string
  level: string
  instructor_id: string
  status: string
  total_students?: number
  rating?: number
  instructor?: {
    full_name: string
  }
  created_at: string
}

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [level, setLevel] = useState('all')
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [categories, setCategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      let query = supabase
        .from('courses')
        .select(`
          *,
          instructor:instructor_id (
            full_name
          )
        `)
        .eq('status', 'published')
        .eq('is_active', true)

      // Category filter
      if (category !== 'all') {
        query = query.eq('category', category)
      }

      // Level filter
      if (level !== 'all') {
        query = query.eq('level', level)
      }

      // Search filter
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
      }

      // Sorting
      switch (sort) {
        case 'price_low':
          query = query.order('price', { ascending: true })
          break
        case 'price_high':
          query = query.order('price', { ascending: false })
          break
        case 'popular':
          query = query.order('total_students', { ascending: false })
          break
        case 'rating':
          query = query.order('rating', { ascending: false })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (!error && data) {
        setCourses(data)
        // Extract categories
        const cats = [...new Set(data.map(c => c.category).filter(Boolean))]
        setCategories(cats as string[])
      }
      setLoading(false)
    }

    fetchCourses()
  }, [category, level, search, sort])

  const clearFilters = () => {
    setCategory('all')
    setLevel('all')
    setSearch('')
    setSort('newest')
  }

  const hasActiveFilters = category !== 'all' || level !== 'all' || search

  return (
    <div className="min-h-screen bg-muted/5 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
            <p className="text-muted-foreground">Discover the perfect course for your journey</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10 bg-white/5 border-white/10 w-48 md:w-64"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg glass hover:bg-white/5 transition"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded-lg glass hover:bg-white/5 transition"
            >
              {view === 'grid' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {category !== 'all' && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full glass text-xs">
                {category}
                <button onClick={() => setCategory('all')} className="hover:text-red-400">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {level !== 'all' && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full glass text-xs">
                {level}
                <button onClick={() => setLevel('all')} className="hover:text-red-400">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-purple-400 hover:text-purple-300">
              Clear all
            </button>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <GlassCard padding="md" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 rounded-lg bg-white/5 border border-white/10 p-2.5 text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full mt-1 rounded-lg bg-white/5 border border-white/10 p-2.5 text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="professional">Professional</option>
                  <option value="master">Master</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full mt-1 rounded-lg bg-white/5 border border-white/10 p-2.5 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {courses.length} {courses.length === 1 ? 'course' : 'courses'}
          </p>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <GlassCard key={i} padding="sm" className="h-80 shimmer">
                <div className="h-full w-full shimmer" />
              </GlassCard>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <GlassCard padding="lg" className="text-center py-20">
            <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
            <CosmicButton className="mt-4" variant="outline" onClick={clearFilters}>
              Clear Filters
            </CosmicButton>
          </GlassCard>
        ) : (
          <div className={view === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard 
                  hover 
                  padding="sm" 
                  className={`${view === 'list' ? 'flex flex-col md:flex-row gap-4' : ''} cursor-pointer`}
                  onClick={() => router.push(`/courses/${course.id}`)}
                >
                  {/* Thumbnail */}
                  <div className={`${view === 'grid' ? 'w-full' : 'w-full md:w-48'} aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative flex-shrink-0`}>
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-purple-400/50" />
                      </div>
                    )}
                    {course.level && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full glass border border-white/10 text-xs">
                        {course.level}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`${view === 'grid' ? '' : 'flex-1'} mt-3 md:mt-0`}>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold line-clamp-1 hover:text-primary transition">
                        {course.title}
                      </h3>
                    </div>
                    
                    {view === 'list' && course.subtitle && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{course.subtitle}</p>
                    )}

                    {view === 'grid' && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {course.subtitle || course.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
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
                      {view === 'grid' && course.category && (
                        <span className="px-2 py-0.5 rounded-full glass border border-white/10 text-xs">
                          {course.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                      <span className="text-lg font-bold gradient-text">₹{course.price}</span>
                      <CosmicButton 
                        size="sm" 
                        glow 
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/courses/${course.id}`)
                        }}
                      >
                        {course.price === 0 ? 'Free' : 'Enroll'}
                      </CosmicButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}