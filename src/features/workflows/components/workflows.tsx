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
import type { Workflow } from "@/generated/prisma";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { useWorkflowsParams } from "../hooks/use-workflows-params";

export const WorkflowSearch = () => {
  const [params, setParams] = useWorkflowsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      searchPlaceholder="Search workflow"
    />
  );
};
export const WorkflowsList = () => {
  const { data: workflows } = useSuspenseWorkflows();


  return (
    <EntityList
      items={workflows.items}
      getKey={(workflow) => workflow.id}
      renderItem={(workflow) => <WorkflowsItem workflow={workflow} />}
      emptyView={<WorkflowsEmpty />}
    />
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

  return (
    <EntityPagination
      disabled={workflows.isFetching}
      page={workflows.data.pagination.page}
      totalPages={workflows.data.pagination.totalPages}
      onPageChange={(newPage) => setParams({ ...params, page: newPage })}
    />
  );
};

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <EntityContainer
    header={<WorkflowHeader />}
    search={<WorkflowSearch />}
    pagination={<WorkflowPagination />}
  >
    {children}
  </EntityContainer>
);

export const WorkflowsLoading = () => {
  return <LoadingView message="Loading workflows.." />;
};

export const WorkflowsError = () => {
  return <ErrorView message="Error loading workflows.." />;
};

export const WorkflowsEmpty = () => {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        handleError(error);
      },
    });
  };

  return (
    <>
      {modal}
      <EmptyView
        message="You haven't created workflows yet. Get started by creating new workflow"
        onNew={handleCreate}
      />
    </>
  );
};

export const WorkflowsItem = ({ workflow }: { workflow: Workflow }) => {
  const removeWokflow = useRemoveWorkflow();
  const handleRemove = () => {
    removeWokflow.mutate({ id: workflow.id });
  };
  return (
    <EntityItem
      href={`/workflows/${workflow.id}`}
      title={workflow.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className=" size-5 text-muted-foreground " />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeWokflow.isPending}
    />
  );
};
