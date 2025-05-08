import 'server-only'

import { cookies } from 'next/headers'
import { cache } from 'react'

import { decrypt } from '@/lib/session'
import { getUserById } from './db'

export const verifySession = cache(async () => {
    const token = (await cookies()).get('session')?.value
    if (!token) {
        return { isAuth: false, userId: null }
    }

    const payload = await decrypt(token)
    if (!payload?.userId) {
        return { isAuth: false, userId: null }
    }

    return { isAuth: true, userId: payload.userId }
})


export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session.isAuth || !session.userId) return null

    try {
        const user = await getUserById(Number(session.userId))
        return user ? { ...user } : null
    } catch (error) {
        console.error('Failed to fetch user:', error)
        return null
    }
})
