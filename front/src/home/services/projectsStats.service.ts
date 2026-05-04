import { projectsStatsURL } from "@/src/shared/constants/urls";
import { fetcher } from "@/utils/utils";
import { StatsResponse } from "../types/home.types";

export function getStats(): Promise<StatsResponse> {
  return fetcher<StatsResponse>(projectsStatsURL.toString());
}
