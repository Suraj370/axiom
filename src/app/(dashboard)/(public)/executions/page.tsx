import type { SearchParams } from "nuqs";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  ExecutionContainer,
  ExecutionsError,
  ExecutionsList,
  ExecutionsLoading,
} from "@/features/executions/components/executions";
import { executionParamsLoader } from "@/features/executions/params";
import { prefetchExecutions } from "@/features/executions/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

type Props = {
  searchParams: Promise<SearchParams>;
};
async function Executions({ searchParams }: Props) {
  await requireAuth();

  const params = await executionParamsLoader(searchParams);

  prefetchExecutions(params);

  return (
    <ExecutionContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<ExecutionsError />}>
          <Suspense fallback={<ExecutionsLoading />}>
            <ExecutionsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </ExecutionContainer>
  );
}

export default Executions;
