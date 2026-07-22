'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { RazorpayButton } from '@/components/payment/razorpay-button'
import { toast } from 'sonner'
import { Lock } from 'lucide-react'   // ✅ Lock import karo
import { 
  BookOpen, Users, Star, Clock, Tag, Play, FileText, 
  CheckCircle, ChevronDown, ChevronRight, User, Award,
  MessageCircle, Share2, Heart, Bookmark, Plus, Minus,
  Globe, Monitor, GraduationCap, Calendar, BarChart,
  ChevronLeft, ChevronUp, Star as StarIcon
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function CourseDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [enrolled, setEnrolled] = useState(false)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview')
  const [showFullBio, setShowFullBio] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:instructor_id (
            id,
            full_name,
            avatar_url,
            bio,
            role
          )
        `)
        .eq('id', id)
        .single()

      if (!error && data) {
        setCourse(data)
        // Check if user is enrolled
        if (user) {
          const { data: enrollment } = await supabase
            .from('enrollments')
            .select('id')
            .eq('student_id', user.id)
            .eq('course_id', id)
            .single()
          setEnrolled(!!enrollment)
        }
      }
      setLoading(false)
    }

    if (id) fetchCourse()
  }, [id, user])

  const toggleModule = (moduleId: string) => {
    const newSet = new Set(expandedModules)
    if (newSet.has(moduleId)) {
      newSet.delete(moduleId)
    } else {
      newSet.add(moduleId)
    }
    setExpandedModules(newSet)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 w-3/4 bg-muted/50 rounded shimmer" />
            <div className="h-4 w-1/2 bg-muted/50 rounded shimmer" />
            <div className="aspect-video bg-muted/50 rounded-xl shimmer" />
          </div>
          <div className="space-y-4">
            <div className="h-64 bg-muted/50 rounded-xl shimmer" />
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return <div className="text-center py-20">Course not found</div>
  }

  // Mock data for features not in DB
  const whatYouLearn = [
    'Understand the fundamentals of Vastu Shastra and its application',
    'Learn to analyze and balance the 5 elements in any space',
    'Master directional alignments for home and office',
    'Apply Vastu remedies for health, wealth, and relationships',
    'Design spaces that promote harmony and positive energy'
  ]

  const requirements = [
    'No prior knowledge required — open to all seekers',
    'Curiosity and willingness to learn',
    'A notebook for taking notes'
  ]

  const targetAudience = [
    'Beginners interested in Vastu Shastra',
    'Homeowners looking to improve their living spaces',
    'Architects and interior designers',
    'Spiritual seekers and wellness enthusiasts'
  ]

  const faqs = [
    { q: 'Do I need any prior knowledge?', a: 'No, this course is designed for absolute beginners.' },
    { q: 'How long do I have access to the course?', a: 'You get lifetime access to all course materials.' },
    { q: 'Is there a certificate?', a: 'Yes, you\'ll receive a certificate upon completion.' },
    { q: 'Can I ask questions to the instructor?', a: 'Yes, you can post questions in the course discussion forum.' },
  ]

  // Mock curriculum with modules and lessons
  const modules = [
    {
      id: '1',
      title: 'Introduction to Vastu',
      lessons: [
        { id: '1-1', title: 'What is Vastu Shastra?', duration: '8:30', free: true },
        { id: '1-2', title: 'History and Origins', duration: '12:15', free: false },
        { id: '1-3', title: 'The 5 Elements', duration: '15:20', free: false },
      ]
    },
    {
      id: '2',
      title: 'Directions and Elements',
      lessons: [
        { id: '2-1', title: 'The 8 Directions', duration: '10:45', free: false },
        { id: '2-2', title: 'Element Placement', duration: '14:30', free: false },
        { id: '2-3', title: 'Balancing Energies', duration: '18:00', free: false },
      ]
    },
    {
      id: '3',
      title: 'Vastu for Home',
      lessons: [
        { id: '3-1', title: 'Main Entrance', duration: '9:20', free: false },
        { id: '3-2', title: 'Living Room', duration: '11:10', free: false },
        { id: '3-3', title: 'Kitchen and Bedroom', duration: '13:45', free: false },
      ]
    }
  ]

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const totalDuration = modules.reduce((acc, m) => 
    acc + m.lessons.reduce((s, l) => s + parseInt(l.duration), 0), 0
  )

  return (
    <div className="bg-muted/10 min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900/30 via-indigo-900/30 to-pink-900/30 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <a href="/courses" className="hover:text-foreground">Courses</a>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">{course.category}</span>
              </nav>

              {/* Title & Badge */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{course.title}</h1>
                {course.level && (
                  <span className="px-3 py-1 rounded-full glass border border-white/10 text-sm">
                    {course.level}
                  </span>
                )}
              </div>

              {/* Subtitle */}
              {course.subtitle && (
                <p className="text-lg text-muted-foreground">{course.subtitle}</p>
              )}

              {/* Rating & Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold">{course.rating || '4.8'}</span>
                  <span className="text-muted-foreground">({Math.floor(Math.random() * 100) + 50} reviews)</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{course.total_students || 0} students</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m total</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{totalLessons} lessons</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  {course.status === 'published' ? 'Live' : 'Draft'}
                </span>
              </div>

              {/* Instructor Info */}
              <div className="flex items-center gap-3 pt-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {course.instructor?.full_name?.charAt(0) || 'G'}
                </div>
                <div>
                  <p className="text-sm font-medium">{course.instructor?.full_name || 'Instructor'}</p>
                  <p className="text-xs text-muted-foreground">Vastu Expert • {Math.floor(Math.random() * 10) + 2} years experience</p>
                </div>
              </div>

              {/* Share & Bookmark */}
              <div className="flex gap-2">
                <button className="p-2 rounded-full hover:bg-white/5 transition">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-full hover:bg-white/5 transition">
                  <Bookmark className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-full hover:bg-white/5 transition">
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Sidebar — Enroll Card */}
            <div className="lg:col-span-1">
              <GlassCard padding="lg" className="sticky top-24 space-y-4">
                {/* Thumbnail / Video Preview */}
                <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="h-12 w-12 text-purple-400/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <button className="p-4 rounded-full bg-white/20 backdrop-blur hover:bg-white/30 transition">
                      <Play className="h-8 w-8 text-white" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-3xl font-bold gradient-text">₹{course.price}</span>
                    {course.price > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">₹{Math.round(course.price * 1.4)}</span>
                    )}
                  </div>
                  <span className="text-xs text-green-400">14-day money-back guarantee</span>
                </div>

                {/* Enroll Button */}
                {enrolled ? (
                  <CosmicButton glow fullWidth onClick={() => router.push(`/student/courses/${course.id}`)}>
                    Go to Course
                  </CosmicButton>
                ) : (
                  <RazorpayButton
                    amount={course.price}
                    courseId={course.id}
                    courseName={course.title}
                    onSuccess={() => {
                      setEnrolled(true)
                      toast.success('Enrolled successfully!')
                    }}
                    label={`Enroll Now - ₹${course.price}`}
                  />
                )}

                {/* Includes */}
                <div className="space-y-2 text-sm">
                  <p className="font-medium">This course includes:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> {totalLessons} lessons on-demand</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Full lifetime access</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Certificate of completion</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Downloadable resources</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Free preview lessons</li>
                  </ul>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-4 border-b border-white/5 pb-4 mb-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'curriculum', label: 'Curriculum' },
            { id: 'instructor', label: 'Instructor' },
            { id: 'reviews', label: 'Reviews' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                activeTab === tab.id
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Description */}
              <GlassCard padding="lg">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{course.description}</p>
              </GlassCard>

              {/* What You'll Learn */}
              <GlassCard padding="lg">
                <h2 className="text-xl font-semibold mb-3">What you'll learn</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {whatYouLearn.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Requirements */}
              <GlassCard padding="lg">
                <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                <ul className="space-y-1">
                  {requirements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Target Audience */}
              <GlassCard padding="lg">
                <h2 className="text-xl font-semibold mb-3">Who this course is for</h2>
                <ul className="space-y-1">
                  {targetAudience.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* FAQ */}
              <GlassCard padding="lg">
                <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <details key={i} className="border-b border-white/5 pb-3 last:border-0">
                      <summary className="flex items-center justify-between cursor-pointer text-sm font-medium hover:text-primary transition">
                        {faq.q}
                        <ChevronDown className="h-4 w-4" />
                      </summary>
                      <p className="text-sm text-muted-foreground mt-2">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </GlassCard>
            </>
          )}

          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <GlassCard padding="lg">
              <h2 className="text-xl font-semibold mb-4">Course Curriculum</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>{modules.length} modules</span>
                <span>•</span>
                <span>{totalLessons} lessons</span>
                <span>•</span>
                <span>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m total</span>
              </div>

              <div className="space-y-2">
                {modules.map((module, idx) => (
                  <div key={module.id} className="border border-white/5 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition"
                    >
                      <div className="flex items-center gap-3 text-left">
                        {expandedModules.has(module.id) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="font-medium">
                          Module {idx + 1}: {module.title}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {module.lessons.length} lessons
                      </span>
                    </button>

                    {expandedModules.has(module.id) && (
                      <div className="border-t border-white/5 divide-y divide-white/5">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-3 pl-10 text-sm hover:bg-white/5 transition">
                            <div className="flex items-center gap-3">
                              {lesson.free ? (
                                <span className="text-xs text-green-400">FREE</span>
                              ) : (
                                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                              <span>{lesson.title}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Instructor Tab */}
          {activeTab === 'instructor' && (
            <GlassCard padding="lg">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white">
                    {course.instructor?.full_name?.charAt(0) || 'G'}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{course.instructor?.full_name || 'Instructor'}</h2>
                  <p className="text-sm text-muted-foreground">Vastu Expert • {Math.floor(Math.random() * 10) + 2} years experience</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {course.rating || '4.8'} rating
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {course.total_students || 0} students
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      5 courses
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {course.instructor?.bio || 'Experienced Vastu consultant with years of practice and teaching. Passionate about sharing ancient wisdom with modern seekers.'}
                  </p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <GlassCard padding="lg">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0 text-center">
                  <div className="text-5xl font-bold gradient-text">{course.rating || '4.8'}</div>
                  <div className="flex items-center justify-center gap-0.5 text-yellow-400 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Based on {Math.floor(Math.random() * 100) + 50} reviews</p>
                </div>
                <div className="flex-1 space-y-3">
                  {[
                    { name: 'Priya S.', rating: 5, text: 'Excellent course! I learned so much about Vastu. Highly recommend.', date: '2 weeks ago' },
                    { name: 'Rahul K.', rating: 4, text: 'Very informative and well-structured. The instructor is knowledgeable.', date: '1 month ago' },
                    { name: 'Ananya R.', rating: 5, text: 'Life-changing! My home feels so much more balanced now.', date: '2 months ago' },
                  ].map((review, i) => (
                    <div key={i} className="border-b border-white/5 pb-3 last:border-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center text-xs font-bold">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{review.name}</p>
                            <div className="flex items-center gap-0.5 text-yellow-400">
                              {[...Array(5)].map((_, j) => (
                                <StarIcon key={j} className={`h-3 w-3 ${j < review.rating ? 'fill-current' : 'text-muted-foreground'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </section>
    </div>
  )
}