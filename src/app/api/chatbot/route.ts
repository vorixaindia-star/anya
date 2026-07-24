import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Fallback responses if AI API fails
const fallbackResponses = [
  "I'm here to help! Could you please tell me more about what you're looking for?",
  "That's a great question! Let me connect you with the right resource.",
  "I'd love to help you with that. Could you provide more details?",
  "Thanks for your message! One moment while I find the best answer for you.",
  "I understand you're asking about this. Let me guide you to the right person.",
]

export async function POST(req: NextRequest) {
  try {
    const { message, conversationId, history } = await req.json()

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Try to find a matching FAQ first (quick reply)
    const { data: faq } = await supabase
      .from('chatbot_faqs')
      .select('answer')
      .eq('is_active', true)
      .filter('keywords', 'cs', `{${message.toLowerCase()}}`)

    // If FAQ found, return it instantly
    if (faq && faq.length > 0) {
      return NextResponse.json({
        success: true,
        reply: faq[0].answer,
        source: 'faq',
      })
    }

    // Try AI API (OpenAI / Groq / Gemini)
    let aiReply = null

    try {
      // Try OpenAI first
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are Anya AI, a friendly and knowledgeable assistant for Anya — an AI-powered spiritual learning platform. 
              You help users with courses in Vastu, Astrology, Numerology, Tarot, Reiki, and Healing.
              You can guide users to enroll in courses, book consultations, visit the store, and use AI Guruji.
              Keep responses helpful, warm, and concise.`
            },
            ...(history || []).map((h: any) => ({ role: h.role, content: h.content })),
            { role: 'user', content: message },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      })

      if (openaiResponse.ok) {
        const data = await openaiResponse.json()
        aiReply = data.choices?.[0]?.message?.content
      }
    } catch (openaiError) {
      console.warn('OpenAI API failed, trying fallback...')
    }

    // If OpenAI fails, try Groq
    if (!aiReply) {
      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              {
                role: 'system',
                content: `You are Anya AI, a friendly assistant for Anya platform. Help users with courses, consultations, store, and AI Guruji. Be warm and helpful.`
              },
              { role: 'user', content: message },
            ],
            max_tokens: 300,
          }),
        })

        if (groqResponse.ok) {
          const data = await groqResponse.json()
          aiReply = data.choices?.[0]?.message?.content
        }
      } catch (groqError) {
        console.warn('Groq API failed, using fallback...')
      }
    }

    // If all AI APIs fail, use fallback
    if (!aiReply) {
      const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      aiReply = fallback
    }

    // Escalate if user asks for human support
    const escalationKeywords = ['human', 'agent', 'support', 'call', 'talk', 'speak', 'person', 'real']
    if (escalationKeywords.some(kw => message.toLowerCase().includes(kw))) {
      aiReply += "\n\nI can connect you with a real human support agent. Please share your details and we'll get back to you shortly."
    }

    return NextResponse.json({
      success: true,
      reply: aiReply,
      source: 'ai',
    })

  } catch (error: any) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}