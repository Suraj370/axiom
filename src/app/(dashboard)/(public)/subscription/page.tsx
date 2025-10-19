"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const Page = () => {
    const trpc = useTRPC();

    const testAI = useMutation(trpc.testAI.mutationOptions({
        onSuccess: () => {
            // Handle success
            toast.success("AI test successful");
        },
        onError: ({message}) => {
            // Handle error
            toast.error(message);
        }
    }))

    return(
        <>
        <Button onClick={() => testAI.mutate()}>Test AI</Button>
        </>
    )
    
}

export default Page;