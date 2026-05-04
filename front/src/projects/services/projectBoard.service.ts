import { projectBoardURL } from "@/src/shared/constants/urls";
import { fetcher, patchFetcher, deleteFetcher } from "@/utils/utils";
import { Task, TaskStatus, ProjectBoardResponse, UpdateProjectDto, BoardProject } from "../types/projects.types";

export function getProjectBoard(
  id: string,
  statuses: TaskStatus[]
): Promise<ProjectBoardResponse> {
  const url = projectBoardURL(id);
  statuses.forEach((s) => url.searchParams.append("status", s));
  return fetcher<ProjectBoardResponse>(url.toString());
}

export function updateProject(
  projectId: number,
  dto: UpdateProjectDto
): Promise<{ project: BoardProject }> {
  return patchFetcher<{ project: BoardProject }>(`projects/${projectId}`, dto);
}

export function deleteProject(projectId: number): Promise<void> {
  return deleteFetcher(`projects/${projectId}`);
}

// Actualiza el status de una tarea en el backend.
// El backend valida que el usuario sea owner del proyecto antes de aplicar el cambio.
export function updateTaskStatus(
  taskId: number,
  status: TaskStatus
): Promise<{ task: Task }> {
  return patchFetcher<{ task: Task }>(`tasks/${taskId}/status`, { status });
}
