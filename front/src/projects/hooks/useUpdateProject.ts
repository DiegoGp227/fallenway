import { useState } from "react";
import { mutate } from "swr";
import { updateProject } from "../services/projectBoard.service";
import { UpdateProjectDto } from "../types/projects.types";

interface UpdateProjectState {
  loading: boolean;
  error: string | null;
}

export default function useUpdateProject(projectId: number) {
  const [state, setState] = useState<UpdateProjectState>({
    loading: false,
    error: null,
  });

  const handleUpdateProject = async (dto: UpdateProjectDto): Promise<boolean> => {
    setState({ loading: true, error: null });
    try {
      await updateProject(projectId, dto);
      await mutate((key) => typeof key === "string" && key.startsWith(`project-board-${projectId}`), undefined, { revalidate: true });
      setState({ loading: false, error: null });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al actualizar el proyecto";
      setState({ loading: false, error: message });
      return false;
    }
  };

  return { ...state, handleUpdateProject };
}
