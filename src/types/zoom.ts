export interface ZoomMeeting {
    id: string
    topic: string
    start_time: string
    duration: number
    join_url: string
    start_url: string
    password?: string
    agenda?: string
  }
  
  export interface ZoomWebhookPayload {
    event: 'meeting.started' | 'meeting.ended' | 'recording.completed'
    payload: {
      object: {
        id: string
        recording_files?: Array<{
          download_url: string
          file_type: string
        }>
      }
    }
  }