"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function SignoutButton() {
  const router = useRouter();

  const handlesignout = async () => {
    // Call the signout API endpoint instead of directly using server-only functions
    const response = await fetch("/api/auth/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      router.refresh();
    }
  };

  return (
    <Button variant="ghost" onClick={handlesignout} className="">
      Sign Out
    </Button>
  );
}
