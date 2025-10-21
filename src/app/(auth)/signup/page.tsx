import SignupForm from '@/features/auth/components/signup'
import { requireUnauth } from '@/lib/auth-utils';
import React from 'react'

async function Signup() {
    await requireUnauth();
  return (
    <>
      <SignupForm />
    </>
  )
}

export default Signup