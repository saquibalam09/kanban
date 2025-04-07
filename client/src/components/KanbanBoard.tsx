import React, { useState } from "react";
import "./KanbanBoard.css";
import { Task, Column } from "../types";
import {
  ClipboardList,
  LoaderPinwheel,
  CheckCircle,
  Plus,
  Pencil,
  Trash2,
  Info,
  AlertCircle,
} from "lucide-react";
import TaskModal from "./TaskModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface KanbanBoardProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (taskId: number, task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [newTask, setNewTask] = useState<Task>({
    title: "",
    description: "",
    status: "TODO",
  });

  // State for task editing
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State for task deletion
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const columns: Column[] = ["TODO", "IN_PROGRESS", "DONE"];

  const columnIcons = {
    TODO: <ClipboardList className="mr-2" size={18} />,
    IN_PROGRESS: <LoaderPinwheel className="mr-2" size={18} />,
    DONE: <CheckCircle className="mr-2" size={18} />,
  };

  const columnColors = {
    TODO: "bg-blue-600",
    IN_PROGRESS: "bg-orange-500",
    DONE: "bg-green-600",
  };

  const columnTitles = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("task", JSON.stringify(task));
    const element = e.currentTarget as HTMLElement;
    element.classList.add("dragging");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.classList.remove("dragging");
  };

  const handleDrop = (e: React.DragEvent, status: Column) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.classList.remove("drag-over");

    const task = JSON.parse(e.dataTransfer.getData("task")) as Task;
    if (task.id && task.status !== status) {
      onUpdateTask(task.id, { ...task, status });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.classList.add("drag-over");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove("drag-over");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title.trim() && newTask.description.trim()) {
      onAddTask(newTask);
      setNewTask({ title: "", description: "", status: "TODO" });
    }
  };

  // Edit task handlers
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  // Delete task handlers
  const handleDeleteClick = (taskId: number) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete !== null) {
      onDeleteTask(taskToDelete);
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="kanban-board">
      {/* Task Form Section */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-5">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Add New Task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="taskTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Title
            </label>
            <input
              id="taskTitle"
              type="text"
              placeholder="Enter task title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label
              htmlFor="taskDescription"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <input
              id="taskDescription"
              type="text"
              placeholder="Enter task description"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label
              htmlFor="taskStatus"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="taskStatus"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={newTask.status}
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value as Column })
              }
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out flex items-center justify-center"
          >
            <Plus className="mr-2" size={18} />
            Add Task
          </button>
        </form>
      </div>

      {/* Kanban Columns */}
      <div className="columns grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column}
            className="column bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[600px]"
            onDrop={(e) => handleDrop(e, column)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div
              className={`p-4 border-b border-gray-200 ${columnColors[column]} text-white`}
            >
              <h2 className="font-semibold text-lg flex items-center">
                {columnIcons[column]}
                {columnTitles[column]}
                <span
                  className={`ml-auto bg-white text-${column.toLowerCase()} text-sm py-0.5 px-2 rounded-full`}
                >
                  {tasks.filter((task) => task.status === column).length}
                </span>
              </h2>
            </div>

            <div className="p-4 flex-grow overflow-y-auto">
              {tasks
                .filter((task) => task.status === column)
                .map((task) => (
                  <div
                    key={task.id}
                    className="task-card bg-white border border-gray-200 rounded-md p-4 mb-3 shadow-card hover:shadow-card-hover cursor-move relative"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                  >
                    <div
                      className={`absolute top-0 left-0 w-1 h-full ${columnColors[column]} rounded-l-md`}
                    ></div>
                    <h3 className="font-medium text-gray-800 mb-2">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{task.description}</p>

                    {/* Task action buttons */}
                    <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
                      <button
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(task);
                        }}
                        title="Edit task"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (task.id) handleDeleteClick(task.id);
                        }}
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

              {tasks.filter((task) => task.status === column).length === 0 && (
                <div className="text-center py-6 text-gray-400">
                  <p>No tasks in this column</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Task Modal */}
      <TaskModal
        task={editingTask}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSave={onUpdateTask}
      />

      {/* Delete Task Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle size={20} /> Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default KanbanBoard;
