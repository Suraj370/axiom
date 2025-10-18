import { requireAuth } from "@/lib/auth-utils";
import React from "react";

interface PageProps {
  params: Promise<{ credentialId: string }>;
}
async function CredentialId({ params }: PageProps) {
  await requireAuth();

  const { credentialId } = await params;
  return <div>Credentialid: {credentialId}</div>;
}

export default CredentialId;
