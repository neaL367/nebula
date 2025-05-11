"use server"

import { neon } from "@neondatabase/serverless"
import {
  Category,
  Forum,
  Thread,
  Post,
  User,
  UserProfile,
  PrivateMessage,
  Role,
  // UserRole,
  Permission,
  RolePermission,
  UserPermission,
  Attachment,
  Poll,
  PollOption,
  PollVote,
  Subscription,
  Notification,
  Favorite,
  ReputationEvent,
  Badge,
  UserBadge,
  Tag,
  ThreadTag,
  Report,
  ModerationLog
} from "./schema"

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}
export const sql = neon(process.env.DATABASE_URL)

// Categories
export async function getCategories(): Promise<Category[]> {
  const result = await sql`SELECT * FROM categories ORDER BY display_order, name`
  return result as Category[]
}

// Forums
export async function getForumsByCategory(categoryId: number): Promise<Forum[]> {
  const result = await sql`SELECT * FROM forums WHERE category_id = ${categoryId} ORDER BY display_order, name`
  return result as Forum[]
}

// Threads
export async function getThreadsByForum(forumId: number, page = 1, limit = 20): Promise<Thread[]> {
  const offset = (page - 1) * limit
  const result = await sql`
    SELECT * FROM threads
    WHERE forum_id = ${forumId}
    ORDER BY is_sticky DESC, last_post_at DESC
    LIMIT ${limit} OFFSET ${offset}`
  return result as Thread[]
}

// Posts
export async function getPostsByThread(threadId: number, page = 1, limit = 20): Promise<Post[]> {
  const offset = (page - 1) * limit
  const result = await sql`
    SELECT * FROM posts
    WHERE thread_id = ${threadId} AND is_deleted = false
    ORDER BY created_at ASC
    LIMIT ${limit} OFFSET ${offset}`
  return result as Post[]
}

// Users
export async function getUserById(id: number): Promise<User | null> {
  const rows = await sql`SELECT * FROM users WHERE id = ${id}`
  return rows.length ? (rows[0] as User) : null
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const rows = await sql`SELECT * FROM users WHERE username = ${username}`
  return rows.length ? (rows[0] as User) : null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const rows = await sql`SELECT * FROM users WHERE email = ${email}`
  return rows.length ? (rows[0] as User) : null
}

// User Profiles
export async function getUserProfile(userId: number): Promise<UserProfile | null> {
  const rows = await sql`SELECT * FROM user_profiles WHERE user_id = ${userId}`
  return rows.length ? (rows[0] as UserProfile) : null
}

// Private Messages
export async function getInbox(userId: number): Promise<PrivateMessage[]> {
  const rows = await sql`SELECT * FROM private_messages WHERE recipient_id = ${userId} ORDER BY created_at DESC`
  return rows as PrivateMessage[]
}

export async function getSentMessages(userId: number): Promise<PrivateMessage[]> {
  const rows = await sql`SELECT * FROM private_messages WHERE sender_id = ${userId} ORDER BY created_at DESC`
  return rows as PrivateMessage[]
}

// Roles & Permissions
export async function getRoles(): Promise<Role[]> {
  const rows = await sql`SELECT * FROM roles ORDER BY name`
  return rows as Role[]
}

export async function getUserRoles(userId: number): Promise<Role[]> {
  const rows = await sql`
    SELECT r.id, r.name, r.description
      FROM roles r
      JOIN user_roles ur
        ON ur.role_id = r.id
     WHERE ur.user_id = ${userId}
     ORDER BY r.name
  `
  return rows as Role[]
}

export async function getPermissions(): Promise<Permission[]> {
  const rows = await sql`SELECT * FROM permissions ORDER BY code`
  return rows as Permission[]
}

export async function getRolePermissions(roleId: number): Promise<RolePermission[]> {
  const rows = await sql`SELECT * FROM role_permissions WHERE role_id = ${roleId}`
  return rows as RolePermission[]
}

export async function getUserPermissions(userId: number): Promise<UserPermission[]> {
  const rows = await sql`SELECT * FROM user_permissions WHERE user_id = ${userId}`
  return rows as UserPermission[]
}

