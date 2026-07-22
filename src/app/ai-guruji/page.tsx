'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { Input } from '@/components/ui/input'
import { Bot, Send, Sparkles, Crown, Star, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface Session {
  id: string
  subject: string
  free_questions_used: number
  max_free_questions: number
  status: string
}

const subjects = [
  { id: 'astrology', name: '🔮 Astrology', desc: 'Birth chart, planetary positions, horoscope' },
  { id: 'palmistry', name: '✋ Palmistry', desc: 'Lines, mounts, hand analysis' },
  { id: 'vastu', name: '🏠 Vastu', desc: 'Directions, elements, home remedies' },
  { id: 'tarot', name: '🃏 Tarot', desc: 'Card readings, spreads, interpretations' },
  { id: 'numerology', name: '🔢 Numerology', desc: 'Numbers, vibrations, name analysis' },
]

export default function AIGurujiPage() {
  const { user } = useAuth()
  const [session, setSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [showReport, setShowReport] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user || !selectedSubject) return

    const loadSession = async () => {
      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (data) {
        setSession(data)
        const { data: msgs } = await supabase
          .from('ai_chat_messages')
          .select('*')
          .eq('session_id', data.id)
          .order('created_at', { ascending: true })
        if (msgs) setMessages(msgs)
      } else {
        createSession()
      }
    }

    loadSession()
  }, [user, selectedSubject])

  const createSession = async () => {
    if (!user || !selectedSubject) return

    const { data, error } = await supabase
      .from('ai_chat_sessions')
      .insert([{
        user_id: user.id,
        subject: selectedSubject,
        free_questions_used: 0,
        max_free_questions: 2,
        status: 'active',
      }])
      .select()
      .single()

    if (!error && data) {
      setSession(data)
      await addMessage(data.id, 'assistant', 
        `Namaste! I'm your AI Guruji for ${subjects.find(s => s.id === selectedSubject)?.name}. Ask me anything! (You have 2 free questions.)`
      )
    }
  }

  const addMessage = async (sessionId: string, role: string, content: string) => {
    const { data, error } = await supabase
      .from('ai_chat_messages')
      .insert([{ session_id: sessionId, role, content }])
      .select()
      .single()

    if (!error && data) {
      setMessages(prev => [...prev, data])
    }
  }

  const handleSend = async () => {
    if (!input.trim() || !session || !user) return

    if (session.free_questions_used >= session.max_free_questions) {
      toast.info('Free questions used. Get detailed report for ₹199!')
      setShowReport(true)
      return
    }

    setLoading(true)
    const userMessage = input
    setInput('')

    await addMessage(session.id, 'user', userMessage)

    // Simulate AI response
    setTimeout(async () => {
      const responses: Record<string, string[]> = {
        astrology: [
          "Based on your birth chart, Jupiter is in your 10th house — indicating great career success.",
          "Your Moon sign is Cancer — you're emotionally intuitive and deeply connected to family.",
          "Saturn's transit is affecting your 4th house — some challenges at home, but temporary.",
        ],
        palmistry: [
          "Your life line is deep and clear — you have strong vitality and will live a long life.",
          "The heart line shows you're romantic and passionate — but sometimes you overthink.",
          "Your fate line curves towards the Mount of Jupiter — you'll achieve career recognition.",
        ],
        vastu: [
          "Your home's entrance is in the East — very auspicious! Kitchen should be in South-East.",
          "The North-East corner is where energy flows. Keep it clean and open.",
          "Place a pyramid in the South-West corner of your bedroom for better sleep.",
        ],
        tarot: [
          "The Fool card — a new beginning is coming. Take the leap with confidence.",
          "The Tower card indicates sudden change — but it's for your growth. Embrace it.",
          "The Sun card — happiness and success are heading your way.",
        ],
        numerology: [
          "Your life path number is 7 — you're a seeker of truth and wisdom.",
          "Your name number is 3 — you're creative, expressive, and love socializing.",
          "Your destiny number is 9 — you're a humanitarian at heart.",
        ],
      }

      const subjectResponses = responses[selectedSubject] || ['I sense great energy around you. Tell me more!']
      const reply = subjectResponses[Math.floor(Math.random() * subjectResponses.length)]

      await addMessage(session.id, 'assistant', reply)
      
      const newCount = session.free_questions_used + 1
      await supabase
        .from('ai_chat_sessions')
        .update({ free_questions_used: newCount })
        .eq('id', session.id)
      
      setSession(prev => prev ? { ...prev, free_questions_used: newCount } : null)
      
      if (newCount >= session.max_free_questions) {
        setShowReport(true)
        toast.info('Get a detailed report for ₹199!')
      }
      setLoading(false)
    }, 1500)
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Please login to chat with AI Guruji</p>
      </div>
    )
  }

  if (!selectedSubject) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold tracking-tight mb-2">AI Guruji</h1>
        <p className="text-muted-foreground mb-8">Select a subject to start your consultation</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <GlassCard
              key={s.id}
              hover
              padding="md"
              className="cursor-pointer"
              onClick={() => setSelectedSubject(s.id)}
            >
              <div className="text-2xl mb-2">{s.name.split(' ')[0]}</div>
              <h3 className="font-semibold">{s.name}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
              <div className="mt-2 text-xs text-purple-400">2 free questions → ₹199 for full report</div>
            </GlassCard>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pt-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <button
            onClick={() => setSelectedSubject(null)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">AI Guruji - {subjects.find(s => s.id === selectedSubject)?.name}</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Free: {session?.free_questions_used}/{session?.max_free_questions}
        </div>
      </div>

      {showReport && (
        <GlassCard className="mb-4 border-purple-500/20 bg-purple-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-400" />
                Get Detailed Report
              </h3>
              <p className="text-sm text-muted-foreground">Personalized full report with remedies and guidance</p>
            </div>
            <CosmicButton size="sm" glow>
              ₹199 - Buy Now
            </CosmicButton>
          </div>
        </GlassCard>
      )}

      <GlassCard padding="none" className="overflow-hidden">
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-purple-500/20 text-white'
                    : 'glass border border-white/10'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1 text-xs text-purple-400 mb-1">
                    <Bot className="h-3 w-3" />
                    <span>AI Guruji</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="glass border border-white/10 rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" />
                  <span className="h-2 w-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-white/5 p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading || (session && session.free_questions_used >= session.max_free_questions && !showReport)}
            />
            <CosmicButton size="sm" glow onClick={handleSend} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </CosmicButton>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}