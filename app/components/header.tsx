import { getUser } from "@/lib/dal";
import { Navbar } from "@/components/navbar";

export async function Header() {
  const user = await getUser();
  return <Navbar user={user} />;
}
