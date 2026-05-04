import { useState } from "react";
import { mutate } from "swr";
import { updateEpic } from "../services/epics.services";
import { UpdateEpicDto } from "../types/projects.types";

interface UpdateEpicState {
  loading: boolean;
  error: string | null;
}

export default function useUpdateEpic(epicId: number, projectId: string) {
  const [state, setState] = useState<UpdateEpicState>({
    loading: false,
    error: null,
  });

  const handleUpdateEpic = async (dto: UpdateEpicDto): Promise<boolean> => {
    setState({ loading: true, error: null });
    try {
      await updateEpic(epicId, dto);
      await mutate(
        (key) => typeof key === "string" && key.startsWith(`project-board-${projectId}`),
        undefined,
        { revalidate: true },
      );
      setState({ loading: false, error: null });
      return true;
    } catch {
      setState({ loading: false, error: "Error al actualizar el epic" });
      return false;
    }
  };

  return { ...state, handleUpdateEpic };
}
