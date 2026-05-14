"use client";

import { useEffect } from "react";

interface Props {
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ onClose, title, children, maxWidth = "max-w-md" }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className={`relative bg-surface border border-border rounded-xl w-full ${maxWidth} flex flex-col gap-5 p-6 z-30`}>
        {title && (
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-text">{title}</h2>
            <button
              onClick={onClose}
              className="text-text-dim hover:text-text transition-colors text-lg leading-none"
            >
              ✕
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
