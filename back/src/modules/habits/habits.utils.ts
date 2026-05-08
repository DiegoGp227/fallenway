export const getTodayInTimezone = (timezone: string): string => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

export const getDayOfWeekInTimezone = (timezone: string): number => {
  const localDate = new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));
  return localDate.getDay(); // 0=Sun, 1=Mon...6=Sat
};

export const getWeekBounds = (todayStr: string): { weekStart: Date; nextWeekStart: Date } => {
  const today = new Date(todayStr + "T00:00:00.000Z");
  const dayOfWeek = today.getUTCDay();

  const weekStart = new Date(today);
  weekStart.setUTCDate(today.getUTCDate() - dayOfWeek);

  const nextWeekStart = new Date(weekStart);
  nextWeekStart.setUTCDate(weekStart.getUTCDate() + 7);

  return { weekStart, nextWeekStart };
};
