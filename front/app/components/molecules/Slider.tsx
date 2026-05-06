"use client";

import { Bolt, Boxes, ChartSpline, Snowflake } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Today", icon: Snowflake, route: "/" },
  { label: "Habits", icon: Boxes, route: "/habits" },
  { label: "Stats", icon: ChartSpline, route: "/stats" },
  { label: "Configuration", icon: Bolt, route: "/configuration" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-bg/60 border-r border-border z-20 flex flex-col">
      <div className="px-4 py-5">
        <Image
          src="/fallenway-wordmark.svg"
          width={140}
          height={40}
          alt="Fallenway"
        />
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1 px-2">
          {NAV_ITEMS.map(({ label, icon: Icon, route }) => {
            const isActive =
              route === "/" ? pathname === "/" : pathname.startsWith(route);
            return (
              <li key={label}>
                <a
                  href={route}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-app-sm transition-colors
                    ${isActive
                      ? "bg-accent/15 text-accent border-r-2 border-accent"
                      : "text-text-muted hover:bg-nav-hover hover:text-text"
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-accent" : "text-text-muted"}`} />
                  <span className="text-sm font-medium">{label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
