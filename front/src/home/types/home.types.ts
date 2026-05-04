export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";

export type ProjectColor = string;

export interface Project {
  id: number;
  name: string;
  description?: string;
  color: ProjectColor;
  status: ProjectStatus;
  technologies: string[];
  tasksTotal: number;
  tasksDone: number;
  createdAt: string;
  updatedAt: string;
  _count: { epics: number };
}

export interface ProjectsResponse {
  projects: Project[];
}

export interface CreateProjectDto {
  name: string;
  color: string;
  description?: string;
  technologies?: string[];
}

export interface StatsBody {
  active: number;
  completed: number;
  archived: number;
}

export interface StatsResponse {
  stats: StatsBody;
}