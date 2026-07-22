import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { topic, startTime, duration, agenda } = await req.json()

    // Get Zoom access token
    const tokenRes = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
      }
    )

    const { access_token } = await tokenRes.json()

    // Create meeting
    const meetingRes = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        type: 2,
        start_time: startTime,
        duration,
        agenda,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
          mute_upon_entry: true,
          waiting_room: false,
          auto_recording: 'cloud',
        },
      }),
    })

    const data = await meetingRes.json()

    if (data.code) {
      throw new Error(data.message)
    }

    return NextResponse.json({
      success: true,
      meetingId: data.id,
      joinUrl: data.join_url,
      startUrl: data.start_url,
      password: data.password,
    })
  } catch (error: any) {
    console.error('Zoom API error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create meeting' },
      { status: 500 }
    )
  }
}