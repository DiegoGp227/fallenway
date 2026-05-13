export type Frequency = "DAILY" | "SPECIFIC_DAYS" | "TIMES_PER_WEEK" | "EVERY_N_DAYS";
export type WeekDayStatus = "done" | "skip" | "miss" | "na";

export interface HabitCategory {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  color: string | null;
  sortOrder: number;
  active: boolean;
  paused: boolean;
  frequency: Frequency;
  weekDays: number[];
  timesPerWeek: number | null;
  intervalDays: number | null;
  categoryId: string | null;
  category: HabitCategory | null;
  streak: number;
  bestStreak: number;
  weekStatus: WeekDayStatus[];
  monthRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface HabitsResponse {
  habits: Habit[];
}

export interface CategoriesResponse {
  categories: HabitCategory[];
}

export interface TodayHabitLog {
  id: string;
  status: "COMPLETED" | "SKIPPED";
  note: string | null;
  subtaskLogs: string[];
}

export interface TodayHabit {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  sortOrder: number;
  frequency: Frequency;
  weekDays: number[];
  timesPerWeek: number | null;
  intervalDays: number | null;
  streak: number;
  log: TodayHabitLog | null;
  weekProgress?: { completed: number; target: number };
}

export interface TodayHabitsResponse {
  date: string;
  habits: TodayHabit[];
}
