import { PrismaClient, Frequency, LogStatus, LogSource } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const DEMO_EMAIL = "demo@habitos.app";
const DEMO_PASSWORD = "demo1234";

// Deterministic pseudo-random based on two integers
function chance(dayIndex: number, habitIndex: number, salt: number): boolean {
  const x = Math.sin(dayIndex * 127.1 + habitIndex * 311.7 + salt * 74.3) * 43758.5453;
  return (x - Math.floor(x)) < 0.78;
}

// Completion rate ramps up over the year then plateaus
function completionRate(dayIndex: number): number {
  if (dayIndex < 30) return 0.55 + dayIndex * 0.008;      // Jan: 55-79%
  if (dayIndex < 60) return 0.79 + (dayIndex - 30) * 0.003; // Feb: 79-88%
  if (dayIndex < 90) return 0.88 + (dayIndex - 60) * 0.002; // Mar: 88-94%
  return 0.82 - (dayIndex - 90) * 0.001;                    // Apr+: slight fatigue
}

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (existing) {
    console.log("Demo user already exists — skipping.");
    return;
  }

  console.log("Seeding demo data…");

  const password = await bcrypt.hash(DEMO_PASSWORD, 10);
  const user = await prisma.user.create({
    data: { name: "Diego G.", email: DEMO_EMAIL, password, timezone: "America/Bogota" },
  });

  const [catSalud, catMente, catProd] = await Promise.all([
    prisma.category.create({ data: { userId: user.id, name: "Salud", color: "#2dd4a0" } }),
    prisma.category.create({ data: { userId: user.id, name: "Mente", color: "#a00d38" } }),
    prisma.category.create({ data: { userId: user.id, name: "Productividad", color: "#f5a623" } }),
  ]);

  const habitsData = [
    { name: "Meditación diaria",  frequency: Frequency.DAILY,         weekDays: [],            categoryId: catMente.id, sortOrder: 0 },
    { name: "Ejercicio 30 min",   frequency: Frequency.SPECIFIC_DAYS, weekDays: [1, 3, 5, 6],  categoryId: catSalud.id, sortOrder: 1 },
    { name: "Leer 20 páginas",    frequency: Frequency.DAILY,         weekDays: [],            categoryId: catMente.id, sortOrder: 2 },
    { name: "Journaling",         frequency: Frequency.DAILY,         weekDays: [],            categoryId: catProd.id,  sortOrder: 3 },
    { name: "Agua · 2 litros",    frequency: Frequency.DAILY,         weekDays: [],            categoryId: catSalud.id, sortOrder: 4 },
    { name: "Sin redes sociales", frequency: Frequency.SPECIFIC_DAYS, weekDays: [1, 2, 3, 4, 5], categoryId: catProd.id, sortOrder: 5 },
  ];

  const todayStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  const today = new Date(todayStr + "T00:00:00.000Z");
  const jan1 = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));

  const habits = await Promise.all(
    habitsData.map((h) => prisma.habit.create({ data: { ...h, userId: user.id, createdAt: jan1 } })),
  );

  const logs: { habitId: string; date: Date; status: LogStatus; source: LogSource }[] = [];
  const contributions: { userId: string; date: Date; completed: number; total: number }[] = [];

  const cursor = new Date(jan1);
  let dayIndex = 0;

  while (cursor < today) {
    const date = new Date(cursor);
    const dow = date.getUTCDay();
    const rate = completionRate(dayIndex);

    let total = 0;
    let completed = 0;

    habits.forEach((habit, hi) => {
      const due =
        habit.frequency === Frequency.DAILY ||
        (habit.frequency === Frequency.SPECIFIC_DAYS && habit.weekDays.includes(dow));

      if (!due) return;
      total++;

      const roll = Math.sin(dayIndex * 127.1 + hi * 311.7) * 43758.5453;
      const frac = roll - Math.floor(roll);
      if (frac < rate) {
        completed++;
        logs.push({ habitId: habit.id, date, status: LogStatus.COMPLETED, source: LogSource.WEB });
      }
    });

    if (total > 0) contributions.push({ userId: user.id, date, completed, total });

    cursor.setUTCDate(cursor.getUTCDate() + 1);
    dayIndex++;
  }

  await prisma.habitLog.createMany({ data: logs });
  await prisma.dailyContribution.createMany({ data: contributions });

  console.log(`✓ ${habits.length} habits`);
  console.log(`✓ ${logs.length} logs across ${dayIndex} days`);
  console.log(`✓ ${contributions.length} contribution rows`);
  console.log(`\nDemo credentials:`);
  console.log(`  email:    ${DEMO_EMAIL}`);
  console.log(`  password: ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
