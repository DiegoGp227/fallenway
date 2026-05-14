export default function DateFilter() {
    return (
        <div className="flex gap-1 bg-bg/60 p-3 rounded">
            <button className="px-2 py-1 rounded text-accent bg-accent/15 cursor-pointer hover:text-accent-bright transition-all duration-300">Week</button>
            <button className="px-2 py-1 rounded text-text-dim hover:text-text cursor-pointer hover:bg-bg transition-all duration-300">Mouth</button>
            <button className="px-2 py-1 rounded text-text-dim hover:text-text cursor-pointer hover:bg-bg transition-all duration-300">Year</button>
        </div>
    )
}