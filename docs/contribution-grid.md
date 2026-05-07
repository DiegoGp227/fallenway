# Contribution Grid — Diseño de datos

Panel tipo GitHub que muestra el historial de completado diario.
Basado en el schema actual de Prisma.

---

## El problema

Cada celda necesita: **¿cuántos hábitos aplicaban ese día y cuántos se completaron?**

Calcularlo en cada request requiere cruzar frecuencias × logs × N días — costoso.
La solución es una tabla `daily_summary` que se mantiene actualizada en tiempo real.

---

## Tabla propuesta

```prisma
model DailySummary {
  id        String   @id @default(cuid())
  userId    String
  date      DateTime @db.Date
  completed Int      @default(0)
  total     Int      @default(0)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date])
  @@map("daily_summaries")
}
```

El request de la grilla queda en una sola query:

```ts
prisma.dailySummary.findMany({
  where: { userId, date: { gte: subWeeks(new Date(), 16) } }
})
```

---

## Qué cuenta como "total" según frecuencia

Tu schema tiene 4 tipos de frecuencia. No todos aplican igual por día:

| Frequency       | Lógica para `total` del día                                      |
|-----------------|------------------------------------------------------------------|
| `DAILY`         | Siempre suma 1                                                   |
| `SPECIFIC_DAYS` | Suma 1 solo si el día de la semana está en `weekDays[]`          |
| `EVERY_N_DAYS`  | Suma 1 si `(date - habit.createdAt) % intervalDays === 0`        |
| `TIMES_PER_WEEK`| No aplica por día — ver nota abajo                               |

> **`TIMES_PER_WEEK`**: la semana tiene un target (ej. 3 veces), no un día específico.
> Para la grilla, la opción más simple es tratarlo como "¿hubo un log ese día?" — binario,
> sin contar en `total`. Suma 1 a `completed` si hay log, pero no penaliza días sin log.

---

## Helpers para calcular si un hábito aplica en una fecha

```ts
function habitAppliesToDate(habit: Habit, date: Date): boolean {
  switch (habit.frequency) {
    case 'DAILY':
      return true;

    case 'SPECIFIC_DAYS':
      // weekDays usa el mismo índice que getDay() (0=Dom, 1=Lun...)
      return habit.weekDays.includes(date.getDay());

    case 'EVERY_N_DAYS': {
      const daysSinceCreation = differenceInDays(date, habit.createdAt);
      return daysSinceCreation >= 0 && daysSinceCreation % habit.intervalDays! === 0;
    }

    case 'TIMES_PER_WEEK':
      return false; // no penaliza días individuales
  }
}
```

---

## Cuándo actualizar `daily_summary`

### Al completar / descompletar un hábito

```ts
// COMPLETED o SKIPPED → completed + 1
// SKIPPED: el usuario decidió conscientemente no hacerlo,
// se considera "gestionado" (no penaliza la celda)

async function onLogCreated(habitId: string, date: Date, status: LogStatus) {
  if (status === 'SKIPPED') return; // no afecta completed

  const habit = await getHabit(habitId);
  await upsertDailySummary(habit.userId, date, { completedDelta: +1 });
}

async function onLogDeleted(habitId: string, date: Date, status: LogStatus) {
  if (status === 'SKIPPED') return;

  const habit = await getHabit(habitId);
  await upsertDailySummary(habit.userId, date, { completedDelta: -1 });
}
```

### Al crear un hábito

El hábito empieza hoy. El pasado no le pertenece.

```ts
async function onHabitCreated(habit: Habit) {
  const today = getTodayForUser(habit.userId); // ⚠️ usar timezone del usuario

  if (habitAppliesToDate(habit, today)) {
    await upsertDailySummary(habit.userId, today, { totalDelta: +1 });
  }
}
```

### Al archivar un hábito (`archivedAt` ya existe en tu schema)

El historial pasado es inmutable — refleja la realidad de lo que tenías que hacer.
Solo se ajusta el día de hoy.

