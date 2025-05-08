import 'server-only'

import { cookies, headers } from 'next/headers'
import { SignJWT, jwtVerify, JWTPayload } from 'jose'

import { SessionPayload } from '@/lib/definitions'
import { sql } from '@/lib/db'

// Ensure the secret is set
const secretKey = process.env.SESSION_SECRET
if (!secretKey) {
  throw new Error('SESSION_SECRET environment variable is required')
}
const encodedKey = new TextEncoder().encode(secretKey)

/**
 * Encrypts and signs the session payload into a JWT.
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

/**
 * Decrypts and validates the JWT, then ensures the session is still valid in the DB.
 */
export async function decrypt(token: string | undefined = ''): Promise<SessionPayload | null> {
  if (!token) return null

  try {
    // Verify JWT signature and expiration
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    }) as { payload: JWTPayload }

    // Fetch session record from DB
    const [record] = await sql`
      SELECT is_valid, expires_at
      FROM sessions
      WHERE token = ${token}
    `

    // Reject if no record or flagged invalid
    if (!record?.is_valid) {
      return null
    }

    // Reject if DB expiration is passed
    const now = new Date()
    const dbExpires = new Date(record.expires_at)
    if (dbExpires < now) {
      return null
    }

    return payload as SessionPayload
  } catch (err) {
    console.error('Failed to verify session token:', err)
    return null
  }
}

/**
 * Creates a new session: issues JWT, sets cookie, and persists to DB.
 */
export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const token = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()
  const headerList = await headers()

  // Store session in cookie
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })

  // Persist session metadata
  const userAgent = headerList.get('user-agent') || ''
  const ip =
    headerList.get('x-forwarded-for') || headerList.get('x-real-ip') || '0.0.0.0'

  await sql`
    INSERT INTO sessions (
      user_id,
      token,
      expires_at,
      ip_address,
      user_agent,
      is_valid
    ) VALUES (
      ${userId},
      ${token},
      ${expiresAt.toISOString()},
      ${ip},
      ${userAgent},
      TRUE
    )
  `
}

/**
 * Extends the session cookie and updates last_active timestamp in DB.
 */
export async function updateSession() {
  const token = (await cookies()).get('session')?.value
  const session = await decrypt(token)

  if (!token || !session) {
    return null
  }

  const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: newExpiry,
  })

  await sql`
    UPDATE sessions
    SET last_active_at = CURRENT_TIMESTAMP,
        expires_at = ${newExpiry.toISOString()}
    WHERE token = ${token}
  `
}

/**
 * Deletes (invalidates) the session cookie and marks the DB record invalid.
 */
export async function deleteSession() {
  const token = (await cookies()).get('session')?.value
  const cookieStore = await cookies()

  // Remove cookie
  cookieStore.delete('session')

  if (token) {
    await sql`
      UPDATE sessions
      SET is_valid = FALSE
      WHERE token = ${token}
    `
  }
}
