"use server"

import { neon } from "@neondatabase/serverless"
import { Category, Forum, Post, Thread, User, UserProfile } from "./schema"

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}
export const sql = neon(process.env.DATABASE_URL)

export async function getCategories(): Promise<Category[]> {
  const result = await sql`
    SELECT * FROM categories 
    ORDER BY display_order ASC, name ASC
  `
  return result as Category[]
}

export async function getForumsByCategory(categoryId: number): Promise<Forum[]> {
  const result = await sql`
    SELECT * FROM forums 
    WHERE category_id = ${categoryId} 
    ORDER BY display_order ASC, name ASC
  `
  return result as Forum[]
}

export async function getThreadsByForum(forumId: number, page = 1, limit = 20): Promise<Thread[]> {
  const offset = (page - 1) * limit
  const result = await sql`
    SELECT * FROM threads 
    WHERE forum_id = ${forumId} 
    ORDER BY is_sticky DESC, last_post_at DESC 
    LIMIT ${limit} OFFSET ${offset}
  `
  return result as Thread[]
}

export async function getPostsByThread(threadId: number, page = 1, limit = 20): Promise<Post[]> {
  const offset = (page - 1) * limit
  const result = await sql`
    SELECT * FROM posts 
    WHERE thread_id = ${threadId} AND is_deleted = false
    ORDER BY created_at ASC 
    LIMIT ${limit} OFFSET ${offset}
  `
  return result as Post[]
}

export async function getUserById(userId: number): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE id = ${userId}
  `
  const users = result as User[]
  return users.length > 0 ? users[0] : null
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE username = ${username}
  `
  const users = result as User[]
  return users.length > 0 ? users[0] : null
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `
    const users = result as User[]
    return users.length > 0 ? users[0] : null
}

export async function getUserProfile(userId: number): Promise<UserProfile | null> {
  const result = await sql`
    SELECT * FROM user_profiles WHERE user_id = ${userId}
  `
  const profiles = result as UserProfile[]
  return profiles.length > 0 ? profiles[0] : null
}

export async function createUser(username: string, email: string, passwordHash: string): Promise<User> {
  const result = await sql`
    INSERT INTO users (username, email, password_hash) 
    VALUES (${username}, ${email}, ${passwordHash}) 
    RETURNING *
  `
  const users = result as User[]

  // Create an empty profile for the new user
  await sql`
    INSERT INTO user_profiles (user_id) 
    VALUES (${users[0].id})
  `

  return users[0]
}

export async function createThread(forumId: number, userId: number, title: string, content: string): Promise<Thread> {
  // Start a transaction
  const result = await sql`
    INSERT INTO threads (forum_id, user_id, title) 
    VALUES (${forumId}, ${userId}, ${title}) 
    RETURNING *
  `
  const threads = result as Thread[]

  // Create the first post in the thread
  await sql`
    INSERT INTO posts (thread_id, user_id, content) 
    VALUES (${threads[0].id}, ${userId}, ${content})
  `

  // Update the forum's thread count and post count
  await sql`
    UPDATE forums 
    SET thread_count = thread_count + 1, 
        post_count = post_count + 1,
        last_post_at = CURRENT_TIMESTAMP
    WHERE id = ${forumId}
  `

  // Update the user's post count
  await sql`
    UPDATE users 
    SET post_count = post_count + 1 
    WHERE id = ${userId}
  `

  return threads[0]
}

export async function createPost(threadId: number, userId: number, content: string): Promise<Post> {
  // Get the forum_id for this thread
  const threadResult = await sql`
    SELECT forum_id FROM threads WHERE id = ${threadId}
  `
  const threads = threadResult as { forum_id: number }[]

  if (threads.length === 0) {
    throw new Error("Thread not found")
  }

  const forumId = threads[0].forum_id

  // Create the post
  const postResult = await sql`
    INSERT INTO posts (thread_id, user_id, content) 
    VALUES (${threadId}, ${userId}, ${content}) 
    RETURNING *
  `
  const posts = postResult as Post[]

  // Update the thread's post count and last post time
  await sql`
    UPDATE threads 
    SET post_count = post_count + 1, 
        last_post_at = CURRENT_TIMESTAMP
    WHERE id = ${threadId}
  `

  // Update the forum's post count and last post time
  await sql`
    UPDATE forums 
    SET post_count = post_count + 1,
        last_post_at = CURRENT_TIMESTAMP
    WHERE id = ${forumId}
  `

  // Update the user's post count
  await sql`
    UPDATE users 
    SET post_count = post_count + 1 
    WHERE id = ${userId}
  `

  return posts[0]
}
