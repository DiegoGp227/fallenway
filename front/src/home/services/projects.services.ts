import { projectsURL } from "@/src/shared/constants/urls";
import { fetcher, postFetcher } from "@/utils/utils";
import {
  CreateProjectDto,
  Project,
  ProjectsResponse,
} from "../types/home.types";

export function getProjects(
  status: string,
  search: string,
): Promise<ProjectsResponse> {
  const url = new URL(projectsURL.toString());

  if (status && status !== "all") url.searchParams.set("status", status);
  if (search) url.searchParams.set("search", search);

  return fetcher<ProjectsResponse>(url.toString());
}

export function createProject(dto: CreateProjectDto): Promise<Project> {
  return postFetcher<Project>(projectsURL.toString(), dto);
}

