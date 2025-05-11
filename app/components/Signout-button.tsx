// components/SignOutButton.tsx
"use client";

import { signout } from "@/actions/auth"; 
import { Button } from "./ui/button";

export function SignOutButton() {
  const handleSignout = async () => {
    await signout();
  };

  return (
    <Button variant="destructive" onClick={handleSignout}>
      Sign Out
    </Button>
  );
}
