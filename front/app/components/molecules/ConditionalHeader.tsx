"use client";

import { usePathname } from "next/navigation";
import Slider from "./Slider";

const HEADER_ROUTES = ["/", "/habits"];

export default function ConditionalHeader() {
  const pathname = usePathname();
  const showHeader = HEADER_ROUTES.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route),
  );

  if (!showHeader) return null;
  return <Slider />;
}