```ts
async function onHabitArchived(habit: Habit) {
  const today = getTodayForUser(habit.userId);

  if (!habitAppliesToDate(habit, today)) return;

  // ¿Ya estaba completado hoy?
  const log = await getLogForToday(habit.id, today);
  const completedDelta = log?.status === 'COMPLETED' ? -1 : 0;

  await upsertDailySummary(habit.userId, today, {
    totalDelta: -1,
    completedDelta,
  });
}
```

### Helper upsert

```ts
async function upsertDailySummary(
  userId: string,
  date: Date,
  delta: { totalDelta?: number; completedDelta?: number }
) {
  await prisma.dailySummary.upsert({
    where: { userId_date: { userId, date } },
    create: {
      userId,
      date,
      completed: Math.max(0, delta.completedDelta ?? 0),
      total:     Math.max(0, delta.totalDelta ?? 0),
    },
    update: {
      completed: { increment: delta.completedDelta ?? 0 },
      total:     { increment: delta.totalDelta ?? 0 },
    },
  });
}
```

---

## Creación de la fila del día actual

La fila de hoy no existe hasta que algo la crea. El mejor momento es al servir
la pantalla principal por primera vez en el día:

```ts
async function ensureTodaySummary(userId: string) {
  const today = getTodayForUser(userId);
  const exists = await prisma.dailySummary.findUnique({
    where: { userId_date: { userId, date: today } }
  });
  if (exists) return;

  const activeHabits = await prisma.habit.findMany({
    where: { userId, active: true, archivedAt: null }
  });

  const total = activeHabits.filter(h => habitAppliesToDate(h, today)).length;

  await prisma.dailySummary.create({
    data: { userId, date: today, completed: 0, total }
  });
}
```

---

## Timezone ⚠️

Tu `User` tiene `timezone` (default `"America/Bogota"`). "Hoy" es relativo al usuario.
Nunca uses `new Date()` directamente para comparar fechas de hábitos.

```ts
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

function getTodayForUser(userId: string): Date {
  // Obtener timezone del usuario (cacheado o desde DB)
  const tz = getUserTimezone(userId); // ej. "America/Bogota"
  const zonedNow = toZonedTime(new Date(), tz);
  return startOfDay(zonedNow);
}
```

---

## Conversión a niveles para la grilla

```ts
type Level = 0 | 1 | 2 | 3 | 4;

function getLevel(completed: number, total: number): Level {
  if (total === 0) return 0;
  const pct = completed / total;
  if (pct === 0)    return 0;
  if (pct < 0.34)   return 1;
  if (pct < 0.67)   return 2;
  if (pct < 0.85)   return 3;
  return 4;
}
```

---

## Reglas de negocio — resumen

| Evento                  | `daily_summary` pasado | `daily_summary` hoy              |
|-------------------------|------------------------|----------------------------------|
| Completar hábito        | Sin cambios            | `completed + 1`                  |
| Descompletar hábito     | Sin cambios            | `completed - 1`                  |
| Saltar hábito (SKIPPED) | Sin cambios            | Sin cambios                      |
| Crear hábito            | Sin cambios            | `total + 1` si aplica hoy        |
| Archivar hábito         | Sin cambios            | `total - 1`, `completed - 1` si estaba completado |
| Cambiar frecuencia      | Sin cambios            | Recalcular `total` solo para hoy |

**El historial es inmutable hacia atrás.** Solo el presente se actualiza.

---

## Pendiente / edge cases a resolver

- [ ] **Cambio de frecuencia de un hábito**: igual que archivar + crear — restar
      del `total` de hoy si ya no aplica, sumar si ahora aplica.
- [ ] **Migración inicial**: para usuarios existentes, hacer un backfill con una
      query que recorra `HabitLog` agrupado por fecha y usuario.
- [ ] **`TIMES_PER_WEEK` en la grilla**: definir si se muestra o se omite del total.
- [ ] **Negativos en `completed`/`total`**: añadir `CHECK (completed >= 0)` y
      `CHECK (total >= 0)` en la migración para evitar inconsistencias.
