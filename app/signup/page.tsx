import SignupForm from "@/components/signup-form";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        <SignupForm />
        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}