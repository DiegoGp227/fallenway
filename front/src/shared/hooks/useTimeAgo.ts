import { useMemo } from "react";

const ago = (count: number, unit: string) =>
  `${count} ${unit}${count > 1 ? "s" : ""} ago`;

export default function useTimeAgo(dateStr: string): string {
  return useMemo(() => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return ago(years, "year");
    if (months > 0) return ago(months, "month");
    if (weeks > 0) return ago(weeks, "week");
    if (days > 0) return ago(days, "day");
    if (hours > 0) return ago(hours, "hour");
    if (minutes > 0) return ago(minutes, "minute");
    return "just now";
  }, [dateStr]);
}
