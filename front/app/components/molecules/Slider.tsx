"use client";

import { useLogout } from "@/src/auth/hooks/useLogout";
import { useAppStoreState } from "@/store/hooks";
import { Bolt, Boxes, ChartSpline, LogOut, Snowflake } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

const NAV_ITEMS = [
  { label: "Today", icon: Snowflake, route: "/" },
  { label: "Habits", icon: Boxes, route: "/habits" },
  { label: "Stats", icon: ChartSpline, route: "/stats" },
  { label: "Configuration", icon: Bolt, route: "/configuration" },
];

function getInitials(name: string): string {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useLogout();
  const user = useAppStoreState((state) => state.auth.user?.userInfo);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = user?.name ? getInitials(user.name) : "?";

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

      {/* Profile footer */}
      <div ref={ref} className="px-3 py-3 border-t border-border relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-app-sm hover:bg-nav-hover transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-accent-dark flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold text-white">{initials}</span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[13px] font-medium text-text truncate">{user?.name ?? "User"}</p>
            <p className="text-[11px] text-text-dim truncate">{user?.email ?? ""}</p>
          </div>
        </button>

        {open && (
          <div className="absolute bottom-full left-3 right-3 mb-1 bg-surface border border-border rounded-[8px] overflow-hidden shadow-lg">
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-text-muted hover:bg-nav-hover hover:text-text transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="text-[13px] font-medium">Log out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
