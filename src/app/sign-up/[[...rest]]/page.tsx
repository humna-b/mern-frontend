'use client';

import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'user';

  useEffect(() => {
    localStorage.setItem('selectedRole', role);
  }, [role]);

  return (
    <div className="flex justify-center items-center h-screen">
      <SignUp path="/sign-up" routing="path" afterSignUpUrl="/set-role" />
    </div>
  );
}
