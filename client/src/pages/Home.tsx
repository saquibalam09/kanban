import React, { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Task } from "@/types";
import KanbanBoard from "@/components/KanbanBoard";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Home: React.FC = () => {
  const { toast } = useToast();

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery<Task[]>({
    queryKey: ["http://localhost:8000/api/tasks"],
  });

  const addTaskMutation = useMutation({
    mutationFn: async (newTask: Task) => {
      const res = await apiRequest(
        "POST",
        "http://localhost:8000/api/tasks",
        newTask
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["http://localhost:8000/api/tasks"],
      });
      toast({
        title: "Success",
        description: "Task added successfully",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, task }: { taskId: number; task: Task }) => {
      const res = await apiRequest(
        "PUT",
        `http://localhost:8000/api/tasks/${taskId}`,
        task
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["http://localhost:8000/api/tasks"],
      });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      await apiRequest("DELETE", `http://localhost:8000/api/tasks/${taskId}`);
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["http://localhost:8000/api/tasks"],
      });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
  });

  const handleAddTask = async (task: Task) => {
    try {
      await addTaskMutation.mutateAsync(task);
    } catch (error) {
      console.error("Failed to add task:", error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (taskId: number, task: Task) => {
    try {
      await updateTaskMutation.mutateAsync({ taskId, task });
    } catch (error) {
      console.error("Failed to update task:", error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Tasks
          </h2>
          <p className="text-gray-600">
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans text-gray-800">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 flex items-center">
          <ClipboardList className="text-primary mr-3" />
          Kanban Board
        </h1>
        <p className="text-gray-600 mt-1">
          Organize your tasks and track progress
        </p>
      </header>

      <KanbanBoard
        tasks={tasks}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />

      <footer className="mt-10 text-center text-gray-500 text-sm">
        <p>Drag and drop tasks between columns to update their status</p>
      </footer>
    </div>
  );
};

export default Home;
