import prisma from "../../db/prisma.js";
import { ForbiddenError, NotFoundError } from "../../errors/appError.js";
import { CreateCategoryDTO, UpdateCategoryDTO } from "./categories.schemas.js";

export const getCategories = async (userId: string) => {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
};

export const createCategory = async (userId: string, data: CreateCategoryDTO) => {
  return prisma.category.create({
    data: { ...data, userId },
  });
};

export const updateCategory = async (categoryId: string, userId: string, data: UpdateCategoryDTO) => {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });

  if (!category) throw new NotFoundError("Category not found");
  if (category.userId !== userId) throw new ForbiddenError("Access denied");

  return prisma.category.update({
    where: { id: categoryId },
    data,
  });
};

export const deleteCategory = async (categoryId: string, userId: string) => {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });

  if (!category) throw new NotFoundError("Category not found");
  if (category.userId !== userId) throw new ForbiddenError("Access denied");

  await prisma.category.delete({ where: { id: categoryId } });
};
