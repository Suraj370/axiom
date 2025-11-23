import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useCredentialParams } from "./use-credentials-params";
import { CredentialType } from "@/generated/prisma";

/**
 * Fetch all credentials for the authenticated user using Suspense.
 */
export const useSuspenseCredentials= () => {
  const trpc = useTRPC();
  const [params] = useCredentialParams();
  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
};

/**
 * Create a new workflow and handle navigation and cache invalidation.
 */
export const useCreateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" created`);
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to create credential: ${error.message}`);
      },
    })
  );
};

/** Remove a credential and handle navigation and cache invalidation.
 */
export const useRemoveCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" removed`);
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to remove credential: ${error.message}`);
      },
    })
  );
};

/**
 * Hook to fetch a single credential using suspense
 */
export const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.credentials.getOne.queryOptions({
      id,
    })
  );
};


/**
 * Hook to update the  credential
 */
export const useUpdateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" saved`);
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update credential: ${error.message}`);
      },
    })
  );
};


/**
 * Hook to fetch credential by type
 */
export const useCredentialByType = (type: CredentialType) => {
  const trpc = useTRPC()
  return useQuery(trpc.credentials.getType.queryOptions({type}))
}