"use client"
import { useState } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { schema } from "../formFields";
import { createTask } from "../services/apiTasks";
import { queryClient } from "./QueryProvider";

function AddTasksField() {
  const [text, setText] = useState(undefined);

  const { isPending: isCreateLoading, mutate: addTask } = useMutation({
    mutationFn: (data: any) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      reset();
    },
  });

  const handleChange = (e: any) => {
    setText(e.target.value);
  };

  const onSubmitForm = () => {
    addTask({ isEdit: false, description: text ,isComplete:false , status : "pending"});
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });
  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="flex gap-3">
        <div className="flex">
          <input
            type="text"
            {...register("task")}
            placeholder="Add your Task"
            className="border border-green-700 px-2 rounded"
            onChange={handleChange}
          />
          {errors.task && <p className="text-red-500">{errors.task.message}</p>}
        </div>

        <button
          disabled={isCreateLoading}
          className="px-4 py-2 bg-green-800 rounded-lg text-white"
        >
          {isCreateLoading ? "Creating..." : "Add Task"}
        </button>
      </div>
    </form>
  );
}

export default AddTasksField;
