import { createColumnHelper } from "@tanstack/react-table";
import { Habit, WeekDayStatus } from "@/src/habits/types/habits.types";

const weekDayStyles: Record<WeekDayStatus, string> = {
  done: "bg-accent",
  skip: "bg-[rgba(245,166,35,0.35)]",
  miss: "bg-border",
  na: "bg-border opacity-30",
};

export interface HabitTableMeta {
  onEdit: (habit: Habit) => void;
  onPause: (id: string, paused: boolean) => void;
  onDelete: (habit: Habit) => void;
}

const columnHelper = createColumnHelper<Habit>();

export const habitColumns = [
  columnHelper.accessor("name", {
    header: "Habit",
    cell: (info) => {
      const { category, frequency, paused } = info.row.original;
      const freqLabel: Record<string, string> = {
        DAILY: "Every day",
        SPECIFIC_DAYS: "Specific days",
        TIMES_PER_WEEK: "Times per week",
        EVERY_N_DAYS: "Every N days",
      };
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
                Paused
              </span>
            )}
          </div>
          <span className="text-[11.5px] text-text-dim">{freqLabel[frequency]}</span>
        </div>
      );
    },
  }),

  columnHelper.accessor("streak", {
    header: "Streak",
    cell: (info) => {
      const streak = info.getValue();
      return streak > 0 ? (
        <span className="inline-flex items-center gap-1 bg-[#F5A6231A] border border-[#F5A62338] rounded-full px-2 py-0.5 text-[11.5px] font-semibold text-amber whitespace-nowrap">
          🔥 {streak}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 bg-border/60 border border-border rounded-full px-2 py-0.5 text-[11.5px] font-semibold text-text-dim whitespace-nowrap">
          — 0
        </span>
      );
    },
  }),

  columnHelper.accessor("bestStreak", {
    header: "Best",
    cell: (info) => (
      <span className="text-[13px] font-semibold text-text-muted">
        {info.getValue()}
        <span className="text-[11px] text-text-dim ml-0.5">d</span>
      </span>
    ),
  }),

  columnHelper.accessor("weekStatus", {
    header: "This week",
    cell: (info) => (
      <div className="flex gap-0.75">
        {info.getValue().map((status, i) => (
          <div key={i} className={`w-3.25 h-3.25 rounded-[3px] ${weekDayStyles[status]}`} />
        ))}
      </div>
    ),
  }),

  columnHelper.accessor("monthRate", {
    header: "Month rate",
    cell: (info) => {
      const rate = info.getValue();
      return (
        <div className="flex flex-col gap-1 min-w-[60px]">
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
    header: () => <span className="block text-right">Actions</span>,
    cell: (info) => {
      const { paused, id } = info.row.original;
      const meta = info.table.options.meta as HabitTableMeta | undefined;
      return (
        <div className="flex gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => meta?.onEdit(info.row.original)}
            className="w-6.5 h-6.5 rounded flex items-center justify-center border border-border text-text-dim text-xs hover:text-text hover:border-border-hover transition-colors"
            title="Edit"
          >
            ✎
          </button>
          <button
            onClick={() => meta?.onPause(id, paused)}
            className="w-6.5 h-6.5 rounded flex items-center justify-center border border-border text-text-dim text-xs hover:text-text hover:border-border-hover transition-colors"
            title={paused ? "Resume" : "Pause"}
          >
            {paused ? "▶" : "⏸"}
          </button>
          <button
            onClick={() => meta?.onDelete(info.row.original)}
            className="w-6.5 h-6.5 rounded flex items-center justify-center border border-border text-text-dim text-xs hover:text-accent-bright hover:border-accent transition-colors"
            title="Delete"
          >
            ✕
          </button>
        </div>
      );
    },
  }),
];
