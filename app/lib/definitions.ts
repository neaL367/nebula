import { z } from 'zod'

export const SignupFormSchema = z.object({
    username: z
        .string()
        .min(2, { message: 'Username must be at least 2 characters long.' })
        .max(30, { message: 'Username cannot exceed 30 characters.' })
        .regex(/^[a-zA-Z0-9_-]+$/, {
            message: 'Username can only contain letters, numbers, underscores, and hyphens.'
        })
        .trim(),
    email: z
        .string()
        .email({ message: 'Please enter a valid email.' })
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .max(50, { message: 'Password is too long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Contain at least one special character.',
        })
        .trim(),
    confirm_password: z.string().optional(),
}).refine((data) => !data.confirm_password || data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
});

export const SigninFormSchema = z.object({
    identifier: z
        .string()
        .min(1, { message: 'Username or email is required' })
        .trim(),
    password: z.string().min(1, { message: 'Password is required' }).trim(),
});

export type FormState =
    | {
        errors?: {
            username?: string[]
            email?: string[]
            identifier?: string[]
            password?: string[]
            confirm_password?: string[]
        }
        message?: string
    }
    | undefined

export type SessionPayload = {
  userId: string
  expiresAt: Date
}
