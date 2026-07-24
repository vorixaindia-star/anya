export type UserRole = 'student' | 'instructor' | 'admin' | 'expert'

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: UserRole
  bio?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  subtitle?: string
  description: string
  price: number
  thumbnail_url?: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'professional' | 'master'
  instructor_id: string
  status: 'draft' | 'published' | 'archived'
  total_students?: number
  rating?: number
  created_at: string
  updated_at: string
}

export interface Module {
  id: string
  course_id: string
  title: string
  description?: string
  order: number
  lessons?: Lesson[]
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  description?: string
  video_url?: string
  pdf_url?: string
  is_free_preview: boolean
  order: number
  duration?: number
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  progress: number
  completed: boolean
  enrolled_at: string
  completed_at?: string
  course?: Course
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_price?: number
  images: string[]
  category: string
  stock: number
  rating: number
  total_reviews: number
  vendor_id?: string
  vendor?: { business_name: string }
  is_active: boolean
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  product?: Product
}