import { useState } from "react";
import { mutate } from "swr";
import { updateTask } from "../services/tasks.services";
import { UpdateTaskDto } from "../types/projects.types";

interface UpdateTaskState {
  loading: boolean;
  error: string | null;
}

export default function useUpdateTask(taskId: number, projectId: string) {
  const [state, setState] = useState<UpdateTaskState>({
    loading: false,
    error: null,
  });

  const handleUpdateTask = async (dto: UpdateTaskDto): Promise<boolean> => {
    setState({ loading: true, error: null });
    try {
      await updateTask(taskId, dto);
      await mutate((key) => typeof key === "string" && key.startsWith(`project-board-${projectId}`), undefined, { revalidate: true });
      setState({ loading: false, error: null });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al actualizar la tarea";
      setState({ loading: false, error: message });
      return false;
    }
  };

  return { ...state, handleUpdateTask };
}
