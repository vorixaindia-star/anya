'use client'

import { motion } from 'framer-motion'
import { Brain, Sparkles, Target, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function AIAssessmentSection() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />

      <div className="container mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
            viewport={{ once: true }}
          >

            <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-violet-300">
              <Sparkles size={16}/>
              AI Powered Assessment
            </span>

            <h2 className="mt-6 text-5xl font-bold leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                Spiritual Path
              </span>
            </h2>

            <p className="mt-6 text-lg text-zinc-400 leading-8">
              Our AI understands your interests, personality,
              goals and learning style to build your personal
              roadmap.
            </p>

            <div className="mt-10 space-y-5">

              {[
                "AI Personality Analysis",
                "Best Guru Recommendation",
                "Personal Learning Roadmap",
                "Career & Certification Path"
              ].map((item)=>(
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="text-green-400"/>
                  <span>{item}</span>
                </div>
              ))}

            </div>

            <Link href="/assessment">
              <button className="mt-10 flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-4 font-semibold transition hover:scale-105">
                Start Free Assessment
                <ArrowRight size={18}/>
              </button>
            </Link>

          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity:0, x:60 }}
            whileInView={{ opacity:1, x:0 }}
            transition={{ duration:.8 }}
            viewport={{ once:true }}
          >

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

              <div className="flex items-center gap-3">
                <Brain className="text-violet-400"/>
                <h3 className="text-xl font-bold">
                  AI Analysis
                </h3>
              </div>

              <div className="mt-10">

                <div className="mb-2 flex justify-between text-sm">
                  <span>Scanning Personality...</span>
                  <span>96%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                  <motion.div
                    initial={{ width:0 }}
                    whileInView={{ width:"96%" }}
                    transition={{ duration:2 }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                  />
                </div>

              </div>

              <div className="mt-10 grid gap-4">

                <div className="rounded-xl bg-white/5 p-4">
                  ⭐ Recommended Course
                  <div className="mt-2 font-semibold">
                    Advanced Astrology
                  </div>
                </div>

                <div className="rounded-xl bg-white/5 p-4">
                  👨‍🏫 Best Guru Match
                  <div className="mt-2 font-semibold">
                    Dr. Ananya Sharma
                  </div>
                </div>

                <div className="rounded-xl bg-white/5 p-4">
                  🎯 Success Probability
                  <div className="mt-2 text-3xl font-bold text-green-400">
                    98%
                  </div>
                </div>

              </div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  )
}