'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { GlassCard } from '@/components/ui/glass-card'
import { ParticleBackground } from '@/components/ui/particle-background'
import {
  ArrowRight, Sparkles, Users, BookOpen, Star, Clock,
  Phone, Mail, MapPin, ChevronRight, CheckCircle,
  MessageCircle, Crown, Compass, Moon, Eye,
  Shield, TrendingUp, Calendar, Bot, Target, GraduationCap,
  Zap, Rocket,  Gem, Feather, Lightbulb,
  Layers, Globe, Award, BarChart, Activity, Play, Medal, Trophy
} from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'
import AIAssessmentSection from "@/components/sections/AIAssessmentSection";

// Data
const stats = [
  { value: '500+', label: 'Verified Gurus', icon: Shield, desc: 'Expert teachers' },
  { value: '10K+', label: 'Active Learners', icon: Users, desc: 'Growing daily' },
  { value: '200+', label: 'Live Classes', icon: Calendar, desc: 'Weekly sessions' },
  { value: '98%', label: 'Success Rate', icon: TrendingUp, desc: 'Student satisfaction' },
]

const courses = [
  { title: 'Vastu for Beginners', desc: 'Master the ancient science of architecture and harmony', level: 'Beginner', students: 1250, rating: 4.8, price: 999, icon: Compass },
  { title: 'Advanced Astrology', desc: 'Deep dive into planetary positions and birth charts', level: 'Advanced', students: 850, rating: 4.9, price: 2499, icon: Moon },
  { title: 'Tarot Masterclass', desc: 'Learn to read tarot cards with confidence', level: 'Intermediate', students: 620, rating: 4.7, price: 1499, icon: Eye },
]

const gurus = [
  { name: 'Dr. Ananya Sharma', expertise: 'Vastu & Astrology', rating: 4.9, students: 250 },
  { name: 'Rajesh Kumar', expertise: 'Numerology & Tarot', rating: 4.8, students: 180 },
  { name: 'Priya Patel', expertise: 'Reiki & Healing', rating: 4.7, students: 210 },
]

const testimonials = [
  { name: 'Priya Sharma', role: 'Astrology Seeker', quote: 'The AI assessment revealed my true potential. The personalized roadmap transformed my understanding of Vedic Astrology.' },
  { name: 'Rahul Verma', role: 'Vastu Consultant', quote: 'From complete beginner to professional consultant in 6 months. Anya gave me the tools and confidence to serve my clients.' },
  { name: 'Ananya Reddy', role: 'Tarot Reader', quote: 'The AI mentor kept me consistent. I now read tarot professionally and have helped over 200 clients.' },
]

const aiFeatures = [
  { icon: Target, title: 'Personalized Path', desc: 'AI recommends best courses for you' },
  { icon: Calendar, title: 'Daily Practice', desc: 'Reminders and progress tracking' },
  { icon: Users, title: 'Guru Matching', desc: 'Find the perfect mentor for you' },
]

