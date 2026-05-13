import { LogStatus } from "@prisma/client";
import prisma from "../../db/prisma.js";
import { getTodayInTimezone, isHabitDueOnDate } from "../habits/habits.utils.js";

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
