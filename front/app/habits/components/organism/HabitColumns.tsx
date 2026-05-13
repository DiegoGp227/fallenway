import { createColumnHelper } from "@tanstack/react-table";
import { Habit, WeekDayStatus } from "@/src/habits/types/habits.types";

const frequencyLabel: Record<string, string> = {
  DAILY: "Todos los días",
  SPECIFIC_DAYS: "Días específicos",
  TIMES_PER_WEEK: "Veces por semana",
  EVERY_N_DAYS: "Cada N días",
};

const weekDayStyles: Record<WeekDayStatus, string> = {
  done: "bg-accent",
  skip: "bg-[rgba(245,166,35,0.35)]",
  miss: "bg-border",
  na: "bg-border opacity-30",
};

const columnHelper = createColumnHelper<Habit>();

export const habitColumns = [
  columnHelper.display({
    id: "drag",
    header: () => null,
    cell: () => (
      <span className="text-text-dim cursor-grab text-xs select-none">⠿</span>
    ),
  }),

  columnHelper.accessor("name", {
    header: "Hábito",
    cell: (info) => {
      const { category, frequency, paused } = info.row.original;
      return (
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13.5px] font-medium text-text truncate">
              {info.getValue()}
            </span>
            {category && (
              <span
                className="text-[10.5px] font-semibold px-1.5 py-px rounded-full whitespace-nowrap shrink-0 border"
                style={{
                  color: category.color,
                  backgroundColor: `${category.color}1A`,
                  borderColor: `${category.color}33`,
                }}
              >
                {category.name}
              </span>
            )}
            {paused && (
              <span className="text-[10.5px] text-text-dim bg-border rounded-full px-1.5 py-px shrink-0">
                Pausado
              </span>
            )}
          </div>
          <span className="text-[11.5px] text-text-dim">
            {frequencyLabel[frequency]}
          </span>
        </div>
      );
    },
  }),

  columnHelper.accessor("streak", {
    header: "Racha actual",
    cell: (info) => {
      const streak = info.getValue();
      return streak > 0 ? (
        <span className="inline-flex items-center gap-1 bg-[#F5A6231A] border border-[#F5A62338] rounded-full px-2 py-0.5 text-[11.5px] font-semibold text-amber whitespace-nowrap">
          🔥 {streak}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 bg-border/60 border border-border rounded-full px-2 py-0.5 text-[11.5px] font-semibold text-text-dim whitespace-nowrap">
          — {streak}
        </span>
      );
    },
  }),

  columnHelper.accessor("bestStreak", {
    header: "Mejor",
    cell: (info) => (
      <span className="text-[13px] font-semibold text-text-muted">
        {info.getValue()}
        <span className="text-[11px] text-text-dim ml-0.5">d</span>
      </span>
    ),
  }),

  columnHelper.accessor("weekStatus", {
    header: "Esta semana",
    cell: (info) => (
      <div className="flex gap-0.75">
        {info.getValue().map((status, i) => (
          <div key={i} className={`w-3.25 h-3.25 rounded-[3px] ${weekDayStyles[status]}`} />
        ))}
      </div>
    ),
  }),

  columnHelper.accessor("monthRate", {
    header: "Tasa mes",
    cell: (info) => {
      const rate = info.getValue();
      return (
        <div className="flex flex-col gap-1">
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${rate >= 70 ? "bg-green" : "bg-accent"}`}
              style={{ width: `${rate}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold text-text-muted">{rate}%</span>
        </div>
      );
    },
  }),

  columnHelper.display({
    id: "actions",
    header: () => <span className="block text-right">Acciones</span>,
    cell: (info) => {
      const { paused } = info.row.original;
      return (
        <div className="flex gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button className="w-6.5 h-6.5 rounded flex items-center justify-center border border-border text-text-dim text-xs hover:text-text hover:border-border-hover transition-colors">
            ✎
          </button>
          <button className="w-6.5 h-6.5 rounded flex items-center justify-center border border-border text-text-dim text-xs hover:text-text hover:border-border-hover transition-colors">
            {paused ? "▶" : "⏸"}
          </button>
          <button className="w-6.5 h-6.5 rounded flex items-center justify-center border border-border text-text-dim text-xs hover:text-accent-bright hover:border-accent transition-colors">
            ✕
          </button>
        </div>
      );
    },
  }),
];
