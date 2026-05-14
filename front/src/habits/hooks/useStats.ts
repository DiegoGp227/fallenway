import useSWR from "swr";
import { StatsURL } from "@/src/shared/constants/urls";
import { fetcher } from "@/utils/utils";

export interface HabitRate {
  id: string;
  name: string;
  color: string | null;
  rate: number;
  streak: number;
  bestStreak: number;
}

export interface PeriodStats {
  completionRate: number;
  perfectDays: number;
  totalCompleted: number;
  totalExpected: number;
  habitRates: HabitRate[];
}

export default function useStats(dateRange: string) {
  const url = `${StatsURL}?range=${dateRange}`;
  const { data, isLoading, isValidating, error } = useSWR(url, () =>
    fetcher<PeriodStats>(url),
    { keepPreviousData: true }
  );

  return {
    stats: data ?? null,
    loading: isLoading,
    refreshing: isValidating,
    error: error ? "Error loading stats" : null,
  };
}
