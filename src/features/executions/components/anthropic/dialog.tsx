"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";



const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Please enter a valid URL" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
    }),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required"),
  // .refine() TODO
});

export type AnthropicFormValues = z.infer<typeof formSchema>;
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<AnthropicFormValues>;
}

export const AnthropicDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      systemPrompt: defaultValues.systemPrompt || "",
      userPrompt: defaultValues.userPrompt || "",
    },
  });

  // Rest the form values when dialog opens with new defaults
  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        systemPrompt: defaultValues.systemPrompt || "",
        userPrompt: defaultValues.userPrompt || "",
      });
    }
  }, [
    open,
    defaultValues.variableName,
    defaultValues.systemPrompt,
    defaultValues.userPrompt,
    form,
  ]);

  const watchVariableName = form.watch("variableName") || "myAnthropic";

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anthropic Configuration</DialogTitle>
          <DialogDescription>
            Configure the AI model and prompt for this node
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="myAnthropic" {...field} />
                  </FormControl>

                  <FormDescription>
                    Use names to reference the result in other nodes:{" "}
                    {`{{${watchVariableName}.aiResponse}}`}
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />


         

            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`You are a helpful assistant`}
                      {...field}
                      className="min-h-[80px] font-mono text-sm"
                    />
                  </FormControl>

                  <FormDescription>
                    Sets the behaviour of the assistant. Use {"{{variable}}"}{" "}
                    for simple values or {"{{json variable}}"} to stringify
                    objects
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt(Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Sumnmarize this text: {{json.httpResponse.data}}`}
                      {...field}
                      className="min-h-[80px] font-mono text-sm"
                    />
                  </FormControl>

                  <FormDescription>
                    Sets the behaviour of the assistant. Use {"{{variable}}"}{" "}
                    for simple values or {"{{json variable}}"} to stringify
                    objects
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
