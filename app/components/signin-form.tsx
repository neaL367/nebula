"use client"

import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"


import { signin } from "@/actions/auth"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function SigninForm() {
  const [state, action, pending] = useActionState(signin, undefined)
  const router = useRouter()

  useEffect(() => {
    if (state?.redirect) {
      router.push(state.redirect)
    }
  }, [state, router])

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Sign In</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Enter your credentials to access your account</p>
      </div>
      
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
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Input
              type="checkbox"
              id="remember"
              name="remember"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
          </div>
          <a href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </a>
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
    </div>
  )
}
