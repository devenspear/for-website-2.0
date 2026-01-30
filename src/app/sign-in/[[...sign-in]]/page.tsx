import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Character Insights</h1>
        <p className="text-neutral-600 mb-8">Sign in to continue your journey</p>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-lg border border-neutral-100',
            },
          }}
        />
      </div>
    </div>
  );
}
