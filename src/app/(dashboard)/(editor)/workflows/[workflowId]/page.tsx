import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflowById } from "@/features/workflows/server/prefetch";
import { HydrateClient, prefetch } from "@/trpc/server";
import React, { Suspense } from "react";
import {
  WorkflowsError,
  WorkflowsLoading,
} from "@/features/workflows/components/workflows";
import { ErrorBoundary } from "react-error-boundary";
import { Edit } from "lucide-react";
import {
  Editor,
  EditorError,
  EditorLoading,
} from "@/features/editor/components/editor";
import { EditorHeader } from "@/features/editor/components/editor-header";

interface PageProps {
  params: Promise<{ workflowId: string }>;
}
async function WorkflowId({ params }: PageProps) {
  await requireAuth();

  const { workflowId } = await params;
  prefetchWorkflowById(workflowId);
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <EditorHeader workflowId={workflowId} />
          <main className="flex-1">
            <Editor workflowId={workflowId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

export default WorkflowId;
