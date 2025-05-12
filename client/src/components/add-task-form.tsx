import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const taskSchema = z.object({
  text: z.string().min(1, "Task description is required"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function AddTaskForm() {
  const { toast } = useToast();
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      text: "",
    },
  });
  
  const addTaskMutation = useMutation({
    mutationFn: async (data: TaskFormValues) => {
      await apiRequest("POST", "/api/tasks", data);
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task added",
        description: "Your task has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add task",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: TaskFormValues) => {
    addTaskMutation.mutate(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input 
                  placeholder="What do you need to do?" 
                  {...field}
                  disabled={addTaskMutation.isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={addTaskMutation.isPending}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add
        </Button>
      </form>
    </Form>
  );
}
