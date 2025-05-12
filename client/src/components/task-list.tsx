import { Task } from "@shared/schema";
import TaskItem from "./task-item";
import { Loader2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
}

export default function TaskList({ tasks, isLoading }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-500">Loading tasks...</p>
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-gray-400 mb-2 flex justify-center">
          <svg className="h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-1">No tasks yet</h3>
        <p className="text-gray-500">Add your first task to get started</p>
      </div>
    );
  }
  
  return (
    <div className="divide-y divide-gray-200">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
