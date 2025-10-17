import Logout from '@/components/Logout';
import { Button } from '@/components/ui/button';
import { requireAuth } from '@/lib/auth-utils';
import { caller } from '@/trpc/server';
import { LogOut } from 'lucide-react';
import React from 'react'

async function page() {
  const session = await requireAuth();

  const data = await caller.getUsers();
  return (
    <div className='min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6'>
        <div>{JSON.stringify(data, null, 2)}</div>
       <Logout />
    </div>
  )
}

export default page