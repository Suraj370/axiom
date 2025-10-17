'use client'

import { Button } from './ui/button'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh(); // revalidates server components
  };

  return (
    <Button onClick={handleLogout}>
      Log out
    </Button>
  );
}
