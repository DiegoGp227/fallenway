import { LogStatus } from "@prisma/client";
import prisma from "../../db/prisma.js";
import { computeBestStreak, computeStreak, getTodayInTimezone, getWeekBounds, isHabitDueOnDate, isDueOnDateWithWeekLogs } from "../habits/habits.utils.js";

export const getContributions = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { timezone: true },
  });
  const timezone = user?.timezone ?? "America/Bogota";
  const todayStr = getTodayInTimezone(timezone);
  const today = new Date(todayStr + "T00:00:00.000Z");
  const year = today.getUTCFullYear();
  const jan1 = new Date(Date.UTC(year, 0, 1));

  const storedRows = await prisma.dailyContribution.findMany({
    where: { userId, date: { gte: jan1, lte: today } },
  });
  const storedMap = new Map(
    storedRows.map((r) => [r.date.toISOString().split("T")[0], r]),
  );

  const habits = await prisma.habit.findMany({
    where: { userId, active: true },
    include: {
      logs: { where: { date: { gte: jan1, lte: today } } },
    },
  });

  const contributions: { date: string; completed: number; total: number; level: number }[] = [];
  const cursor = new Date(jan1);

  while (cursor <= today) {
    const dateKey = cursor.toISOString().split("T")[0];
    let completed: number;
    let total: number;

    if (storedMap.has(dateKey)) {
      ({ completed, total } = storedMap.get(dateKey)!);
    } else {
      let applicable = 0;
      let comp = 0;
      for (const habit of habits) {
        if (isHabitDueOnDate({ ...habit }, cursor)) {
          applicable++;
          const log = habit.logs.find((l) => l.date.getTime() === cursor.getTime());
          if (log?.status === LogStatus.COMPLETED) comp++;
        }
      }
      completed = comp;
      total = applicable;
    }

    const rate = total > 0 ? completed / total : 0;
    let level = 0;
    if (rate > 0 && rate <= 0.25) level = 1;
    else if (rate > 0.25 && rate <= 0.5) level = 2;
    else if (rate > 0.5 && rate <= 0.75) level = 3;
    else if (rate > 0.75) level = 4;

    contributions.push({ date: dateKey, completed, total, level });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return { contributions };
};

export const getTodayStats = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { timezone: true },
  });
  const timezone = user?.timezone ?? "America/Bogota";
  const todayStr = getTodayInTimezone(timezone);
  const todayDate = new Date(todayStr + "T00:00:00.000Z");

  const sevenDaysAgo = new Date(todayDate);
  sevenDaysAgo.setUTCDate(todayDate.getUTCDate() - 6);

  const { weekStart, nextWeekStart } = getWeekBounds(todayStr);

  const [todayRow, weekRows, habits, habitsToday] = await Promise.all([
    prisma.dailyContribution.findUnique({
      where: { userId_date: { userId, date: todayDate } },
    }),
    prisma.dailyContribution.findMany({
      where: { userId, date: { gte: sevenDaysAgo, lte: todayDate } },
    }),
    prisma.habit.findMany({
      where: { userId, active: true },
      include: { logs: true },
    }),
    prisma.habit.findMany({
      where: { userId, active: true },
      include: { logs: { where: { date: { gte: weekStart, lt: nextWeekStart } } } },
    }),
  ]);

  const completedToday = todayRow?.completed ?? 0;

  let totalToday = 0;
  for (const habit of habitsToday) {
    const weekCompletedExcludingToday = habit.logs
      .filter((l) => l.date.getTime() !== todayDate.getTime() && l.status === LogStatus.COMPLETED)
      .length;
    if (isDueOnDateWithWeekLogs(habit, todayDate, weekCompletedExcludingToday)) {
      totalToday++;
    }
  }

  const weeklyRate = weekRows.length > 0
    ? Math.round(
        weekRows.reduce((sum, r) => sum + (r.total > 0 ? r.completed / r.total : 0), 0) /
          weekRows.length * 100,
      )
    : 0;

  let bestStreak = 0;
  let bestStreakHabit = "";
  for (const habit of habits) {
    const streak = computeBestStreak(habit);
    if (streak > bestStreak) {
      bestStreak = streak;
      bestStreakHabit = habit.name;
    }
  }

  const year = todayDate.getUTCFullYear();
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const yearContributions = await prisma.dailyContribution.findMany({
    where: { userId, date: { gte: jan1, lte: todayDate } },
    select: { date: true, completed: true, total: true },
  });

  const byMonth = new Map<string, { completed: number; total: number }>();
  for (const row of yearContributions) {
    const key = row.date.toISOString().slice(0, 7);
    const acc = byMonth.get(key) ?? { completed: 0, total: 0 };
    byMonth.set(key, { completed: acc.completed + row.completed, total: acc.total + row.total });
  }

  let bestMonthRate = 0;
  let bestMonthKey  = "";
  for (const [key, { completed, total }] of byMonth) {
    if (total === 0) continue;
    const rate = Math.round((completed / total) * 100);
    if (rate > bestMonthRate) { bestMonthRate = rate; bestMonthKey = key; }
  }

  return { completedToday, totalToday, weeklyRate, bestStreak, bestStreakHabit, bestMonthRate, bestMonthKey };
};

export const getStatsByRange = async (userId: string, range: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { timezone: true },
  });
  const timezone = user?.timezone ?? "America/Bogota";
  const todayStr = getTodayInTimezone(timezone);
  const today = new Date(todayStr + "T00:00:00.000Z");

  const start = new Date(today);
  if (range === "week") start.setUTCDate(today.getUTCDate() - 6);
  else if (range === "month") start.setUTCDate(today.getUTCDate() - 29);
  else start.setUTCFullYear(today.getUTCFullYear(), 0, 1);

  const habits = await prisma.habit.findMany({
    where: { userId, active: true, paused: false },
    include: { logs: true },
  });

  // Build per-habit log maps for O(1) lookup
  const habitItems = habits.map((habit) => ({
    habit,
    logMap: new Map(habit.logs.map((l) => [l.date.getTime(), l])),
    applicable: 0,
    completed: 0,
  }));

  // Single pass over the period: compute aggregate and per-habit stats together
  let totalCompleted = 0;
  let totalExpected = 0;
  let perfectDays = 0;

  const cursor = new Date(start);
  while (cursor <= today) {
    let dayCompleted = 0;
    let dayTotal = 0;
    for (const item of habitItems) {
      if (isHabitDueOnDate({ ...item.habit }, cursor)) {
        item.applicable++;
        dayTotal++;
        const log = item.logMap.get(cursor.getTime());
        if (log?.status === LogStatus.COMPLETED) {
          item.completed++;
          dayCompleted++;
        }
      }
    }
    totalCompleted += dayCompleted;
    totalExpected += dayTotal;
    if (dayTotal > 0 && dayCompleted >= dayTotal) perfectDays++;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const completionRate = totalExpected > 0
    ? Math.round((totalCompleted / totalExpected) * 100)
    : 0;

  const habitRates = habitItems
    .map(({ habit, applicable, completed }) => ({
      id: habit.id,
      name: habit.name,
      color: habit.color,
      rate: applicable > 0 ? Math.round((completed / applicable) * 100) : 0,
      streak: computeStreak({ ...habit, logs: habit.logs }, todayStr),
      bestStreak: computeBestStreak({ ...habit, logs: habit.logs }),
    }))
    .sort((a, b) => b.rate - a.rate);

  return { completionRate, perfectDays, totalCompleted, totalExpected, habitRates };
};
