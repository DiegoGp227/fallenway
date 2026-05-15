# Fallenway — Habit Tracker

A full-stack habit tracking application with flexible scheduling, GitHub-style contribution heatmaps, and detailed progress analytics.

---

## Features

- **Flexible habit scheduling** — four frequency modes: daily, specific weekdays, every N days, and N times per week
- **Daily dashboard** — shows only habits due today, based on each habit's frequency and the user's timezone
- **Contribution heatmap** — GitHub-style grid with pre-calculated daily summaries for fast rendering
- **Statistics dashboard** — completion rates and streaks across custom date ranges with animated charts
- **Subtasks** — break a habit into trackable sub-steps with individual completion logs
- **Categories** — organize habits with custom labels and colors
- **Drag-and-drop reordering** — reorder habits on the dashboard
- **JWT authentication** — stateless auth with client-side token expiration detection
- **Timezone-aware** — all "today" calculations use the user's local timezone, not server time

---

## Tech Stack

### Frontend
| Technology | Role |
|---|---|
| **Next.js 15 + React 19** | Framework, SSR, file-based routing |
| **TypeScript** | End-to-end type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **SWR** | Data fetching with caching and revalidation |
| **Easy-Peasy** | Redux-based global state (auth persistence) |
| **React Hook Form** | Form handling and validation |
| **Framer Motion** | Animations and transitions |
| **@dnd-kit** | Drag-and-drop habit reordering |
| **TanStack Table** | Headless data tables |

### Backend
| Technology | Role |
|---|---|
| **Node.js + Express 5** | REST API server |
| **TypeScript** | Type safety across the stack |
| **Prisma 7** | ORM with type-safe queries |
| **PostgreSQL 16** | Primary database |
| **Zod** | Runtime schema validation |
| **JWT + bcryptjs** | Authentication and password hashing |

### Infrastructure
| Technology | Role |
|---|---|
| **Docker + Docker Compose** | Local development orchestration |
| **Prisma Migrate** | Database schema versioning |

---

## Architecture Highlights

### Frequency engine
Habits support four scheduling modes, each evaluated differently at query time:

- `DAILY` — always appears
- `SPECIFIC_DAYS` — filtered by weekday array (e.g. `[1, 3, 5]` for Mon/Wed/Fri)
- `EVERY_N_DAYS` — deterministic modulo calculation from creation date
- `TIMES_PER_WEEK` — appears until N completions are logged in the current week; requires reading historical logs to compute remaining quota

All modes are evaluated in a single `GET /habits/today` query using timezone-correct date math.

### Pre-computed contribution table
Rather than running expensive date-range aggregations on every heatmap render, completed logs trigger an upsert to a `DailyContribution` table that stores `(userId, date, completed, total)`. The heatmap reads directly from this table — constant time regardless of history length.

### Module-based backend structure
The backend is organized as self-contained feature modules (`auth`, `habits`, `categories`, `stats`), each with its own controller, service, and route file. A central router composes them. This mirrors NestJS conventions without the framework overhead.

### Auth flow
1. User authenticates → server returns a signed JWT
2. Token stored in localStorage via Easy-Peasy persisted state
3. SWR provider checks token expiration before each request
4. Express middleware validates the token on every protected route

---

## Project Structure

```
fallenway/
├── back/
│   ├── prisma/
│   │   ├── schema.prisma       # Data models
│   │   └── seed.ts             # Sample data
│   └── src/
│       ├── modules/            # Feature modules (habits, auth, stats, categories)
│       ├── middlewares/        # Auth, error handling, async wrapper
│       ├── errors/             # Typed error hierarchy (AppError)
│       └── utils/              # Logger
│
├── front/
│   ├── app/                    # Next.js app router (pages + layouts)
│   │   ├── habits/             # Habit list and detail views
│   │   ├── stats/              # Analytics page
│   │   └── auth/               # Login / signup
│   ├── src/
│   │   ├── habits/             # Hooks, services, and types for habits
│   │   ├── auth/               # Auth hooks and services
│   │   └── shared/             # Reusable hooks, API client, utilities
│   ├── store/                  # Easy-Peasy global store
│   └── provider/               # SWR + store context wrapper
│
├── docs/                       # Architecture and API documentation
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 20+

### Run locally

```bash
# Clone the repository
git clone https://github.com/your-username/fallenway.git
cd fallenway

# Start PostgreSQL
docker compose up -d db

# Backend
cd back
cp .env.example .env       # set DATABASE_URL and JWT_SECRET
npm install
npm run prisma:migrate
npm run prisma:seed        # optional: load sample data
npm run dev

# Frontend (new terminal)
cd ../front
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing tokens |
| `PORT` | Backend port (default: `3001`) |

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/signup` | Register a new user |
| `POST` | `/api/login` | Authenticate and receive JWT |
| `GET` | `/api/habits/today` | Habits due today with completion status |
| `GET` | `/api/habits` | All active habits |
| `POST` | `/api/habits` | Create a habit |
| `PATCH` | `/api/habits/:id` | Update a habit |
| `DELETE` | `/api/habits/:id` | Archive a habit |
| `POST` | `/api/habits/:id/log` | Log a completion |
| `GET` | `/api/stats` | Progress stats by date range |
| `GET` | `/api/stats/contributions` | Contribution heatmap data |
| `GET` | `/api/categories` | List categories |

Full endpoint documentation is in [`/docs/habits-endpoints.md`](./docs/habits-endpoints.md).

---

## Data Model

```
User ──< Habit ──< HabitLog
              ──< Subtask ──< SubtaskLog
              ──< Category
User ──< DailyContribution
```

Key design decisions:
- `HabitLog` has a unique constraint on `(habitId, date)` — upsert semantics, no duplicate logs
- `DailyContribution` is denormalized by design for O(1) heatmap reads
- Frequency metadata is stored as a union of nullable fields on the `Habit` model, discriminated by a `FrequencyType` enum

---

## Author

Diego GP — [diego.gp227@gmail.com](mailto:diego.gp227@gmail.com)
