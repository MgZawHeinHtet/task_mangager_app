"use client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Task from "./components/Task";
import { getTasks } from "./services/apiTasks";

import AddTasksField from "./components/AddTasksField";
import Loading from "./components/Loading";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import next from "next";

export function page() {
  const [filter, setFilter] = useState("all");
  const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["tasks"],
      queryFn: getTasks,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length ? allPages.length + 1 : undefined;
        return nextPage;
      },
    });

  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 1,
  });

  const filteredTasks = data?.pages?.filter((task: any) => {
    if (filter === "pending") return task.status === "pending";
    if (filter === "complete") return task.status === "complete";
    return true; // Show all tasks if filter is "all"
  });

  useEffect(
    function () {
      if (inView && hasNextPage) {
        fetchNextPage();
      }
    },
    [inView, hasNextPage, fetchNextPage]
  );

  if (isLoading) return <Loading />;

  console.log(data);

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10">
      <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
        add
      </button>
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
        {data?.pages?.map((tasks: any) =>
          tasks.map((task: any) => (
            <Task
              key={task.id}
              data={{
                id: task.id,
                description: task.description,
                isEdit: task.isEdit,
                isComplete: task.isComplete,
              }}
            />
          ))
        )}
      </div>

      {isFetchingNextPage && <div className="text-center">Loading....</div>}
      <div ref={ref} className="h-20 w-full"></div>
    </div>
  );
}

export default page;
