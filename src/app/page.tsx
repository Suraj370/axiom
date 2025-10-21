'use client'

import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const { data: session, isPending, error } = authClient.useSession()

  if (isPending) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center flex-col gap-y-6">
      <h1 className="text-2xl font-bold">Welcome to the Platform</h1>

      {!session ? (
        <div className="space-y-4 text-center">
          <p>You’re not logged in.</p>
          <Link href="/login">
            <Button variant="default">Go to Login</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <p>Logged in as <strong>{session.user?.email}</strong></p>
          <p>Name: <strong>{session.user?.name}</strong></p>
          <Button onClick={() => router.push('/workflows')}>
            Go to Workflows
          </Button>
        </div>
      )}
    </main>
  )
}
