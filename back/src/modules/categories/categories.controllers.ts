import { Request, Response } from "express";
import { ValidationError } from "../../errors/appError.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { createCategorySchema, updateCategorySchema } from "./categories.schemas.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "./categories.services.js";

export const listCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await getCategories(req.user!.id);
  res.status(200).json({ categories });
});

export const createCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = createCategorySchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.reduce<Record<string, string>>((acc, err) => {
      acc[err.path.join(".")] = err.message;
      return acc;
    }, {});
    throw new ValidationError("Validation errors", errors);
  }

  const category = await createCategory(req.user!.id, result.data);
  res.status(201).json({ category });
});

export const updateCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = updateCategorySchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.reduce<Record<string, string>>((acc, err) => {
      acc[err.path.join(".")] = err.message;
      return acc;
    }, {});
    throw new ValidationError("Validation errors", errors);
  }

  const category = await updateCategory(req.params.id as string, req.user!.id, result.data);
  res.status(200).json({ category });
});

export const deleteCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
  await deleteCategory(req.params.id as string, req.user!.id);
  res.status(200).json({ message: "Category deleted" });
});
