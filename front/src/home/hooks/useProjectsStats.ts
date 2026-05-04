import useSWR from "swr";
import { getStats } from "../services/projectsStats.service";
import { StatsResponse } from "../types/home.types";

export default function useProjectsStats() {
  const { data, isLoading, error } = useSWR<StatsResponse>(
    "projects-stats",
    () => getStats(),
  );

  return {
    stats: data?.stats ?? { active: 0, completed: 0, archived: 0 },
    loading: isLoading,
    error: error ? "Error loading stats" : null,
  };
}
