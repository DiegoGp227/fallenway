export const BaseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/";

//AUTH
export const LoginURL = new URL("login", BaseURL);

export const SignUpURL = new URL("signup", BaseURL);

