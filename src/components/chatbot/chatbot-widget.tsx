'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { Input } from '@/components/ui/input'
import { 
  MessageCircle, X, Send, Minimize2, Maximize2, 
  Bot, User, Loader2, Phone, Mail, User as UserIcon
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [visitorId, setVisitorId] = useState<string>('')
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadInfo, setLeadInfo] = useState({ name: '', email: '', phone: '' })
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Get or generate visitor ID
  useEffect(() => {
    let vid = localStorage.getItem('anya_visitor_id')
    if (!vid) {
      vid = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)
      localStorage.setItem('anya_visitor_id', vid)
    }
    setVisitorId(vid)
  }, [])

  // Fetch FAQs
  useEffect(() => {
    const fetchFaqs = async () => {
      const { data, error } = await supabase
        .from('chatbot_faqs')
        .select('*')
        .eq('is_active', true)
        .limit(6)

      if (!error && data) setFaqs(data)
    }
    fetchFaqs()
  }, [])

  // Load conversation on mount
  useEffect(() => {
    const loadConversation = async () => {
      if (!visitorId) return

      // Check if there's an existing active conversation
      const { data, error } = await supabase
        .from('chatbot_conversations')
        .select('id')
        .eq('visitor_id', visitorId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (data && !error) {
        setConversationId(data.id)
        // Load messages
        const { data: msgs } = await supabase
          .from('chatbot_messages')
          .select('*')
          .eq('conversation_id', data.id)
          .order('created_at', { ascending: true })
        if (msgs) setMessages(msgs)
      }
    }

    loadConversation()
  }, [visitorId])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen, isMinimized])

  const createConversation = async () => {
    const { data, error } = await supabase
      .from('chatbot_conversations')
      .insert([{
        visitor_id: visitorId,
        name: leadInfo.name || null,
        email: leadInfo.email || null,
        phone: leadInfo.phone || null,
        status: 'active',
      }])
      .select()
      .single()

    if (data && !error) {
      setConversationId(data.id)
      return data.id
    }
    return null
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    // If no conversation, create one
    let convId = conversationId
    if (!convId) {
      convId = await createConversation()
      if (!convId) {
        toast.error('Failed to start conversation')
        return
      }
    }

    // Add user message to UI
    const userMessage: Message = {
      id: 'temp_' + Date.now(),
      role: 'user',
      content: content.trim(),
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Save to Supabase
    const { data: savedUserMsg } = await supabase
      .from('chatbot_messages')
      .insert([{
        conversation_id: convId,
        role: 'user',
        content: content.trim(),
      }])
      .select()
      .single()

    // Send to AI API
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          conversationId: convId,
          history: messages.slice(-5),
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Add AI response to UI
        const aiMessage: Message = {
          id: 'ai_' + Date.now(),
          role: 'assistant',
          content: data.reply,
          created_at: new Date().toISOString(),
        }
        setMessages(prev => [...prev, aiMessage])

        // Save to Supabase
        await supabase
          .from('chatbot_messages')
          .insert([{
            conversation_id: convId,
            role: 'assistant',
            content: data.reply,
          }])
      } else {
        // Fallback response
        const fallbackMessage: Message = {
          id: 'ai_' + Date.now(),
          role: 'assistant',
          content: "I'm here to help! Could you please rephrase your question?",
          created_at: new Date().toISOString(),
        }
        setMessages(prev => [...prev, fallbackMessage])
      }
    } catch (error) {
      // Error fallback
      const errorMessage: Message = {
        id: 'ai_' + Date.now(),
        role: 'assistant',
        content: "I'm having a little trouble right now. Please try again in a moment.",
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickReply = (question: string) => {
    sendMessage(question)
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadInfo.name || !leadInfo.email) {
      toast.error('Please provide your name and email')
      return
    }

    // Update conversation with lead info
    if (conversationId) {
      await supabase
        .from('chatbot_conversations')
        .update({
          name: leadInfo.name,
          email: leadInfo.email,
          phone: leadInfo.phone || null,
        })
        .eq('id', conversationId)
    }

    setShowLeadForm(false)
    toast.success('Thanks! We\'ll get back to you soon! 🙏')

    // Send a follow-up message
    setTimeout(() => {
      sendMessage('Thank you for providing your details. How can I help you today?')
    }, 500)
  }

  // Quick replies based on common queries
  const quickReplies = [
    'What courses do you offer?',
    'How do I enroll?',
    'About consultations',
    'Pricing',
    'Become a guru',
    'Contact support',
  ]

  const faqReplies = faqs.map(f => f.question)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white shadow-2xl shadow-purple-500/30 hover:scale-105 transition"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="w-80 md:w-96"
        >
          <GlassCard
            padding="none"
            className={`overflow-hidden transition-all ${isMinimized ? 'h-14' : 'h-[500px]'}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/5 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-400" />
                <span className="font-semibold text-sm">Anya AI</span>
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 rounded-full hover:bg-white/10 transition"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="h-[320px] overflow-y-auto p-3 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm mt-4">
                      <Bot className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                      <p className="font-semibold">Hello! I'm Anya AI</p>
                      <p>How can I help you today?</p>
                      <div className="mt-4 space-y-1 text-xs">
                        <p>✨ 24/7 support</p>
                        <p>💬 Instant replies</p>
                        <p>🎯 Personalized guidance</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                            msg.role === 'user'
                              ? 'bg-purple-500/20 text-white'
                              : msg.role === 'system'
                              ? 'bg-yellow-500/10 text-yellow-200 border border-yellow-500/20'
                              : 'glass border border-white/10'
                          }`}
                        >
                          {msg.role === 'assistant' && (
                            <div className="flex items-center gap-1 text-xs text-purple-400 mb-0.5">
                              <Bot className="h-3 w-3" />
                              <span>Anya AI</span>
                            </div>
                          )}
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))
                  )}
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

                {/* Quick Replies */}
                <div className="p-2 border-t border-white/5">
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {quickReplies.slice(0, 4).map((reply) => (
                      <button
                        key={reply}
                        onClick={() => sendMessage(reply)}
                        className="text-xs whitespace-nowrap px-3 py-1 rounded-full glass border border-white/10 hover:bg-white/5 transition"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FAQ Suggestions */}
                {faqReplies.length > 0 && (
                  <div className="px-2 pb-1 flex gap-1.5 overflow-x-auto">
                    {faqReplies.slice(0, 3).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReply(q)}
                        className="text-xs whitespace-nowrap px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition"
                      >
                        💡 {q.length > 20 ? q.substring(0, 20) + '...' : q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Lead Capture Form */}
                {showLeadForm && (
                  <div className="p-3 border-t border-white/5 bg-purple-500/5">
                    <form onSubmit={handleLeadSubmit} className="space-y-2">
                      <p className="text-xs text-muted-foreground">Share your details to get priority support</p>
                      <Input
                        placeholder="Your name"
                        value={leadInfo.name}
                        onChange={(e) => setLeadInfo({ ...leadInfo, name: e.target.value })}
                        className="bg-white/5 border-white/10 text-sm h-8"
                        required
                      />
                      <Input
                        placeholder="Your email"
                        type="email"
                        value={leadInfo.email}
                        onChange={(e) => setLeadInfo({ ...leadInfo, email: e.target.value })}
                        className="bg-white/5 border-white/10 text-sm h-8"
                        required
                      />
                      <Input
                        placeholder="Phone (optional)"
                        value={leadInfo.phone}
                        onChange={(e) => setLeadInfo({ ...leadInfo, phone: e.target.value })}
                        className="bg-white/5 border-white/10 text-sm h-8"
                      />
                      <CosmicButton size="sm" glow fullWidth type="submit">
                        Submit
                      </CosmicButton>
                    </form>
                  </div>
                )}

                {/* Input */}
                <div className="p-3 border-t border-white/5 flex gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                    disabled={loading}
                    className="bg-white/5 border-white/10 flex-1"
                  />
                  <CosmicButton
                    size="sm"
                    glow
                    onClick={() => sendMessage(input)}
                    disabled={loading || !input.trim()}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </CosmicButton>
                </div>

                {/* Lead capture button */}
                {!showLeadForm && (
                  <div className="px-3 pb-3">
                    <button
                      onClick={() => setShowLeadForm(true)}
                      className="text-xs text-muted-foreground hover:text-purple-400 transition flex items-center gap-1"
                    >
                      <UserIcon className="h-3 w-3" />
                      Want personalized support? Share your details
                    </button>
                  </div>
                )}
              </>
            )}
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}