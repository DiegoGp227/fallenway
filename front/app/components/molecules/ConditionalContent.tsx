"use client";

import { usePathname } from "next/navigation";

const SIDEBAR_ROUTES = ["/", "/projects", "/profile"];

export default function ConditionalContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hasSidebar = SIDEBAR_ROUTES.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route),
  );

  return (
    <div
      className={`relative z-10 flex-1 w-full flex flex-col h-full transition-all ${
        hasSidebar ? "pl-56" : ""
      }`}
    >
      {children}
    </div>
  );
}
