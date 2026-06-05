import { useSignUp } from "@/src/auth/hooks/useSignUp";
import { ICreateUserRequest } from "@/src/auth/types/auth.types";
import { SendHorizontalIcon } from "lucide-react";
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
        <input
          id="name"
          type="text"
          className="peer order-2 border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-accent focus:bg-accent/5 transition-all duration-500"
          {...register("name")}
          disabled={loading}
        />
        <label
          htmlFor="name"
          className="order-1 text-fg-muted peer-focus:text-accent transition-colors duration-500"
        >
          Name
        </label>
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      <div className="flex flex-col">
        <input
          id="email"
          type="email"
          className="peer order-2 border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-accent focus:bg-accent/5 transition-all duration-500"
          {...register("email")}
          disabled={loading}
        />
        <label
          htmlFor="email"
          className="order-1 text-fg-muted peer-focus:text-accent transition-colors duration-500"
        >
          Email
        </label>
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>
      <div className="flex flex-col">
        <input
          id="password"
          type="password"
          className="peer order-2 border-2 border-border px-1 py-2 rounded focus:outline-none focus:border-accent focus:bg-accent/5 transition-all duration-500"
          {...register("password")}
          disabled={loading}
        />
        <label
          htmlFor="password"
          className="order-1 text-fg-muted peer-focus:text-accent transition-colors duration-500"
        >
          Password
        </label>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="flex items-center justify-center gap-2 border-2 border-accent px-1 py-2 bg-accent hover:bg-accent transition-all duration-500 text-white cursor-pointer"
        disabled={loading}
      >
        <SendHorizontalIcon />
        {loading ? "loading..." : "send"}
      </button>
    </form>
  );
}
