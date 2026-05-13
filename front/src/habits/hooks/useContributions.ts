import useSWR from "swr";
import { ContributionsUrl } from "@/src/shared/constants/urls";
import { fetcher } from "@/utils/utils";

export interface Contribution {
  date: string; 
  completed: number;
  total: number;
  level: number;
}

interface ContributionsResponse {
  contributions: Contribution[];
}

export default function useContributions() {
  const url = ContributionsUrl.toString();
  const { data, isLoading, error } = useSWR(url, () =>
    fetcher<ContributionsResponse>(url)
  );

  return {
    contributions: data?.contributions ?? [],
    loading: isLoading,
    error: error ? "Error loading contributions" : null,
  };
}
