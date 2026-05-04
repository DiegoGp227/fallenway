export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface AcceptanceCriteria {
  id: number;
  text: string;
  done: boolean;
  order: number;
  taskId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  order: number;
  dueDate: string | null;
  epicId: number;
  technologies: string[];
  createdAt: string;
  updatedAt: string;
  acceptanceCriteria: AcceptanceCriteria[];
}

export interface Epic {
  id: number;
  name: string;
  description: string | null;
  color: string;
  order: number;
  projectId: number;
  tasksTotal: number;
  tasksDone: number;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
}

export interface BoardProject {
  id: number;
  name: string;
  description: string | null;
  color: string;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  technologies: string[];
  ownerId: number;
  tasksTotal: number;
  tasksDone: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectBoardResponse {
  project: BoardProject;
  epics: Epic[];
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority?: TaskPriority;
  technologies?: string[];
  dueDate?: string;
  acceptanceCriteria?: string[];
}

export interface CreateTaskResponse {
  task: Task;
}

export interface CreateEpicDto {
  name: string;
  description?: string;
  color: string;
}

export interface CreateEpicResponse {
  epic: Epic;
}

export interface UpdateEpicDto {
  name?: string;
  description?: string;
  color?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  technologies?: string[];
  acceptanceCriteria?: string[];
}

export interface UpdateProjectDto {
  name?: string;
  color?: string;
  description?: string;
  technologies?: string[];
  status?: "ACTIVE" | "COMPLETED" | "ARCHIVED";
}