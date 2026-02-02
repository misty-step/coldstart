import { SignIn } from "@clerk/nextjs";

/**
 * Sign In Page
 * 
 * Uses Clerk's pre-built SignIn component with custom styling
 * to match the Misty Step design system.
 */
export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "rounded-lg shadow-sm border border-gray-200",
            },
          }}
        />
      </div>
    </div>
  );
}
