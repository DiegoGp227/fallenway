interface ProgressBadgeProps {
    completed: number
    total: number
}

export default function ProgressBadge({ completed, total }: ProgressBadgeProps) {
    return (
        <div className="border-accent-bright rounded-4xl bg-accent-dark border-2 px-2">
            <p>{completed}/{total} Complete</p>
        </div>
    )
}