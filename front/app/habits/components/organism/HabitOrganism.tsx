import HabitList from "@/app/components/organism/HabitList";

export default function HabitOrganism() {
    return (
        <div>
            <div className="flex justify-between">
                <div className="flex gap-10">
                    <div className="bg-accent-bg px-4 py-1 rounded-2xl border-2 border-accent-bright">all</div>
                    <div className="hover:bg-bg px-4 py-1 border-2 border-transparent hover:border-border rounded-2xl transition-all duration-200">active</div>
                    <div className="hover:bg-bg px-4 py-1 border-2 border-transparent hover:border-border rounded-2xl transition-all duration-200">paused</div>
                    <div className="hover:bg-bg px-4 py-1 border-2 border-transparent hover:border-border rounded-2xl transition-all duration-200">archived</div>
                </div>
                <div className="group rounded px-2 border-2 border-gray-700 cursor-pointer hover:border-text transition-all duration-500 flex items-center">
                    <span className="text-text-muted group-hover:text-text transition-colors duration-200">
                        ↕ Sort by streak
                    </span>
                </div>
            </div>
            <HabitList />
        </div>
    )
}