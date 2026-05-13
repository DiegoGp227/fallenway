import useSWR from "swr";
import { StatsTodayURL } from "@/src/shared/constants/urls";
import { fetcher } from "@/utils/utils";

export interface StatsToday {
  completedToday: number;
  totalToday: number;
  weeklyRate: number;
  bestStreak: number;
  bestStreakHabit: string;
}

export default function useStatsToday() {
  const url = StatsTodayURL.toString();
  const { data, isLoading, error } = useSWR(url, () =>
    fetcher<StatsToday>(url)
  );

  return {
    stats: data ?? null,
    loading: isLoading,
    error: error ? "Error loading stats" : null,
  };
}
