import { Frequency } from "@prisma/client";

export interface IHabitResponse {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  color: string | null;
  sortOrder: number;
  active: boolean;
  frequency: Frequency;
  weekDays: number[];
  timesPerWeek: number | null;
  intervalDays: number | null;
  createdAt: Date;
  updatedAt: Date;
}
