import { Router } from "express";
import dbCheck from "../modules/test/test.js";
import { login, signup } from "../modules/auth/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  archiveHabitHandler,
  createHabitHandler,
  getHabit,
  getTodayHabits,
  listHabits,
  logHabitHandler,
  updateHabitHandler,
} from "../modules/habits/habits.controllers.js";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  listCategories,
  updateCategoryHandler,
} from "../modules/categories/categories.controllers.js";
import { getContributionsHandler } from "../modules/stats/stats.controllers.js";

export const router: Router = Router();

// Test Routes
router.get("/db", dbCheck);

// Auth Routes
router.post("/signup", signup);
router.post("/login", login);

// Habits Routes
router.get("/habits", authMiddleware, listHabits);
router.post("/habits", authMiddleware, createHabitHandler);
router.get("/habits/today", authMiddleware, getTodayHabits);
router.get("/habits/:id", authMiddleware, getHabit);
router.patch("/habits/:id", authMiddleware, updateHabitHandler);
router.post("/habits/:id/log", authMiddleware, logHabitHandler);
router.delete("/habits/:id", authMiddleware, archiveHabitHandler);

// Stats Routes
router.get("/stats/contributions", authMiddleware, getContributionsHandler);

// Categories Routes
router.get("/categories", authMiddleware, listCategories);
router.post("/categories", authMiddleware, createCategoryHandler);
router.patch("/categories/:id", authMiddleware, updateCategoryHandler);
router.delete("/categories/:id", authMiddleware, deleteCategoryHandler);
