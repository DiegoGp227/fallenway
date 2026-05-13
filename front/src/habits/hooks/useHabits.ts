import useSWR from "swr";
import { getHabits } from "../services/habits.services";
import { Habit } from "../types/habits.types";

export default function useHabits() {
  const { data, isLoading, error } = useSWR("habits", getHabits);

  return {
    habits: data?.habits ?? ([] as Habit[]),
    loading: isLoading,
    error: error ? "Error loading habits" : null,
  };
}
