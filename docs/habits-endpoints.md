# Habits — Endpoints

## Core logic: `GET /api/habits/today`

The home screen calls this endpoint to determine which habits to show today and which ones have already been completed.

### How is it decided whether a habit is due today?

| Frequency | Field | Rule |
|---|---|---|
| `DAILY` | — | Always appears |
| `SPECIFIC_DAYS` | `weekDays: Int[]` | `weekDays.includes(todayIndex)` e.g. `[1,3,5]` = Mon/Wed/Fri |
| `TIMES_PER_WEEK` | `timesPerWeek: Int` | Appears until completed N times in the current week |
| `EVERY_N_DAYS` | `intervalDays: Int` | `daysSince(createdAt) % intervalDays === 0` |

> "Today" is resolved using the user's `timezone` (`User.timezone`, default `"America/Bogota"`).

### Response from `/today`

```json
{
  "date": "2026-05-07",
  "habits": [
    {
      "id": "abc",
      "name": "Meditate",
      "color": "#7C3AED",
      "frequency": "DAILY",
      "sortOrder": 0,
      "subtasks": [{ "id": "s1", "name": "5 min breathing" }],
      "log": null
    },
    {
      "id": "def",
      "name": "Exercise",
      "color": "#10B981",
      "frequency": "TIMES_PER_WEEK",
      "timesPerWeek": 3,
      "weekProgress": { "completed": 2, "target": 3 },
      "log": {
        "id": "log123",
        "status": "COMPLETED",
        "note": "30 min run",
        "subtaskLogs": ["s1"]
      }
    }
  ]
}
```

- `log: null` → pending today
- `log.status: "COMPLETED"` → already completed
- `log.status: "SKIPPED"` → intentionally skipped
- `weekProgress` → only present for `TIMES_PER_WEEK`

---

## Full endpoint list

All endpoints require authentication (`Authorization: Bearer <token>`).

### Habit CRUD

```
GET    /api/habits              List user's active habits
POST   /api/habits              Create a habit
GET    /api/habits/:id          Get one (includes subtasks)
PATCH  /api/habits/:id          Update (name, color, frequency, etc.)
DELETE /api/habits/:id          Archive — soft delete (active=false, archivedAt=now)
```

### Daily view

```
GET    /api/habits/today        Today's habits + their log entry
```

### Logging completion

```
POST   /api/habits/:id/log      Mark as COMPLETED or SKIPPED for a given date
                                Body: { date: "YYYY-MM-DD", status: "COMPLETED"|"SKIPPED", note?: string }
                                → Upserts (unique constraint: [habitId, date])

DELETE /api/habits/:id/log      Unmark — removes the log for the day
                                Query: ?date=YYYY-MM-DD

GET    /api/habits/logs         History within a date range
                                Query: ?from=YYYY-MM-DD&to=YYYY-MM-DD
```

### Subtasks

```
POST   /api/habits/:id/subtasks                     Add a subtask
PATCH  /api/habits/:id/subtasks/:subtaskId          Rename / reorder
DELETE /api/habits/:id/subtasks/:subtaskId          Delete a subtask
```

### Subtask logs

```
POST   /api/habits/:habitId/logs/:logId/subtasks/:subtaskId/toggle
       Mark or unmark a subtask within a log entry
```

---

## Implementation order

1. **Habit CRUD** — foundation for everything else
2. **`GET /today`** — frequency logic
3. **Logs** — mark completion (upsert)
4. **Subtasks CRUD**
5. **Subtask logs**

---

## Files

### New

```
back/src/modules/habits/
├── habits.controllers.ts
├── habits.services.ts       ← isDueToday() and weekly logic
├── habits.schemas.ts        (Zod)
└── habits.types.ts
```

### Modified

```
back/src/routes/index.routes.ts   ← register routes with authMiddleware
```

### Reuse

```
back/src/middlewares/asyncHandler.ts
back/src/middlewares/auth.middleware.ts
back/src/errors/appError.ts         (NotFoundError, ForbiddenError, etc.)
back/src/lib/prisma.ts
```
