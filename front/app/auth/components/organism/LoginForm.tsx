"use client";

import { useLogin } from "@/src/auth/hooks/useLogin";
import { ICredentials } from "@/src/auth/types/auth.types";
import { SendHorizontal } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const DEMO_CREDENTIALS: ICredentials = {
  email: "demo@skemap.dev",
  password: "demo1234",
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICredentials>();
  const { user, error, loading, login } = useLogin();

  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/");
  }, [user]);

  return (
    <form onSubmit={handleSubmit(login)} className="flex flex-col gap-6 w-full">
      <div className="flex flex-col">
        <input
          type="text"
          id="email"
          {...register("email")}
          className="peer order-2 border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-accent focus:bg-accent/5 transition-all duration-500"
          disabled={loading}
        />
        <label
          htmlFor="email"
          className="order-1 text-fg-muted peer-focus:text-accent transition-colors duration-500"
        >
          Email
        </label>
      </div>
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}

      <div className="flex flex-col">
        <input
          type="password"
          id="password"
          {...register("password")}
          className="peer order-2 border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-accent focus:bg-accent/5 transition-all duration-500"
          disabled={loading}
        />
        <label
          htmlFor="password"
          className="order-1 text-fg-muted peer-focus:text-accent transition-colors duration-500"
        >
          Password
        </label>
      </div>
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="button"
        onClick={() => login(DEMO_CREDENTIALS)}
        disabled={loading}
        className="flex items-center justify-center gap-2 border-2 border-accent px-1 py-2 bg-base hover:bg-gray-900 transition-all duration-500 rounded font-semibold text-white cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.818a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .845-.143Z"
            clipRule="evenodd"
          />
        </svg>
        Start Demo
      </button>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 border-2 border-accent px-1 py-2 bg-accent hover:bg-accent transition-all duration-500 text-white cursor-pointer"
        disabled={loading}
      >
        {loading ? (
          "Loading..."
        ) : (
          <>
            <SendHorizontal />
            Send
          </>
        )}
      </button>
    </form>
  );
}
