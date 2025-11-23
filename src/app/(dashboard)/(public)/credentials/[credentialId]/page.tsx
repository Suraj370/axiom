import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CredentialView } from "@/features/credentials/components/credential";
import { CredentialsError, CredentialsLoading } from "@/features/credentials/components/credentials";
import { prefetchCredentialsById } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

interface PageProps {
  params: Promise<{ credentialId: string }>;
}
async function CredentialId({ params }: PageProps) {
  await requireAuth();

  const { credentialId } = await params;

  prefetchCredentialsById(credentialId);
  return (
    <div className=" p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-screen-md w-full flex flex-col gap-8 h-full  ">
        <HydrateClient>
          <ErrorBoundary fallback={<CredentialsError />}>
            <Suspense fallback = { <CredentialsLoading />}>
              <CredentialView credentialId={credentialId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  );
}

export default CredentialId;
