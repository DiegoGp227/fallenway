import { useState } from "react";
import { mutate } from "swr";
import { deleteTask } from "../services/tasks.services";

interface DeleteTaskState {
  loading: boolean;
  error: string | null;
}

export default function useDeleteTask(taskId: number, projectId: string) {
  const [state, setState] = useState<DeleteTaskState>({
    loading: false,
    error: null,
  });

  const handleDeleteTask = async (): Promise<boolean> => {
    setState({ loading: true, error: null });
    try {
      await deleteTask(taskId);
      await mutate(
        (key) => typeof key === "string" && key.startsWith(`project-board-${projectId}`),
        undefined,
        { revalidate: true },
      );
      setState({ loading: false, error: null });
      return true;
    } catch {
      setState({ loading: false, error: "Error al eliminar la tarea" });
      return false;
    }
  };

  return { ...state, handleDeleteTask };
}
