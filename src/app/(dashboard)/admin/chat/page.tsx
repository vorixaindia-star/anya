'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CosmicButton } from '@/components/ui/cosmic-button'
import { MessageCircle, User, Mail, Phone, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConv, setSelectedConv] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from('chatbot_conversations')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) setConversations(data)
      setLoading(false)
    }

    fetchConversations()
  }, [])

  useEffect(() => {
    if (!selectedConv) return
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chatbot_messages')
        .select('*')
        .eq('conversation_id', selectedConv)
        .order('created_at', { ascending: true })

      if (!error && data) setMessages(data)
    }
    fetchMessages()
  }, [selectedConv])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold tracking-tight mb-8">💬 Chat Conversations</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="md:col-span-1 space-y-3">
          {loading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : conversations.length === 0 ? (
            <GlassCard padding="md" className="text-center py-8">
              <p className="text-muted-foreground">No conversations yet</p>
            </GlassCard>
          ) : (
            conversations.map((conv) => (
              <GlassCard
                key={conv.id}
                padding="sm"
                className={`cursor-pointer hover:border-purple-500/30 transition ${
                  selectedConv === conv.id ? 'border-purple-500/50 bg-purple-500/5' : ''
                }`}
                onClick={() => setSelectedConv(conv.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{conv.name || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground truncate">{conv.email || 'No email'}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    conv.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    conv.status === 'resolved' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {conv.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(conv.created_at).toLocaleDateString()}
                  </span>
                </div>
              </GlassCard>
            ))
          )}
        </div>

        {/* Messages View */}
        <div className="md:col-span-2">
          {selectedConv ? (
            <GlassCard padding="md" className="h-[500px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        msg.role === 'user'
                          ? 'bg-purple-500/20'
                          : 'glass border border-white/10'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <span className="text-xs text-purple-400">🤖 Anya AI</span>
                      )}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          ) : (
            <GlassCard padding="lg" className="text-center py-20">
              <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">Select a conversation to view messages</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}