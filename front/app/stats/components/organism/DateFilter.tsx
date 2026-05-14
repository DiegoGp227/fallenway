interface DateFilterProps {
    changeDate: (range: string) => void;
    dateRange: string;
}

export default function DateFilter({ changeDate, dateRange }: DateFilterProps) {
    const active = "px-2 py-1 rounded text-accent bg-accent/15 cursor-pointer hover:text-accent-bright transition-all duration-300";
    const inactive = "px-2 py-1 rounded text-text-dim hover:text-text cursor-pointer hover:bg-bg transition-all duration-300";

    return (
        <div className="flex gap-1 bg-bg/60 p-3 rounded">
            <button onClick={() => changeDate("week")} className={dateRange === "week" ? active : inactive}>Week</button>
            <button onClick={() => changeDate("month")} className={dateRange === "month" ? active : inactive}>Month</button>
            <button onClick={() => changeDate("year")} className={dateRange === "year" ? active : inactive}>Year</button>
        </div>
    );
}
