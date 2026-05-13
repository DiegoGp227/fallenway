import { CategoriesURL, HabitsURL } from "@/src/shared/constants/urls";
import { deleteFetcher, fetcher, patchFetcher, postFetcher } from "@/utils/utils";
import { CategoriesResponse, Habit, HabitCategory, HabitsResponse } from "../types/habits.types";

// ── Habits ──────────────────────────────────────────────────────────────────

export function getHabits(): Promise<HabitsResponse> {
  return fetcher<HabitsResponse>(HabitsURL.toString());
}

export function createHabit(data: Partial<Habit>): Promise<{ habit: Habit }> {
  return postFetcher<{ habit: Habit }>(HabitsURL.toString(), data);
}

export function updateHabit(id: string, data: Partial<Habit>): Promise<{ habit: Habit }> {
  return patchFetcher<{ habit: Habit }>(`${HabitsURL}/${id}`, data);
}

export function archiveHabit(id: string): Promise<{ message: string }> {
  return deleteFetcher(`${HabitsURL}/${id}`);
}

// ── Categories ───────────────────────────────────────────────────────────────

export function getCategories(): Promise<CategoriesResponse> {
  return fetcher<CategoriesResponse>(CategoriesURL.toString());
}

export function createCategory(data: { name: string; color?: string }): Promise<{ category: HabitCategory }> {
  return postFetcher<{ category: HabitCategory }>(CategoriesURL.toString(), data);
}

export function updateCategory(id: string, data: { name?: string; color?: string }): Promise<{ category: HabitCategory }> {
  return patchFetcher<{ category: HabitCategory }>(`${CategoriesURL}/${id}`, data);
}

export function deleteCategory(id: string): Promise<{ message: string }> {
  return deleteFetcher(`${CategoriesURL}/${id}`);
}
