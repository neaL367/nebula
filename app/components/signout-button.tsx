import { signout } from "../actions/auth";
import { Button } from "./ui/button";

export function SignoutButton() {
  const handlesignout = async () => {
    await signout();
  };

  return (
    <Button variant="destructive" type="submit" onClick={handlesignout}>
      Sign Out
    </Button>
  );
}
