import { requireAuth } from "@/lib/auth-utils";
import React from "react";

interface PageProps {
  params: Promise<{ executionId: string }>;
}
async function CredentialId({ params }: PageProps) {
  await requireAuth();

  const { executionId } = await params;
  return <div>ExecutionId: {executionId}</div>;
}

export default CredentialId;
