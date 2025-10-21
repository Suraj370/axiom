"use client";

import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

export const WorkflowSearch = () => {
  const [params, setParams] = useWorkflowsParams();
  const { searchValue, onSearchChange } =  useEntitySearch({
    params,
    setParams
  })

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      searchPlaceholder="Search workflow"
    />
  )
}
export const WorkflowsList = () => {
  const { data } = useSuspenseWorkflows();

  return (
    <div className="flex-1 flex justify-center items-center">
      <pre className="text-left whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export const WorkflowHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkflow();
  const router = useRouter();
  const { modal, handleError } = useUpgradeModal();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: handleError,
    });
  };

  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Manage your workflows"
        onNew={handleCreate}
        newButtonLabel="Create Workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
};

export const WorkflowPagination = () => {
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowsParams();

  const handlePageChange = (newPage: number) => {
    setParams({ ...params, page: newPage });
  };

  return (
    <EntityPagination
      disabled={workflows.isFetching}
      page={workflows.data.pagination.page}
      totalPages={workflows.data.pagination.totalPages}
      onPageChange={(newPage) => setParams({ ...params, page: newPage })}
    />
  );
};

export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => (
  <EntityContainer header={<WorkflowHeader />} search={<WorkflowSearch />} pagination={<WorkflowPagination />}>
    {children}
  </EntityContainer>
);