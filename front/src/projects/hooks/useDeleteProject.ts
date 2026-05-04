import { useState } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { deleteProject } from "../services/projectBoard.service";

interface DeleteProjectState {
  loading: boolean;
  error: string | null;
}

export default function useDeleteProject(projectId: number) {
  const router = useRouter();
  const [state, setState] = useState<DeleteProjectState>({
    loading: false,
    error: null,
  });

  const handleDeleteProject = async (): Promise<boolean> => {
    setState({ loading: true, error: null });
    try {
      await deleteProject(projectId);
      await mutate((key) => Array.isArray(key) && key[0] === "projects", undefined, { revalidate: true });
      router.push("/");
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al eliminar el proyecto";
      setState({ loading: false, error: message });
      return false;
    }
  };

  return { ...state, handleDeleteProject };
}
