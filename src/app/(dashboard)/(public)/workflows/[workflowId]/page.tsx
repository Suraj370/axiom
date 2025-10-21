import { requireAuth } from "@/lib/auth-utils";
import React from "react";

interface PageProps {
  params: Promise<{ workflowId: string }>;
}
async function WorkflowId({ params }: PageProps) {
  await requireAuth();

  const { workflowId } = await params;
  return <div>WorkflowId: {workflowId}</div>;
}

export default WorkflowId;
