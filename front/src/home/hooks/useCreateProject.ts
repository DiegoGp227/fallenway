import { useState } from "react";
import { mutate } from "swr";
import { createProject } from "../services/projects.services";
import { CreateProjectDto, Project } from "../types/home.types";

interface CreateProjectState {
  response: Project | null;
  loading: boolean;
  error: string | null;
}

export default function useCreateProject() {
  const [state, setState] = useState<CreateProjectState>({
    response: null,
    loading: false,
    error: null,
  });

  const handleCreateProject = async (dto: CreateProjectDto): Promise<boolean> => {
    setState({ response: null, loading: true, error: null });
    try {
      const response = await createProject(dto);
      setState({ response, loading: false, error: null });

      await mutate((key) => Array.isArray(key) && key[0] === "projects", undefined, { revalidate: true });

      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al crear el proyecto";
      setState({ response: null, loading: false, error: message });
      return false;
    }
  };

  return { ...state, handleCreateProject };
}
