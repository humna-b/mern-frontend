'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignUpPage() {

  return (
    <div className="flex justify-center items-center bg-black h-screen">
      <SignIn path="/sign-in" routing="path" afterSignUpUrl="/dashboard" />
    </div>
  );
}
