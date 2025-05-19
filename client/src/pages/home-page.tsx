import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Task } from "@shared/schema";
import AddTaskForm from "@/components/add-task-form";
import TaskList from "@/components/task-list";
import TaskStats from "@/components/task-stats";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function HomePage() {
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-3xl">
          <Card>
            <CardContent className="p-0">
              {/* Add Task Form */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Tast</h2>
                <AddTaskForm />
              </div>
              
              {/* Task Statistics */}
              <TaskStats tasks={tasks} isLoading={isLoading} />
              
              {/* Task List */}
              <TaskList tasks={tasks} isLoading={isLoading} />
            </CardContent>
          </Card>
          
          {/* Task Management Tips */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Task Management Tips</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span>Break down large tasks into smaller, manageable chunks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span>Set realistic deadlines for your tasks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span>Review and adjust your task list regularly</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
