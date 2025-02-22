import { z } from "zod";

export const schema = z.object({
  task: z
    .string()
    .min(1, "task is required")
    .max(50, "Name must be less than 50 characters"),
});