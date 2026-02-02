import { SignUp } from "@clerk/nextjs";

/**
 * Sign Up Page
 * 
 * Uses Clerk's pre-built SignUp component with custom styling.
 */
export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SignUp
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
