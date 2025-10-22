"use client";

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
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import {formatDistanceToNow} from 'date-fns'
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Workflow } from "@/generated/prisma";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { WorkflowIcon } from "lucide-react";

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

  if (workflows.items.length === 0) return <WorkflowsEmpty />;

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
      <EmptyView message="No workflows found" onNew={handleCreate} />
    </>
  );
};

export const WorkflowsItem = ({ workflow }: { workflow: Workflow }) => {

  const removeWokflow = useRemoveWorkflow();
  const handleRemove = () => {
    removeWokflow.mutate({ id: workflow.id });
  }
  return (
    <EntityItem
      href={`/workflows/${workflow.id}`}
      title={workflow.name}
      subtitle={<>Updated {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })} &bull; Created {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}</>}
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
