import { postFetcher, patchFetcher, deleteFetcher } from "@/utils/utils";
import { CreateTaskDto, CreateTaskResponse, UpdateTaskDto, Task } from "../types/projects.types";

export function createTask(
  epicId: number,
  dto: CreateTaskDto,
): Promise<CreateTaskResponse> {
  return postFetcher<CreateTaskResponse>(`epics/${epicId}/tasks`, dto);
}

export function updateTask(
  taskId: number,
  dto: UpdateTaskDto,
): Promise<{ task: Task }> {
  return patchFetcher<{ task: Task }>(`tasks/${taskId}`, dto);
}

export function deleteTask(taskId: number): Promise<void> {
  return deleteFetcher(`tasks/${taskId}`);
}
