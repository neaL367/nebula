import Link from 'next/link'
import Image from 'next/image'

import { getUser } from '@/lib/dal'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { SignoutButton } from '@/components/signout-button'

export default async function ProfilePage() {
  const user = await getUser()
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <>
              {user.avatar_url && (
                <div className="flex justify-center mb-4">
                  <Image 
                    src={user.avatar_url} 
                    alt="Profile avatar" 
                    width={100} 
                    height={100} 
                    className="rounded-full"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Username:</div>
                <div>{user.username}</div>
              </div>
              {/* <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Role:</div>
                <div>{user.roles}</div>
              </div> */}
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Email:</div>
                <div>{user.email}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">User ID:</div>
                <div>{user.id}</div>
              </div>
              {/* <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Password Hash:</div>
                <div>{user.password_hash}</div>
              </div> */}
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Joined:</div>
                <div>{user.created_at.toLocaleDateString()}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Last Login:</div>
                <div>{user.last_login ? user.last_login.toLocaleDateString() : 'N/A'}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Posts:</div>
                <div>{user.post_count}</div>
              </div>
              
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-lg font-medium mb-4">You are not logged in</p>
              <p className="text-muted-foreground mb-6">Please sign in to view your profile information</p>
              <div className="flex gap-4 justify-center">
                <Link href="/signin">
                  <Button>Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline">Create Account</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          {/* {user && (
            <SignoutButton />
          )} */}
        </CardFooter>
      </Card>
    </div>
  )
}


