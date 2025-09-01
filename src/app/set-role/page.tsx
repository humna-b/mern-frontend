'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SetRolePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const role = localStorage.getItem('selectedRole');

    const updateRole = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/set-role`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user?.id,
            role,
          }),
        }); 
        console.log('response', res);

        if (res.ok) {
          router.replace(role === 'coach' ? '/coach-dashboard' : '/dashboard');
        } else {
          console.error('Failed to set role');
        }
      } catch (err) {
        console.error('Error calling set-role:', err);
      }
    };

    updateRole();
  }, [isLoaded, user, router]);

  return <p>Setting up your account...</p>;
}
