import React, { Suspense } from "react";
import { HydrateClient } from "@/trpc/server";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import {
  WorkflowsContainer,
  WorkflowsError,
  WorkflowsList,
  WorkflowsLoading,
} from "@/features/workflows/components/workflows";
import { requireAuth } from "@/lib/auth-utils";
import { ErrorBoundary } from "react-error-boundary";
import { SearchParams } from "nuqs/server";
import { workflowParamsLoader } from "@/features/workflows/params";

type Props = {
  searchParams: Promise<SearchParams>
}
const LoadingFallback = () => <p>Loading workflows...</p>;
const ErrorFallback = () => (
  <p>Something went wrong while loading workflows.</p>
);

export default async function Workflow({searchParams}: Props) {
  await requireAuth();
 const params = await workflowParamsLoader(searchParams);
 prefetchWorkflows(params)

  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowsError />}>
          <Suspense fallback={<WorkflowsLoading />}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  );
}