// Attachments
export async function getAttachmentsByPost(postId: number): Promise<Attachment[]> {
  const rows = await sql`SELECT * FROM attachments WHERE post_id = ${postId}`
  return rows as Attachment[]
}

// Polls
export async function getPollByThread(threadId: number): Promise<Poll | null> {
  const rows = await sql`SELECT * FROM polls WHERE thread_id = ${threadId}`
  return rows.length ? (rows[0] as Poll) : null
}

export async function getPollOptions(pollId: number): Promise<PollOption[]> {
  const rows = await sql`SELECT * FROM poll_options WHERE poll_id = ${pollId} ORDER BY display_order`
  return rows as PollOption[]
}

export async function getPollVotes(pollId: number): Promise<PollVote[]> {
  const rows = await sql`SELECT * FROM poll_votes WHERE poll_id = ${pollId}`
  return rows as PollVote[]
}

// Subscriptions & Notifications
export async function getSubscriptions(userId: number): Promise<Subscription[]> {
  const rows = await sql`SELECT * FROM subscriptions WHERE user_id = ${userId}`
  return rows as Subscription[]
}

export async function getNotifications(userId: number): Promise<Notification[]> {
  const rows = await sql`SELECT * FROM notifications WHERE user_id = ${userId} ORDER BY created_at DESC`
  return rows as Notification[]
}

// Favorites
export async function getFavorites(userId: number): Promise<Favorite[]> {
  const rows = await sql`SELECT * FROM favorites WHERE user_id = ${userId}`
  return rows as Favorite[]
}

// Reputation & Badges
export async function getReputationEvents(userId: number): Promise<ReputationEvent[]> {
  const rows = await sql`SELECT * FROM reputation_events WHERE user_id = ${userId} ORDER BY created_at DESC`
  return rows as ReputationEvent[]
}

export async function getUserBadges(userId: number): Promise<UserBadge[]> {
  const rows = await sql`SELECT * FROM user_badges WHERE user_id = ${userId}`
  return rows as UserBadge[]
}

export async function getBadges(): Promise<Badge[]> {
  const rows = await sql`SELECT * FROM badges ORDER BY name`
  return rows as Badge[]
}

// Tags
export async function getTags(): Promise<Tag[]> {
  const rows = await sql`SELECT * FROM tags ORDER BY name`
  return rows as Tag[]
}

export async function getThreadTags(threadId: number): Promise<ThreadTag[]> {
  const rows = await sql`SELECT * FROM thread_tags WHERE thread_id = ${threadId}`
  return rows as ThreadTag[]
}

// Reports & Moderation Logs
export async function getReports(): Promise<Report[]> {
  const rows = await sql`SELECT * FROM reports ORDER BY created_at DESC`
  return rows as Report[]
}

export async function getModerationLogs(): Promise<ModerationLog[]> {
  const rows = await sql`SELECT * FROM moderation_logs ORDER BY created_at DESC`
  return rows as ModerationLog[]
}

export async function createCategory(name: string, description: string | null, displayOrder = 0): Promise<Category> {
  const [category] = await sql`
    INSERT INTO categories (name, description, display_order)
    VALUES (${name}, ${description}, ${displayOrder}) RETURNING *
  `
  return category as Category
}

export async function createForum(categoryId: number, name: string, description: string | null, displayOrder = 0): Promise<Forum> {
  const [forum] = await sql`
    INSERT INTO forums (category_id, name, description, display_order)
    VALUES (${categoryId}, ${name}, ${description}, ${displayOrder}) RETURNING *
  `
  return forum as Forum
}

export async function createThread(forumId: number, userId: number, title: string, content: string): Promise<Thread> {
  const [thread] = await sql`
    INSERT INTO threads (forum_id, user_id, title)
    VALUES (${forumId}, ${userId}, ${title}) RETURNING *
  ` as Thread[]

  await sql`
    INSERT INTO posts (thread_id, user_id, content)
    VALUES (${thread.id}, ${userId}, ${content})
  `

  // update counts omitted for brevity
  return thread
}

