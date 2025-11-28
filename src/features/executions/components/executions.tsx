"use client";

import { formatDistanceToNow } from "date-fns";
import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";
import Image from "next/image";
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
import {
  type Credential,
  CredentialType,
  type Execution,
  ExecutionStatus,
} from "@/generated/prisma";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionParams } from "../hooks/use-executions-params";

export const ExecutionsList = () => {
  const { data: executions } = useSuspenseExecutions();

  return (
    <EntityList
      items={executions.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionItem execution={execution} />}
      emptyView={<ExecutionEmpty />}
    />
  );
};

export const ExecutionHeader = () => {
  return (
    <EntityHeader
      title="Execution"
      description="View your workflow execution history"
    />
  );
};

export const ExecutionPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionParams();

  return (
    <EntityPagination
      disabled={executions.isFetching}
      page={executions.data.pagination.page}
      totalPages={executions.data.pagination.totalPages}
      onPageChange={(newPage) => setParams({ ...params, page: newPage })}
    />
  );
};

export const ExecutionContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <EntityContainer
    header={<ExecutionHeader />}
    pagination={<ExecutionPagination />}
  >
    {children}
  </EntityContainer>
);

export const ExecutionsLoading = () => {
  return <LoadingView message="Loading Executions.." />;
};

export const ExecutionsError = () => {
  return <ErrorView message="Error loading Executions.." />;
};

export const ExecutionEmpty = () => {
  return (
    <EmptyView message="You haven't created executions yet. Get started by running your first workflow" />
  );
};

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
  }
};

const formatStatus = (status: ExecutionStatus) =>{
  return status.charAt(0) + status.slice(1).toLowerCase();
}
export const ExecutionItem = ({
  execution,
}: {
  execution: Execution & {
    workflow: {
      id: string;
      name: string;
    };
  };
}) => {
  const duration = execution.completedAt
    ? Math.round(
        (new Date(execution.completedAt).getTime() -
          new Date(execution.startedAt).getTime()) /
          1000
      )
    : null;

  const subtitle = (
    <>
      {execution.workflow.name} &bull; Started{" "}
      {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
      {duration !== null && <> &bull; Took {duration}s</>}
    </>
  );
  return (
    <EntityItem
      href={`/executions/${execution.id}`}
      title={formatStatus(execution.status)}
      subtitle={subtitle}
      image={
        <div className="size-8 flex items-center justify-center">
          {getStatusIcon(execution.status)}
        </div>
      }
    />
  );
};
