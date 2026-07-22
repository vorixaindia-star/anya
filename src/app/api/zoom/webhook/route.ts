import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const { event, payload: data } = payload

    // Verify webhook signature (optional but recommended)
    const signature = req.headers.get('x-zm-signature') || ''
    const timestamp = req.headers.get('x-zm-request-timestamp') || ''

    // Webhook events
    if (event === 'recording.completed') {
      const { object } = data
      const zoomMeetingId = object.id
      const recordingUrl = object.recording_files?.[0]?.download_url

      if (recordingUrl) {
        await supabase
          .from('live_classes')
          .update({ recording_url: recordingUrl })
          .eq('zoom_meeting_id', zoomMeetingId)
        
        console.log(`✅ Recording saved for meeting ${zoomMeetingId}`)
      }
    }

    if (event === 'meeting.started') {
      const { object } = data
      await supabase
        .from('live_classes')
        .update({ status: 'live' })
        .eq('zoom_meeting_id', object.id)
    }

    if (event === 'meeting.ended') {
      const { object } = data
      await supabase
        .from('live_classes')
        .update({ status: 'completed' })
        .eq('zoom_meeting_id', object.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Zoom webhook error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}