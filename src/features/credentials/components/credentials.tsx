"use client";

import { formatDistanceToNow } from "date-fns";
import { WorkflowIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { type Credential, CredentialType } from "@/generated/prisma";
import { useEntitySearch } from "@/hooks/use-entity-search";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import { useCredentialParams } from "../hooks/use-credentials-params";
import Image from "next/image";

export const CredentialSearch = () => {
  const [params, setParams] = useCredentialParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      searchPlaceholder="Search credentials"
    />
  );
};
export const CredentialsList = () => {
  const { data: credentials } = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialsItem credential={credential} />}
      emptyView={<CredentialsEmpty />}
    />
  );
};

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <EntityHeader
      title="Credential"
      description="Manage your credentials"
      newButtonHref={"/credentials/new"}
      newButtonLabel="New Credentials"
      disabled={disabled}
    />
  );
};

export const CredentialPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialParams();

  return (
    <EntityPagination
      disabled={credentials.isFetching}
      page={credentials.data.pagination.page}
      totalPages={credentials.data.pagination.totalPages}
      onPageChange={(newPage) => setParams({ ...params, page: newPage })}
    />
  );
};

export const CredentialContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <EntityContainer
    header={<CredentialsHeader />}
    search={<CredentialSearch />}
    pagination={<CredentialPagination />}
  >
    {children}
  </EntityContainer>
);

export const CredentialsLoading = () => {
  return <LoadingView message="Loading Credentials.." />;
};

export const CredentialsError = () => {
  return <ErrorView message="Error loading Credentials.." />;
};

export const CredentialsEmpty = () => {
  const router = useRouter();

  const handleCreate = () => {
    router.push(`/credentials/new`);
  };

  return (
    <EmptyView
      message="You haven't created credential yet. Get started by creating new credential"
      onNew={handleCreate}
    />
  );
};

const credentialLogo: Record<CredentialType, string> = {
  [CredentialType.OPENAI]: "/openai.svg",
  [CredentialType.ANTHROPIC]: "/anthropic.svg",
  [CredentialType.GEMINI]: "/gemini.svg",
};
export const CredentialsItem = ({ credential }: { credential: Credential }) => {
  const removeCredential = useRemoveCredential();
  const handleRemove = () => {
    removeCredential.mutate({ id: credential.id });
  };

  const logo = credentialLogo[credential.type] || "/openai.svg"
  return (
    <EntityItem
      href={`/credentials/${credential.id}`}
      title={credential.type}
      subtitle={
        <>
          Updated{" "}
          {formatDistanceToNow(credential.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(credential.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <Image src = {logo} alt = {credential.type} width= {20} height = {20}/>
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};