export default function HomePage() {
  const currentYear = new Date().getFullYear()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <>
      <ParticleBackground />

      {/* WhatsApp Float */}
      <a
        href="https://wa.me/9198906002105"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 text-white shadow-2xl shadow-green-500/30 transition-all hover:scale-105 hover:from-green-600 hover:to-emerald-600"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden text-sm font-medium sm:inline">Chat with us</span>
      </a>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-white/5 bg-background/95 p-3 backdrop-blur md:hidden">
        <Link href="/signup" className="flex-1">
          <CosmicButton size="sm" glow fullWidth>Start Free</CosmicButton>
        </Link>
      </div>

      {/* ========== HERO ========== */}
      <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-16 pt-20 md:pt-28">
        <motion.div style={{ opacity, scale }} className="absolute inset-0 -z-10">
          <div className="absolute left-10 top-20 h-80 w-80 rounded-full bg-purple-500/30 blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-pink-500/30 blur-3xl animate-float-reverse" />
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-3xl animate-pulse-glow" />
          <div className="absolute left-1/4 top-1/3 h-40 w-40 rounded-full bg-purple-400/10 blur-2xl animate-orbit" />
          <div className="absolute right-1/4 bottom-1/3 h-32 w-32 rounded-full bg-pink-400/10 blur-2xl animate-orbit-reverse" />
        </motion.div>

        <div className="container relative z-10 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 px-5 py-2.5 text-sm text-purple-300 glass"
            >
              <Bot className="h-4 w-4" />
              <span className="font-medium">🚀 AI-Powered Spiritual Learning OS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
            >
              Learn, Teach & Grow
              <br />
              <span className="gradient-text relative">
                with Verified Gurus
                <motion.span
                  className="absolute -inset-1 -z-10 blur-2xl bg-purple-500/30"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 3,
                     repeat: Infinity,
                     repeatType: "loop", }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
            >
              Master Vastu, Astrology, Numerology, Tarot & more with AI-powered guidance.
              Learn from verified gurus, track your progress, and transform your life.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link href="/signup">
                <CosmicButton size="lg" glow icon={<ArrowRight className="h-5 w-5" />}>
                  Start Your Journey
                </CosmicButton>
              </Link>
              <Link href="/courses">
                <CosmicButton size="lg" variant="outline">
                  Explore Knowledge
                </CosmicButton>
              </Link>
            </motion.div>

            <AIAssessmentSection />

            {/* AI Preview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-10 w-full max-w-md"
            >
              <GlassCard padding="sm" className="border-purple-500/20 bg-purple-500/5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-purple-500/20 p-2">
                    <Bot className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">✨ Ask Anya AI</p>
                    <p className="text-xs text-muted-foreground">Personalized guidance based on your birth details and goals</p>
                  </div>
                  <CosmicButton size="sm" glow variant="outline">Try Now</CosmicButton>
                </div>
              </GlassCard>
            </motion.div>

            {/* Trust Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> 500+ Verified Gurus</span>
              <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> 10K+ Active Learners</span>
              <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> 200+ Live Classes</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section className="border-y border-white/5 bg-muted/20 px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-3 inline-flex rounded-full p-3 glass">
                  <stat.icon className="h-6 w-6 text-purple-400" />
                </div>
                <div className="gradient-text text-3xl font-bold">{stat.value}</div>
                <div className="text-sm font-medium text-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== LEARNING PATHS ========== */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Your <span className="gradient-text">Learning Path</span>
            </h2>
            <p className="text-muted-foreground">From beginner to master — structured journeys for every seeker</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {courses.map((course, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard hover glow padding="md">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium glass">{course.level}</span>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-sm">{course.rating}</span>
                    </div>
                  </div>
                  <div className="mb-3 inline-flex rounded-lg bg-purple-500/10 p-2">
                    <course.icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold">{course.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{course.desc}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> {course.students}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="gradient-text text-lg font-bold">₹{course.price}</span>
                      <Link href="/courses">
                        <CosmicButton size="sm" glow>Enroll</CosmicButton>
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link href="/courses">
              <CosmicButton variant="outline" icon={<ChevronRight className="h-4 w-4" />}>
                View All Learning Paths
              </CosmicButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== GURU MARKETPLACE ========== */}
      <section className="bg-muted/20 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Meet Your <span className="gradient-text">Gurus</span>
            </h2>
            <p className="text-muted-foreground">Learn from verified experts in your chosen field</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {gurus.map((guru, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard hover padding="md">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-2xl font-bold text-white">
                      {guru.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{guru.name}</h3>
                      <p className="text-sm text-muted-foreground">{guru.expertise}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {guru.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {guru.students} students
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="/consultation">
                      <CosmicButton size="sm" glow fullWidth>Book Session</CosmicButton>
                    </Link>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link href="/consultation">
              <CosmicButton variant="outline" icon={<ChevronRight className="h-4 w-4" />}>
                View All Gurus
              </CosmicButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== AI MENTOR ========== */}
      <section className="bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-pink-500/10 px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 inline-flex rounded-full p-3 glass">
              <Bot className="h-8 w-8 text-purple-400" />
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Your Personal <span className="gradient-text">AI Mentor</span>
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Get personalized course recommendations, daily practice reminders, and guru matching based on your birth details and goals.
            </p>
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {aiFeatures.map((feature, i) => (
                <GlassCard key={i} padding="sm" hover>
                  <div className="flex flex-col items-center text-center">
                    <feature.icon className="mb-2 h-8 w-8 text-purple-400" />
                    <h4 className="font-semibold">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
            <Link href="/signup">
              <CosmicButton size="lg" glow icon={<ArrowRight className="h-5 w-5" />}>
                Try Anya AI Today
              </CosmicButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section id="testimonials" className="bg-muted/20 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              What Our <span className="gradient-text">Seekers</span> Say
            </h2>
            <p className="text-muted-foreground">Real stories of transformation</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard hover>
                  <div className="mb-3 flex items-center gap-1 text-yellow-400">
                    {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-current" />)}
                  </div>
                  <p className="text-sm italic text-muted-foreground">"{t.quote}"</p>
                  <div className="mt-4 border-t border-white/5 pt-4">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FOR STUDENTS / FOR GURUS ========== */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            <GlassCard hover glow padding="lg" className="border-purple-500/20 bg-purple-500/5">
              <div className="flex flex-col items-center text-center">
                <GraduationCap className="mb-4 h-12 w-12 text-purple-400" />
                <h3 className="text-2xl font-bold">For Students</h3>
                <p className="mt-2 text-muted-foreground">Learn from verified gurus, track your progress, and transform your life.</p>
                <ul className="mt-4 w-full space-y-2 text-left text-sm">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> AI-powered personalized learning</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> Live classes & mentorship</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> Progress tracking & certificates</li>
                </ul>
                <Link href="/signup" className="mt-6 w-full">
                  <CosmicButton glow fullWidth>Start Learning</CosmicButton>
                </Link>
              </div>
            </GlassCard>

            <GlassCard hover glow padding="lg" className="border-pink-500/20 bg-pink-500/5">
              <div className="flex flex-col items-center text-center">
                <Crown className="mb-4 h-12 w-12 text-pink-400" />
                <h3 className="text-2xl font-bold">For Gurus</h3>
                <p className="mt-2 text-muted-foreground">Build your academy, manage students, and grow your impact.</p>
                <ul className="mt-4 w-full space-y-2 text-left text-sm">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> Multi-tenant academy dashboard</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> Live classes & session booking</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> Revenue tracking & analytics</li>
                </ul>
                <Link href="/signup?role=instructor" className="mt-6 w-full">
                  <CosmicButton glow fullWidth>Start Teaching</CosmicButton>
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-pink-500/20 px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to <span className="gradient-text">Transform</span> Your Life?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Join thousands of seekers who have already unlocked their potential and discovered the ancient wisdom within.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <CosmicButton size="lg" glow icon={<ArrowRight className="h-5 w-5" />}>
                  Start Your Journey
                </CosmicButton>
              </Link>
              <Link href="/courses">
                <CosmicButton size="lg" variant="outline">
                  Explore Knowledge
                </CosmicButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-white/5 bg-background/95">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <span className="gradient-text">Anya</span>
              </Link>
              <p className="mt-3 text-sm text-muted-foreground">AI-Powered Spiritual Learning & Mentorship Platform</p>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/courses" className="text-muted-foreground transition-colors hover:text-foreground">Courses</Link></li>
                <li><Link href="/consultation" className="text-muted-foreground transition-colors hover:text-foreground">Consultation</Link></li>
                <li><Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">About Us</Link></li>
                <li><Link href="/blog" className="text-muted-foreground transition-colors hover:text-foreground">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/faq" className="text-muted-foreground transition-colors hover:text-foreground">FAQ</Link></li>
                <li><Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">Contact Us</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-purple-400" /> +91 98906 02105</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-purple-400" /> support@anya.com</li>
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-purple-400" /> India</li>
                <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-purple-400" /> 24/7 Support</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white/5 pt-8 text-center text-sm text-muted-foreground">
            <p>© {currentYear} Anya. All rights reserved. Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </>
  )
}