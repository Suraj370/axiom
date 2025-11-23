import React from "react";
import { CredentialForm } from "@/features/credentials/components/credential";

function Page() {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-screen-md w-full flex flex-col gap-y-6 h-full ">
        <CredentialForm />
      </div>
    </div>
  );
}

export default Page;
