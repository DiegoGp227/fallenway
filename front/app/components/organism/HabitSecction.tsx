export default function HabitSecction() {
    return (
        <div className="flex border border-bg justify-between hover:bg-surface hover:border-border-hover px-2 transition-all duration-200">
            <div className="flex gap-2 items-center">
                <div className="px-1">
                    <span className="cursor-grab text-text-muted hover:text-text">⠿</span>
                </div>
                <label className="group relative flex items-center cursor-pointer">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 rounded-md border-2 border-text-dim bg-transparent
                                    flex items-center justify-center
                                    transition-all duration-200
                                    peer-checked:bg-green peer-checked:border-green
                                    peer-focus-visible:ring-2 peer-focus-visible:ring-green/40">
                        <svg className="w-3 h-3 text-bg opacity-0 group-has-checked:opacity-100 transition-opacity duration-150"
                            viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1,5 4.5,8.5 11,1" />
                        </svg>
                    </div>
                </label>
                <div>
                    <div><span className="line-through">Daily Meditation</span></div>
                    <div><span className="text-text-muted">All days</span></div>
                </div>
            </div>



            <div className="flex items-center gap-2">
                <div className="rounded-2xl bg-[#F5A6231A] border border-[#F5A62338] px-2">
                    <span className="text-amber">
                        🔥 12
                    </span>
                </div>
                <div className="group rounded px-2 border-2 border-gray-700 cursor-pointer hover:border-text transition-all duration-500">
                    <span className="text-text-muted group-hover:text-text transition-colors duration-200">
                        Skip
                    </span>
                </div>
            </div>
        </div>
    )
}