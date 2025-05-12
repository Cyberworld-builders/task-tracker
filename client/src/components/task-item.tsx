import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { toast } = useToast();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const updateTaskMutation = useMutation({
    mutationFn: async (updates: Partial<Task>) => {
      await apiRequest("PATCH", `/api/tasks/${task.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task updated",
        description: task.completed ? "Task marked as pending" : "Task marked as complete",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleToggleComplete = () => {
    updateTaskMutation.mutate({ completed: !task.completed });
  };

  const handleDelete = () => {
    deleteTaskMutation.mutate();
    setIsDeleteOpen(false);
  };

  return (
    <div className="task-item group py-4 px-6 flex items-center justify-between transition-colors hover:bg-gray-50">
      <div className="flex items-center">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={handleToggleComplete}
          className="h-5 w-5 text-green-500 mr-3 cursor-pointer"
        />
        <span className={`${task.completed ? "text-gray-500 line-through" : "text-gray-800"}`}>
          {task.text}
        </span>
      </div>
      
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogTrigger asChild>
          <button 
            className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
