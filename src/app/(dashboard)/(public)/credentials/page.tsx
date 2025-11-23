import type { SearchParams } from "nuqs";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  CredentialContainer,
  CredentialsError,
  CredentialsList,
  CredentialsLoading,
} from "@/features/credentials/components/credentials";
import { credentialsParamsLoader } from "@/features/credentials/params";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type Props = {
  searchParams: Promise<SearchParams>;
};
async function Credentials({ searchParams }: Props) {
  await requireAuth();

  const params = await credentialsParamsLoader(searchParams);

  prefetchCredentials(params);

  return (
    <CredentialContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<CredentialsError />}>
          <Suspense fallback={<CredentialsLoading />}>
            <CredentialsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </CredentialContainer>
  );
}

export default Credentials;
