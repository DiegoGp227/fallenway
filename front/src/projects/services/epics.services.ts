import { postFetcher, patchFetcher, deleteFetcher } from "@/utils/utils";
import { CreateEpicDto, CreateEpicResponse, UpdateEpicDto, Epic } from "../types/projects.types";

export function createEpic(
  projectId: string,
  dto: CreateEpicDto,
): Promise<CreateEpicResponse> {
  return postFetcher<CreateEpicResponse>(`projects/${projectId}/epics`, dto);
}

export function updateEpic(
  epicId: number,
  dto: UpdateEpicDto,
): Promise<{ epic: Epic }> {
  return patchFetcher<{ epic: Epic }>(`epics/${epicId}`, dto);
}

export function deleteEpic(epicId: number): Promise<void> {
  return deleteFetcher(`epics/${epicId}`);
}
