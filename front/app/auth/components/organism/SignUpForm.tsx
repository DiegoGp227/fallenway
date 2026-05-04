import { useSignUp } from "@/src/auth/hooks/useSignUp";
import { ICreateUserRequest } from "@/src/auth/types/auth.types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateUserRequest>();

  const { user, error, loading, signup } = useSignUp();

  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/");
  }, [user]);

  return (
    <form
      action=""
      className="flex justify-center flex-col w-full gap-5"
      onSubmit={handleSubmit(signup)}
    >
      <div className="flex flex-col">
        <label htmlFor="name" className="text-fg-muted">
          Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
          {...register("name")}
          disabled={loading}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="email" className="text-fg-muted">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
          {...register("email")}
          disabled={loading}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="text-fg-muted">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-blue-600 transition-all duration-500"
          {...register("password")}
          disabled={loading}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="border-2 border-border px-1 py-2 bg-blue-600 hover:bg-blue-700 transition-all duration-500"
        disabled={loading}
      >
        {loading ? "loading..." : "send"}
      </button>
    </form>
  );
}
