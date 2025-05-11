export type User = {
  id: number
  username: string
  email: string
  password_hash: string
  avatar_url: string | null
  created_at: Date
  last_login: Date | null
  post_count: number
  is_banned: boolean
  roles: Role[]
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

export type Role = {
  id: number
  name: string                // e.g., 'Administrator', 'Moderator', 'Member'
  description: string | null
}

export type UserRole = {
  user_id: number
  role_id: number
  assigned_at: Date
}

export type Permission = {
  id: number
  code: string                // e.g., 'THREAD_LOCK', 'POST_DELETE'
  description: string | null
}

export type RolePermission = {
  role_id: number
  permission_id: number
  granted_at: Date
}

export type UserPermission = {
  user_id: number
  permission_id: number
  is_granted: boolean
}

export type Attachment = {
  id: number
  post_id: number
  uploader_id: number | null
  file_name: string
  file_size: number
  mime_type: string | null
  url: string
  uploaded_at: Date
}

export type Poll = {
  id: number
  thread_id: number
  question: string
  expires_at: Date | null
}

export type PollOption = {
  id: number
  poll_id: number
  option_text: string
  display_order: number
}

export type PollVote = {
  poll_id: number
  option_id: number
  user_id: number
  voted_at: Date
}

export type Subscription = {
  user_id: number
  thread_id: number
  subscribed_at: Date
}

export type Notification = {
  id: number
  user_id: number
  type: string                // e.g., 'NEW_POST', 'MENTION'
  reference_id: number | null // e.g., post_id or thread_id
  is_read: boolean
  created_at: Date
}

export type Favorite = {
  user_id: number
  thread_id: number | null
  post_id: number | null
  favorited_at: Date
}

export type ReputationEvent = {
  id: number
  user_id: number
  event_type: string          // e.g., 'POST_UPVOTE', 'ACCEPTED_ANSWER'
  delta: number               // e.g., +10, -2
  created_at: Date
}

export type Badge = {
  id: number
  name: string
  description: string | null
}

export type UserBadge = {
  user_id: number
  badge_id: number
  awarded_at: Date
}

export type Tag = {
  id: number
  name: string
}

export type ThreadTag = {
  thread_id: number
  tag_id: number
}

export type Report = {
  id: number
  reporter_id: number | null
  content_type: string,       // 'thread' or 'post'
  content_id: number
  reason: string | null
  created_at: Date
  handled_by: number | null
}

export type ModerationLog = {
  id: number
  moderator_id: number | null
  action: string              // e.g., 'POST_DELETED', 'USER_BANNED'
  target_type: string         // 'post', 'thread', 'user', etc.
  target_id: number | null
  created_at: Date
  notes: string | null
}