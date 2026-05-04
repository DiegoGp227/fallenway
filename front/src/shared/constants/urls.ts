export const BaseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/";

//AUTH
export const LoginURL = new URL("login", BaseURL);

export const SignUpURL = new URL("signup", BaseURL);

export const projectsURL = new URL("projects", BaseURL);

export const projectsStatsURL = new URL("projects/stats", BaseURL);

export const projectBoardURL = (id: string) =>
  new URL(`projects/${id}/board`, BaseURL);

export const taskURL = (id: string) =>
  new URL(`tasks/${id}/status`, BaseURL);