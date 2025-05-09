"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Menu, X, ChevronDown, User as UserIcon, LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

import { SigninForm } from "@/components/signin-form"
import { User } from "@/lib/schema"

export function Navbar({ user }: { user: User | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleSignout = async () => {
    const response = await fetch("/api/auth/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      router.refresh()
    }
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Main header with dark background */}
      <div className="bg-zinc-900 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                {/* <Image
                  src=""
                  alt="Logo"
                  width={40}
                  height={40}
                  className="bg-white rounded-full"
                /> */}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">GTAFORUMS</span>
                <span className="text-xs text-zinc-400">YEP, MAN WOULD BE IMPRESSED</span>
              </div>
            </Link>

            {/* Mobile menu toggle */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-64 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full text-zinc-400 hover:text-white"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Authentication UI based on user state */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex items-center gap-2 text-zinc-300 hover:text-white">
                      <div className="relative h-8 w-8 overflow-hidden rounded-full">
                        {user.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt={user.username}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-zinc-700">
                            <UserIcon className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <span>{user.username}</span>
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      Signed in as <span className="font-bold">{user.username}</span>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                      <DropdownMenuItem>
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    {/* <Link href="/settings">
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </Link> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  {/* Sign In Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="flex items-center gap-2 text-zinc-300 hover:text-white"
                      >
                        <span>Existing user?</span>
                        <div className="flex items-center">
                          <span>Sign In</span>
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[350px] pt-0 mt-1.5">
                      <div className="p-2">
                        <SigninForm />
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Sign Up Button */}
                  <Link href="/signup">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-800 p-4">
          <div className="space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full text-zinc-400 hover:text-white"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Authentication UI based on user state */}
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-2 py-1">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.username}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-zinc-700">
                        <UserIcon className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <span className="font-medium">{user.username}</span>
                </div>
                <Link href="/profile" className="block">
                  <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:text-white">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Link href="/settings" className="block">
                  <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
                <Button 
                  onClick={handleSignout} 
                  variant="ghost" 
                  className="w-full justify-start text-zinc-300 hover:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            ) : (
              <>
                {/* Mobile Sign In Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-center gap-2 text-zinc-300 hover:text-white hover:bg-zinc-700"
                    >
                      <span>Existing user?</span>
                      <div className="flex items-center">
                        <span>Sign In</span>
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-[350px] p-0">
                    <div className="p-2">
                      <SigninForm />
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Sign Up Button */}
                <Link href="/signup" className="block">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
