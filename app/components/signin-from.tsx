'use client'
 
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { useEffect } from 'react'

import { signin } from '@/actions/auth'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
 
export default function SigninForm() {
  const [state, action, pending] = useActionState(signin, undefined)
  const router = useRouter()
  
  useEffect(() => {
    if (state?.redirect) {
      router.push(state.redirect)
    }
  }, [state, router])
 
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Username or Email</Label>
            <Input 
              id="identifier" 
              name="identifier" 
              placeholder="Username or Email" 
              autoComplete="username"
            />
            {state?.errors?.identifier && (
              <p className="text-sm text-destructive">{state.errors.identifier}</p>
            )}
          </div>
 
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              autoComplete="current-password"
            />
            {state?.errors?.password && (
              <p className="text-sm text-destructive">{state.errors.password}</p>
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
            {pending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
