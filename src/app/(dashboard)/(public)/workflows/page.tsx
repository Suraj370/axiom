import React, { Suspense } from "react";
import { HydrateClient } from "@/trpc/server";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import {
  WorkflowsContainer,
  WorkflowsList,
} from "@/features/workflows/components/workflows";
import { requireAuth } from "@/lib/auth-utils";
import { ErrorBoundary } from "react-error-boundary";

const LoadingFallback = () => <p>Loading workflows...</p>;
const ErrorFallback = () => (
  <p>Something went wrong while loading workflows.</p>
);

export default async function Workflow() {
  await requireAuth();
  await prefetchWorkflows(); // Ensure data is prefetched before hydration

  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<ErrorFallback />}>
          <Suspense fallback={<LoadingFallback />}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  );
}
