import { useState } from "react";
import { mutate } from "swr";
import { CreateEpicDto, Epic } from "../types/projects.types";
import { createEpic as createEpicService } from "../services/epics.services";

interface CreateEpicState {
  epic: Epic | null;
  loading: boolean;
  error: string | null;
}

export default function useCreateEpic(projectId: string) {
  const [state, setState] = useState<CreateEpicState>({
    epic: null,
    loading: false,
    error: null,
  });

  const handleCreateEpic = async (dto: CreateEpicDto): Promise<boolean> => {
    setState({ epic: null, loading: true, error: null });
    try {
      const { epic } = await createEpicService(projectId, dto);
      setState({ epic, loading: false, error: null });

      await mutate(
        (key) => typeof key === "string" && key.startsWith(`project-board-${projectId}`),
        undefined,
        { revalidate: true },
      );

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al crear la épica";
      setState({ epic: null, loading: false, error: message });
      return false;
    }
  };

  return { ...state, handleCreateEpic };
}
