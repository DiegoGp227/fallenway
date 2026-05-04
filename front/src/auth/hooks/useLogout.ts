"use client"
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  const logout = () => {
    localStorage.clear();
    router.push("/auth");
  };

  return logout;
}
