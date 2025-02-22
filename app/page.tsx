"use client";
import { useQuery } from "@tanstack/react-query";
import Task from "./components/Task";
import { getTasks } from "./services/apiTasks";

import AddTasksField from "./components/AddTasksField";
import Loading from "./components/Loading";
import { useState } from "react";

export function page() {
  const [filter, setFilter] = useState("all");
  const {
    isLoading,
    data: tasks,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const filteredTasks = tasks?.filter((task: any) => {
    if (filter === "pending") return task.status === "pending";
    if (filter === "complete") return task.status === "complete";
    return true; // Show all tasks if filter is "all"
  });

  if (isLoading) return <Loading />;

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10">
      <div className="flex justify-between gap-3">
        <h4 className="text-lg font-bold text-blue-700">Task Manager</h4>
        <AddTasksField />
      </div>
      <div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Tasks</option>
          <option value="pending">Pending Tasks</option>
          <option value="complete">Complete Tasks</option>
        </select>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {filteredTasks.map((task: any) => (
          <Task
            key={task.id}
            data={{
              id: task.id,
              description: task.description,
              isEdit: task.isEdit,
              isComplete: task.isComplete,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default page;
