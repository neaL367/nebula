'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

import { createUser, getUserByUsername, getUserByEmail, sql } from '@/lib/db'
import { SignupFormSchema, SigninFormSchema, FormState } from '@/lib/definitions'
import { createSession, deleteSession } from '@/lib/session'

export async function signup(state: FormState, formData: FormData) {
    // 1. Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirm_password: formData.get('confirmpassword'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    try {
        // 2. Prepare data for insertion into database
        const { username, email, password } = validatedFields.data
        // Hash the user's password before storing it
        const hashedPassword = await bcrypt.hash(password, 10)

        // Check if user already exists
        const existingUser = await getUserByUsername(username)
        
        if (existingUser) {
            return {
                message: 'Username already exists',
            }
        }

        // 3. Insert the user into the database using the db.ts function
        const user = await createUser(username, email, hashedPassword)

        if (!user) {
            return {
                message: 'An error occurred while creating your account.',
            }
        }
        
        // 4. Create user session
        await createSession(String(user.id))

        // 5. Redirect
        return {
            message: 'Account created successfully!',
            redirect: '/'
        }
    } catch (error) {
        console.error('Signup error:', error)
        return {
            message: 'An error occurred while creating your account.',
        }
    }
}

export async function signin(state: FormState, formData: FormData) {
    // Validate form fields
    const validatedFields = SigninFormSchema.safeParse({
        identifier: formData.get('identifier'),
        password: formData.get('password'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    try {
        const { identifier, password } = validatedFields.data

        // Try to find user by username first
        let user = await getUserByUsername(identifier)
        
        // If not found by username, try by email
        if (!user) {
            user = await getUserByEmail(identifier)
        }

        if (!user) {
            return {
                message: 'Invalid credentials',
            }
        }

        // Verify password - using password_hash field from schema
        const passwordMatch = await bcrypt.compare(password, user.password_hash)
        
        if (!passwordMatch) {
            return {
                message: 'Invalid credentials',
            }
        }

        // Update last_login timestamp
        await sql`
            UPDATE users 
            SET last_login = CURRENT_TIMESTAMP 
            WHERE id = ${user.id}
        `

        // Create user session
        await createSession(String(user.id))

        return {
            message: 'Logged in successfully!', 
            redirect: '/'
        }
    } catch (error) {
        console.error('Signin error:', error)
        return {
            message: 'An error occurred during sign in.',
        }
    }
}


export async function signout() {
    await deleteSession()
    redirect('/')
}
