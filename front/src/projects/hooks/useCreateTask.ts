import { useState } from "react";
import { mutate } from "swr";
import { CreateTaskDto, Task } from "../types/projects.types";
import { createTask as createTaskService } from "../services/tasks.services";

interface CreateTaskState {
  task: Task | null;
  loading: boolean;
  error: string | null;
}

export default function useCreateTask(projectId: string) {
  const [state, setState] = useState<CreateTaskState>({
    task: null,
    loading: false,
    error: null,
  });

  const handleCreateTask = async (
    epicId: number,
    dto: CreateTaskDto,
  ): Promise<boolean> => {
    setState({ task: null, loading: true, error: null });
    try {
      const { task } = await createTaskService(epicId, dto);
      setState({ task, loading: false, error: null });

      // Revalida el board del proyecto para reflejar la nueva tarea
      await mutate(
        (key) => typeof key === "string" && key.startsWith(`project-board-${projectId}`),
        undefined,
        { revalidate: true },
      );

      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al crear la tarea";
      setState({ task: null, loading: false, error: message });
      return false;
    }
  };

  return { ...state, handleCreateTask };
}
