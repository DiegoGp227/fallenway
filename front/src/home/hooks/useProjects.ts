import useSWR from "swr";
import { getProjects } from "../services/projects.services";
import { Project } from "../types/home.types";

export default function useProjects(status: string, search: string) {
  // La key de SWR es un array con los filtros actuales.
  // Cuando status o search cambian, SWR detecta una key distinta y re-fetcha automáticamente.
  // Esto reemplaza el useEffect + fetchProjects manual que teníamos antes.
  const { data, isLoading, error } = useSWR(
    ["projects", status, search],
    () => getProjects(status, search)
  );

  return {
    projects: data?.projects ?? ([] as Project[]),
    loading: isLoading,
    error: error ? "Error loading projects" : null,
  };
}
