import { Task } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskStatsProps {
  tasks: Task[];
  isLoading: boolean;
}

export default function TaskStats({ tasks, isLoading }: TaskStatsProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-50 px-6 py-4 text-sm text-gray-600 flex justify-between items-center">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-36" />
      </div>
    );
  }
  
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  
  return (
    <div className="bg-gray-50 px-6 py-4 text-sm text-gray-600 flex justify-between items-center">
      <div>
        <span>{tasks.length}</span> tasks total
      </div>
      <div>
        <span>{completedCount}</span> completed, 
        <span className="ml-1">{pendingCount}</span> pending
      </div>
    </div>
  );
}
