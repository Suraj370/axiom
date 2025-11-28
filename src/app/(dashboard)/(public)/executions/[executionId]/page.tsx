import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ExecutionView } from "@/features/executions/components/execution";
import {
  ExecutionsError,
  ExecutionsLoading,
} from "@/features/executions/components/executions";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

interface PageProps {
  params: Promise<{ executionId: string }>;
}
async function CredentialId({ params }: PageProps) {
  await requireAuth();

  const { executionId } = await params;
  return (
    <div className=" p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-screen-md w-full flex flex-col gap-8 h-full  ">
        <HydrateClient>
          <ErrorBoundary fallback={<ExecutionsError />}>
            <Suspense fallback={<ExecutionsLoading />}>
              <ExecutionView executionId={executionId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  );
}

export default CredentialId;
