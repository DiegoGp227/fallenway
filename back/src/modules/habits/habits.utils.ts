import { Frequency, HabitLog, LogStatus } from "@prisma/client";

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

type HabitForStats = {
  frequency: Frequency;
  weekDays: number[];
  timesPerWeek: number | null;
  intervalDays: number | null;
  createdAt: Date;
  logs: HabitLog[];
};

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

const dateFromStr = (str: string): Date => new Date(str + "T00:00:00.000Z");

const addDays = (date: Date, n: number): Date => {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + n);
  return d;
};

const daysBetween = (a: Date, b: Date): number =>
  Math.round((b.getTime() - a.getTime()) / ONE_DAY_MS);

const findLog = (logs: HabitLog[], date: Date): HabitLog | undefined =>
  logs.find((l) => l.date.getTime() === date.getTime());

export const isHabitDueOnDate = (habit: HabitForStats, date: Date): boolean => {
  const dow = date.getUTCDay(); // 0=Sun…6=Sat
  switch (habit.frequency) {
    case Frequency.DAILY:
      return true;
    case Frequency.SPECIFIC_DAYS:
      return habit.weekDays.includes(dow);
    case Frequency.EVERY_N_DAYS: {
      const created = new Date(habit.createdAt.toISOString().split("T")[0] + "T00:00:00.000Z");
      const diff = daysBetween(created, date);
      return diff >= 0 && diff % (habit.intervalDays ?? 1) === 0;
    }
    case Frequency.TIMES_PER_WEEK:
      return true;
    default:
      return false;
  }
};

export const isDueOnDateWithWeekLogs = (
  habit: {
    frequency: Frequency;
    weekDays: number[];
    timesPerWeek: number | null;
    intervalDays: number | null;
    createdAt: Date;
  },
  date: Date,
  weekCompletedExcludingToday: number,
): boolean => {
  switch (habit.frequency) {
    case Frequency.DAILY:
      return true;
    case Frequency.SPECIFIC_DAYS:
      return habit.weekDays.includes(date.getUTCDay());
    case Frequency.EVERY_N_DAYS: {
      const created = new Date(habit.createdAt.toISOString().split("T")[0] + "T00:00:00.000Z");
      const diff = daysBetween(created, date);
      return diff >= 0 && diff % (habit.intervalDays ?? 1) === 0;
    }
    case Frequency.TIMES_PER_WEEK:
      return weekCompletedExcludingToday < (habit.timesPerWeek ?? 1);
    default:
      return false;
  }
};

export const computeStreak = (habit: HabitForStats, todayStr: string): number => {
  const today = dateFromStr(todayStr);
  const created = new Date(habit.createdAt.toISOString().split("T")[0] + "T00:00:00.000Z");
  let streak = 0;
  let current = today;
  const maxDays = Math.min(daysBetween(created, today) + 1, 365);

  for (let i = 0; i < maxDays; i++) {
    if (isHabitDueOnDate(habit, current)) {
      const log = findLog(habit.logs, current);
      if (log?.status === LogStatus.COMPLETED) {
        streak++;
      } else if (log?.status === LogStatus.SKIPPED) {
        // intentional skip: doesn't add to streak but doesn't break it
      } else {
        break;
      }
    }
    current = addDays(current, -1);
  }

  return streak;
};

export const computeBestStreak = (habit: HabitForStats): number => {
  const created = new Date(habit.createdAt.toISOString().split("T")[0] + "T00:00:00.000Z");
  const today = new Date(new Date().toISOString().split("T")[0] + "T00:00:00.000Z");
  const totalDays = daysBetween(created, today) + 1;

  let best = 0;
  let current = 0;

  for (let i = 0; i < totalDays; i++) {
    const date = addDays(created, i);
    if (isHabitDueOnDate(habit, date)) {
      const log = findLog(habit.logs, date);
      if (log?.status === LogStatus.COMPLETED) {
        current++;
        if (current > best) best = current;
      } else {
        current = 0;
      }
    }
  }

  return best;
};

export const computeWeekStatus = (
  habit: HabitForStats,
  todayStr: string,
): ("done" | "skip" | "miss" | "na")[] => {
  const today = dateFromStr(todayStr);
  // Monday of the current week (ISO week: Mon=0 … Sun=6)
  const dow = today.getUTCDay(); // 0=Sun…6=Sat
  const monday = addDays(today, -(dow === 0 ? 6 : dow - 1));

  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i);
    const isFuture = date > today;

    if (isFuture || !isHabitDueOnDate(habit, date)) return "na";

    const log = findLog(habit.logs, date);
    if (!log) return "miss";
    return log.status === LogStatus.COMPLETED ? "done" : "skip";
  });
};

export const computeMonthRate = (habit: HabitForStats, todayStr: string): number => {
  const today = dateFromStr(todayStr);
  const monthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  const totalDays = daysBetween(monthStart, today) + 1;

  let applicable = 0;
  let completed = 0;

  for (let i = 0; i < totalDays; i++) {
    const date = addDays(monthStart, i);
    if (isHabitDueOnDate(habit, date)) {
      applicable++;
      const log = findLog(habit.logs, date);
      if (log?.status === LogStatus.COMPLETED) completed++;
    }
  }

  return applicable === 0 ? 0 : Math.round((completed / applicable) * 100);
};
