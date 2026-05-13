import { z } from "zod";

const colorRegex = /^#[0-9a-fA-F]{6}$/;

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(colorRegex).optional().default("#7a7e9a"),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z.string().regex(colorRegex).optional(),
});

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