export async function createPost(threadId: number, userId: number, content: string): Promise<Post> {
  const [post] = await sql`
    INSERT INTO posts (thread_id, user_id, content)
    VALUES (${threadId}, ${userId}, ${content}) RETURNING *
  ` as Post[]

  // updates omitted for brevity
  return post
}

export async function createUser(username: string, email: string, passwordHash: string): Promise<User> {
  const [user] = await sql`
    INSERT INTO users (username, email, password_hash)
    VALUES (${username}, ${email}, ${passwordHash}) RETURNING *
  ` as User[]
  await sql`INSERT INTO user_profiles (user_id) VALUES (${user.id})`
  return user
}

export async function sendPrivateMessage(senderId: number, recipientId: number, subject: string, content: string): Promise<PrivateMessage> {
  const [msg] = await sql`
    INSERT INTO private_messages (sender_id, recipient_id, subject, content)
    VALUES (${senderId}, ${recipientId}, ${subject}, ${content}) RETURNING *
  ` as PrivateMessage[]
  return msg
}

export async function updateCategory(id: number, fields: Partial<Pick<Category, 'name' | 'description' | 'display_order'>>): Promise<Category> {
  const { name, description, display_order } = fields
  const [updated] = await sql`
    UPDATE categories SET
      name = COALESCE(${name}, name),
      description = COALESCE(${description}, description),
      display_order = COALESCE(${display_order}, display_order)
    WHERE id = ${id}
    RETURNING *
  `
  return updated as Category
}


export async function updateForum(id: number, fields: Partial<Pick<Forum, 'name' | 'description' | 'display_order'>>): Promise<Forum> {
  const { name, description, display_order } = fields
  const [updated] = await sql`
    UPDATE forums SET
      name = COALESCE(${name}, name),
      description = COALESCE(${description}, description),
      display_order = COALESCE(${display_order}, display_order)
    WHERE id = ${id}
    RETURNING *
  `
  return updated as Forum
}

export async function patchThread(id: number, fields: Partial<Pick<Thread, 'title' | 'is_sticky' | 'is_locked'>>): Promise<Thread> {
  const { title, is_sticky, is_locked } = fields
  const [updated] = await sql`
    UPDATE threads SET
      title = COALESCE(${title}, title),
      is_sticky = COALESCE(${is_sticky}, is_sticky),
      is_locked = COALESCE(${is_locked}, is_locked)
    WHERE id = ${id}
    RETURNING *
  `
  return updated as Thread
}

export async function updatePost(id: number, content: string): Promise<Post> {
  const [updated] = await sql`
    UPDATE posts SET content = ${content}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id} RETURNING *
  `
  return updated as Post
}

export async function updateUserProfile(userId: number, fields: Partial<Omit<UserProfile, 'user_id'>>): Promise<UserProfile> {
  const { display_name, signature, location, website, bio, join_date, birth_date } = fields
  const [updated] = await sql`
    UPDATE user_profiles SET
      display_name = COALESCE(${display_name}, display_name),
      signature = COALESCE(${signature}, signature),
      location = COALESCE(${location}, location),
      website = COALESCE(${website}, website),
      bio = COALESCE(${bio}, bio),
      join_date = COALESCE(${join_date}, join_date),
      birth_date = COALESCE(${birth_date}, birth_date)
    WHERE user_id = ${userId}
    RETURNING *
  `
  return updated as UserProfile
}

export async function deleteCategory(id: number): Promise<void> {
  await sql`DELETE FROM categories WHERE id = ${id}`
}

export async function deleteForum(id: number): Promise<void> {
  await sql`DELETE FROM forums WHERE id = ${id}`
}

export async function deleteThread(id: number): Promise<void> {
  await sql`DELETE FROM threads WHERE id = ${id}`
}

export async function deletePost(id: number): Promise<void> {
  // soft delete
  await sql`UPDATE posts SET is_deleted = true WHERE id = ${id}`
}

export async function banUser(userId: number): Promise<void> {
  await sql`UPDATE users SET is_banned = true WHERE id = ${userId}`
}

export async function deletePrivateMessage(id: number): Promise<void> {
  await sql`DELETE FROM private_messages WHERE id = ${id}`
}
