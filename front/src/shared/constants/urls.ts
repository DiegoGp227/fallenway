export const BaseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/";

//AUTH
export const LoginURL = new URL("login", BaseURL);
export const SignUpURL = new URL("signup", BaseURL);

//HABITS
export const HabitsURL = new URL("habits", BaseURL);

//CATEGORIES
export const CategoriesURL = new URL("categories", BaseURL);

//STATS
export const StatsURL = new URL("stats", BaseURL);

export const ContributionsUrl = new URL("stats/contributions", BaseURL);
