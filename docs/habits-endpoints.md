# Habits — Endpoints

## Lógica central: `GET /api/habits/today`

El home screen llama este endpoint para saber qué hábitos mostrar hoy y cuáles ya fueron completados.

### ¿Cómo se decide si un hábito va hoy?

| Frecuencia | Campo | Regla |
|------------|-------|-------|
| `DAILY` | — | Siempre aparece |
| `SPECIFIC_DAYS` | `weekDays: Int[]` | `weekDays.includes(díaDeHoy)` ej: `[1,3,5]` = Lun/Mié/Vie |
| `TIMES_PER_WEEK` | `timesPerWeek: Int` | Aparece hasta completarlo N veces en la semana actual |
| `EVERY_N_DAYS` | `intervalDays: Int` | `diasDesde(createdAt) % intervalDays === 0` |

> El "hoy" se resuelve con el `timezone` del usuario (`User.timezone`, default `"America/Bogota"`).

### Respuesta de `/today`

```json
{
  "date": "2026-05-07",
  "habits": [
    {
      "id": "abc",
      "name": "Meditar",
      "color": "#7C3AED",
      "frequency": "DAILY",
      "sortOrder": 0,
      "subtasks": [{ "id": "s1", "name": "5 min respiración" }],
      "log": null
    },
    {
      "id": "def",
      "name": "Ejercicio",
      "color": "#10B981",
      "frequency": "TIMES_PER_WEEK",
      "timesPerWeek": 3,
      "weekProgress": { "completed": 2, "target": 3 },
      "log": {
        "id": "log123",
        "status": "COMPLETED",
        "note": "30 min corriendo",
        "subtaskLogs": ["s1"]
      }
    }
  ]
}
```

- `log: null` → pendiente hoy
- `log.status: "COMPLETED"` → ya completado
- `log.status: "SKIPPED"` → saltado intencionalmente
- `weekProgress` → solo presente en `TIMES_PER_WEEK`

---

## Lista completa de endpoints

Todos requieren autenticación (`Authorization: Bearer <token>`).

### CRUD de hábitos

```
GET    /api/habits              Listar hábitos activos del usuario
POST   /api/habits              Crear hábito
GET    /api/habits/:id          Obtener uno (incluye subtasks)
PATCH  /api/habits/:id          Editar (nombre, color, frecuencia, etc.)
DELETE /api/habits/:id          Archivar — soft delete (active=false, archivedAt=now)
```

### Vista del día

```
GET    /api/habits/today        Hábitos de hoy + log de cada uno
```

### Registrar cumplimiento

```
POST   /api/habits/:id/log      Marcar como COMPLETED o SKIPPED para una fecha
                                Body: { date: "YYYY-MM-DD", status: "COMPLETED"|"SKIPPED", note?: string }
                                → Hace upsert (constraint único: [habitId, date])

DELETE /api/habits/:id/log      Desmarcar — elimina el log del día
                                Query: ?date=YYYY-MM-DD

GET    /api/habits/logs         Historial en rango de fechas
                                Query: ?from=YYYY-MM-DD&to=YYYY-MM-DD
```

### Subtasks

```
POST   /api/habits/:id/subtasks                     Agregar subtarea
PATCH  /api/habits/:id/subtasks/:subtaskId          Renombrar / reordenar
DELETE /api/habits/:id/subtasks/:subtaskId          Eliminar subtarea
```

### Subtask logs

```
POST   /api/habits/:habitId/logs/:logId/subtasks/:subtaskId/toggle
       Marcar o desmarcar una subtarea dentro de un log
```

---

## Orden de implementación

1. **CRUD de hábitos** — base de todo
2. **`GET /today`** — lógica de frecuencias
3. **Logs** — marcar cumplimiento (upsert)
4. **Subtasks CRUD**
5. **Subtask logs**

---

## Archivos

### Nuevos

```
back/src/modules/habits/
├── habits.controllers.ts
├── habits.services.ts       ← isDueToday() y lógica de semana
├── habits.schemas.ts        (Zod)
└── habits.types.ts
```

### Modificados

```
back/src/routes/index.routes.ts   ← registrar rutas con authMiddleware
```

### Reutilizar

```
back/src/middlewares/asyncHandler.ts
back/src/middlewares/auth.middleware.ts
back/src/errors/appError.ts         (NotFoundError, ForbiddenError, etc.)
back/src/lib/prisma.ts
```
