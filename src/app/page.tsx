"use client";
import { Button } from "@/components/ui/button";
// import { caller } from "@/trpc/server";

import { authClient } from "@/lib/auth-client";
import { createAuthClient } from "better-auth/react";

export default  function Home() {
 const {
        data: session,
        isPending, //loading state
        error, //error object 
        refetch //refetch the session
    } = authClient.useSession()
  const signin = async () => {
    // client-side usage
    await authClient.signIn.social({
      provider: "google", // or any other provider id
    });
  };


  return (
    <main className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      <h1>Home!</h1>

        {session && (
          <div>
            <p>Welcome, {session.user?.name}!</p>
            <Button onClick={() => authClient.signOut()}>Sign out</Button>
          </div>
        )}
        {!session && (
            <Button onClick={signin}>Sign in with Google</Button>
        )}
    </main>
  );
}
