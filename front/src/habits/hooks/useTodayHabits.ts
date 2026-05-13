import useSWR from "swr";
import { HabitsTodayURL } from "@/src/shared/constants/urls";
import { fetcher } from "@/utils/utils";
import { TodayHabitsResponse } from "../types/habits.types";

export const HABITS_TODAY_KEY = HabitsTodayURL.toString();

export default function useTodayHabits() {
  const { data, isLoading, error, mutate } = useSWR(HABITS_TODAY_KEY, () =>
    fetcher<TodayHabitsResponse>(HABITS_TODAY_KEY)
  );

  return {
    date: data?.date ?? null,
    habits: data?.habits ?? [],
    loading: isLoading,
    error: error ? "Error loading habits" : null,
    mutate,
  };
}
