import { signout } from "@/actions/auth"; 
import { Button } from "./ui/button";

export function SignoutButton() {
  const handleSignout = async () => {
    await signout();
  };

  return (
    <Button variant="destructive" onClick={handleSignout}>
      Sign Out
    </Button>
  );
}
