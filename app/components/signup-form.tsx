'use client'
 
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { useEffect } from 'react'

import { signup } from '@/actions/auth'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
 
export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)
  const router = useRouter()
  
  useEffect(() => {
    if (state?.redirect) {
      router.push(state.redirect)
    }
  }, [state, router])
 
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your details to create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              name="username" 
              placeholder="Username" 
              autoComplete="username"
            />
            {state?.errors?.username && (
              <p className="text-sm text-destructive">{state.errors.username}</p>
            )}
          </div>
 
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              placeholder="Email" 
              type="email"
              autoComplete="email"
            />
            {state?.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email}</p>
            )}
          </div>
 
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password"
              autoComplete="new-password"
            />
            {state?.errors?.password && (
              <div className="text-sm text-destructive">
                <p>Password must:</p>
                <ul className="list-disc pl-5">
                  {state.errors.password.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmpassword">Confirm Password</Label>
            <Input 
              id="confirmpassword" 
              name="confirmpassword" 
              type="password"
              autoComplete="new-password"
            />
            {state?.errors?.confirm_password && (
              <p className="text-sm text-destructive">{state.errors.confirm_password}</p>
            )}
          </div>
          
          {state?.message && !state.redirect && (
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            disabled={pending} 
            type="submit" 
            className="w-full"
          >
            {pending ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
