export type User = {
  id: number
  username: string
  email: string
  password_hash: string
  avatar_url: string | null
  is_admin: boolean
  is_moderator: boolean
  created_at: Date
  last_login: Date | null
  post_count: number
  is_banned: boolean
}

export type Category = {
  id: number
  name: string
  description: string | null
  display_order: number
  created_at: Date
}

export type Forum = {
  id: number
  category_id: number
  name: string
  description: string | null
  display_order: number
  created_at: Date
  last_post_at: Date | null
  thread_count: number
  post_count: number
}

export type Thread = {
  id: number
  forum_id: number
  user_id: number | null
  title: string
  is_sticky: boolean
  is_locked: boolean
  view_count: number
  created_at: Date
  last_post_at: Date | null
  post_count: number
}

export type Post = {
  id: number
  thread_id: number
  user_id: number | null
  content: string
  created_at: Date
  updated_at: Date | null
  is_deleted: boolean
}

export type UserProfile = {
  user_id: number
  display_name: string | null
  signature: string | null
  location: string | null
  website: string | null
  bio: string | null
  join_date: Date
  birth_date: Date | null
}

export type PrivateMessage = {
  id: number
  sender_id: number | null
  recipient_id: number | null
  subject: string
  content: string
  is_read: boolean
  created_at: Date
}