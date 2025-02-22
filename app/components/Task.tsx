"use client";
import check from "@/public/check.jpg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { schema } from "../formFields";
import { completeTask, deleteTask, updateTask } from "../services/apiTasks";
import { queryClient } from "./QueryProvider";

function Task({ data }: TaskType) {
  const [isEditing, setIsEditing] = useState(data.isEdit);

  const [text, setText] = useState("");

  const { isPending: isDeleteLoading, mutate: removeTask } = useMutation({
    mutationFn: () => deleteTask(data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Invalidate and refetch
    },
  });

  const { isPending: isUpdateLoading, mutate: updatingTask } = useMutation({
    mutationFn: (data: any) => updateTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Invalidate and refetch
    },
  });

  const { isPending: isCompleteLoading, mutate: completingTask } = useMutation({
    mutationFn: (data: any) => completeTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Invalidate and refetch
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleChange = (e: any) => {
    setText(e.target.value);
  };

  const onSubmitForm = () => {
    updatingTask({
      id: data.id,
      description: text,
      isEdit: false,
      isComplete: data.isComplete,
    });
    setIsEditing(false);
  };

  const handleCompleteTask = () => {
    const isCompleted = !data.isComplete

    const status = isCompleted === true ? 'complete' : 'pending'
    completingTask({
      id: data.id,
      description: data.description,
      isEdit: false,
      isComplete: !data.isComplete,
      status
    });
  };

  return (
    <div className="border p-2 space-y-2 rounded-lg">
      <Image
        src={check}
        alt="check img"
        width={800}
        height={600}
        placeholder="blur" // Add a blurry placeholder
      
        className="rounded-lg"
      />
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className={`space-y-2 flex gap-2`}
      >
        {isEditing ? (
          <>
            <input
              className="border w-full  py-2 px-2 border-green-400 rounded-lg"
              type="text"
              {...register("task")}
              placeholder="Add your task"
              onChange={handleChange}
              defaultValue={data.description}
            />

            <button
              disabled={isUpdateLoading}
              className="py-1 px-4 h-full bg-blue-500 rounded-xl text-white mr-2"
            >
              {isUpdateLoading ? "Updating..." : " Save"}
            </button>
          </>
        ) : (
          <h4 className={`text-xl ${data.isComplete ? "line-through" : ""}`}>
            {data.description}
          </h4>
        )}

        <hr />
      </form>

      {!isEditing && (
        <>
          <hr />
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="py-1 px-4 bg-blue-500 rounded-xl text-white mr-2"
          >
            Edit
          </button>

          <button
            disabled={isDeleteLoading}
            onClick={() => removeTask()}
            className="py-1 px-4 bg-red-500 rounded-xl text-white mr-2"
          >
            {isDeleteLoading ? "removing..." : " Delete"}
          </button>

          <button
            onClick={handleCompleteTask}
            className="py-1 px-4 bg-slate-300 rounded-xl text-white mr-2"
          >
            {data.isComplete ? "❌" : "✅"}
          </button>
        </>
      )}
    </div>
  );
}

export default Task;
