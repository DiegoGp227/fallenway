"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import { AnimatePresence, motion } from "framer-motion";
import SelectAuthSystem from "../molecules/SelectSystem";
import Image from "next/image";
import SignUpForm from "./SignUpForm";

export default function AuthSistem() {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const variants = {
    enter: (toLogin: boolean) => ({
      x: toLogin ? -40 : 40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (toLogin: boolean) => ({
      x: toLogin ? 40 : -40,
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col gap-6 w-full p-8">
      <div className="flex justify-center">
        <Image
          src="/fallenway-logo.svg"
          width={300}
          height={300}
          alt="Fallenway"
        />
      </div>

      <SelectAuthSystem isLogin={isLogin} setIsLogin={setIsLogin} />

      <AnimatePresence mode="wait" custom={isLogin}>
        <motion.div
          key={isLogin ? "login" : "signup"}
          custom={isLogin}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center">
            {isLogin ? (
              <>
                <h2 className="font-bold text-2xl">Welcome back</h2>
                <p className="text-fg-muted text-sm">Continue where you left off.</p>
              </>
            ) : (
              <>
                <h2 className="font-bold text-2xl">Create an account</h2>
                <p className="text-fg-muted text-sm">Get started today, for free.</p>
              </>
            )}
          </div>
          {isLogin ? <LoginForm /> : <SignUpForm />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
