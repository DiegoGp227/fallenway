import { useState } from "react";
import { mutate } from "swr";
import { deleteEpic } from "../services/epics.services";

interface DeleteEpicState {
  loading: boolean;
  error: string | null;
}

export default function useDeleteEpic(epicId: number, projectId: string) {
  const [state, setState] = useState<DeleteEpicState>({
    loading: false,
    error: null,
  });

  const handleDeleteEpic = async (): Promise<boolean> => {
    setState({ loading: true, error: null });
    try {
      await deleteEpic(epicId);
      await mutate(
        (key) => typeof key === "string" && key.startsWith(`project-board-${projectId}`),
        undefined,
        { revalidate: true },
      );
      setState({ loading: false, error: null });
      return true;
    } catch {
      setState({ loading: false, error: "Error al eliminar el epic" });
      return false;
    }
  };

  return { ...state, handleDeleteEpic };
}
